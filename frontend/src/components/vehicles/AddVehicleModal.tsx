import { AddVehicleModel } from "./AddVehicleModel";

export function AddVehicleModal({ onClose }: { onClose: () => void }) {
  return <AddVehicleModel onClose={onClose} />;
}
