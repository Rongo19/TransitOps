import { prisma } from "../utils/prisma";

function generateTripCode() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TR${random}`;
}

export async function listTrips() {
  return prisma.trip.findMany({
    include: {
      vehicle: { select: { id: true, registrationNumber: true, name: true } },
      driver: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTripById(id: string) {
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: { vehicle: true, driver: true },
  });
  if (!trip) throw { status: 404, message: "Trip not found" };
  return trip;
}

// CREATE — trip starts as DRAFT, but we still validate cargo weight up front
// so the UI's live capacity check is backed by a real server-side check too.
export async function createTrip(data: {
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeight: number;
  plannedDistance: number;
}) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) throw { status: 404, message: "Vehicle not found" };

  if (data.cargoWeight > vehicle.maxLoadCapacity) {
    throw {
      status: 400,
      message: `Cargo weight (${data.cargoWeight}kg) exceeds vehicle capacity (${vehicle.maxLoadCapacity}kg)`,
    };
  }

  return prisma.trip.create({
    data: {
      tripCode: generateTripCode(),
      source: data.source,
      destination: data.destination,
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      cargoWeight: data.cargoWeight,
      plannedDistance: data.plannedDistance,
      status: "DRAFT",
    },
    include: {
      vehicle: { select: { id: true, registrationNumber: true, name: true } },
      driver: { select: { id: true, name: true } },
    },
  });
}

// DISPATCH — the heart of the business rule engine.
// Validates: vehicle available, driver available, license not expired, driver not suspended,
// cargo weight still within capacity (re-checked in case vehicle changed since draft creation),
// then atomically flips trip → DISPATCHED, vehicle → ON_TRIP, driver → ON_TRIP.
export async function dispatchTrip(tripId: string) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { vehicle: true, driver: true },
  });
  if (!trip) throw { status: 404, message: "Trip not found" };
  if (trip.status !== "DRAFT") {
    throw { status: 400, message: `Cannot dispatch a trip that is ${trip.status}` };
  }
  if (!trip.vehicle || !trip.driver) {
    throw { status: 400, message: "Trip must have a vehicle and driver assigned before dispatch" };
  }
   if (trip.driver.status === "SUSPENDED") {
    throw { status: 400, message: "Driver is suspended and cannot be dispatched" };
  }
  
  if (trip.vehicle.status !== "AVAILABLE") {
    throw { status: 400, message: `Vehicle is currently ${trip.vehicle.status}, not available for dispatch` };
  }
  if (trip.driver.status !== "AVAILABLE") {
    throw { status: 400, message: `Driver is currently ${trip.driver.status}, not available for dispatch` };
  }
 
  if (new Date(trip.driver.licenseExpiryDate) < new Date()) {
    throw { status: 400, message: "Driver's license has expired" };
  }
  if (trip.cargoWeight > trip.vehicle.maxLoadCapacity) {
    throw {
      status: 400,
      message: `Cargo weight (${trip.cargoWeight}kg) exceeds vehicle capacity (${trip.vehicle.maxLoadCapacity}kg)`,
    };
  }

  const [updatedTrip] = await prisma.$transaction([
    prisma.trip.update({
      where: { id: tripId },
      data: { status: "DISPATCHED", dispatchedAt: new Date() },
      include: {
        vehicle: { select: { id: true, registrationNumber: true, name: true } },
        driver: { select: { id: true, name: true } },
      },
    }),
    prisma.vehicle.update({ where: { id: trip.vehicleId! }, data: { status: "ON_TRIP" } }),
    prisma.driver.update({ where: { id: trip.driverId! }, data: { status: "ON_TRIP" } }),
  ]);

  return updatedTrip;
}

// COMPLETE — captures final odometer + fuel consumed, restores vehicle/driver to AVAILABLE.
export async function completeTrip(tripId: string, finalOdometer: number, fuelConsumed: number) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw { status: 404, message: "Trip not found" };
  if (trip.status !== "DISPATCHED") {
    throw { status: 400, message: `Cannot complete a trip that is ${trip.status}` };
  }

  const [updatedTrip] = await prisma.$transaction([
    prisma.trip.update({
      where: { id: tripId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        finalOdometer,
        fuelConsumed,
      },
      include: {
        vehicle: { select: { id: true, registrationNumber: true, name: true } },
        driver: { select: { id: true, name: true } },
      },
    }),
    prisma.vehicle.update({
      where: { id: trip.vehicleId! },
      data: { status: "AVAILABLE", odometer: finalOdometer },
    }),
    prisma.driver.update({ where: { id: trip.driverId! }, data: { status: "AVAILABLE" } }),
    // fuel log gets created here too, since "complete trip" captures fuel consumed
    prisma.fuelLog.create({
      data: {
        vehicleId: trip.vehicleId!,
        tripId: trip.id,
        liters: fuelConsumed,
        cost: 0, // updated later via a real fuel-cost entry if needed
        date: new Date(),
      },
    }),
  ]);

  return updatedTrip;
}

// CANCEL — only valid from DISPATCHED, restores vehicle/driver to AVAILABLE.
export async function cancelTrip(tripId: string) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw { status: 404, message: "Trip not found" };
  if (trip.status !== "DISPATCHED") {
    throw { status: 400, message: `Cannot cancel a trip that is ${trip.status}` };
  }

  const [updatedTrip] = await prisma.$transaction([
    prisma.trip.update({
      where: { id: tripId },
      data: { status: "CANCELLED", cancelledAt: new Date() },
      include: {
        vehicle: { select: { id: true, registrationNumber: true, name: true } },
        driver: { select: { id: true, name: true } },
      },
    }),
    prisma.vehicle.update({ where: { id: trip.vehicleId! }, data: { status: "AVAILABLE" } }),
    prisma.driver.update({ where: { id: trip.driverId! }, data: { status: "AVAILABLE" } }),
  ]);

  return updatedTrip;
}
