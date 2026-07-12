// tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateDriver } from "../../api/drivers";

const driverSchema = z.object({
  name: z.string().min(1, "Name is required"),
  licenseNumber: z.string().min(3, "License number is required"),
  licenseCategory: z.string().min(1, "Select a category"),
  licenseExpiryDate: z.string().min(1, "Expiry date is required"),
  contactNumber: z
    .string()
    .regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
});

type DriverForm = z.infer<typeof driverSchema>;

export function AddDriverModal({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending, error } = useCreateDriver();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DriverForm>({ resolver: zodResolver(driverSchema) });

  const onSubmit = async (data: DriverForm) => {
    await mutateAsync({ ...data, safetyScore: 100, status: "AVAILABLE" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900">Add driver</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500">Name</label>
            <input
              {...register("name")}
              placeholder="Alex"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500">License number</label>
              <input
                {...register("licenseNumber")}
                placeholder="DL-88213"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              {errors.licenseNumber && (
                <p className="text-xs text-red-600 mt-1">{errors.licenseNumber.message}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Category</label>
              <select
                {...register("licenseCategory")}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select</option>
                <option value="LMV">LMV</option>
                <option value="HMV">HMV</option>
              </select>
              {errors.licenseCategory && (
                <p className="text-xs text-red-600 mt-1">{errors.licenseCategory.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">License expiry date</label>
            <input
              {...register("licenseExpiryDate")}
              type="date"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            {errors.licenseExpiryDate && (
              <p className="text-xs text-red-600 mt-1">{errors.licenseExpiryDate.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">Contact number</label>
            <input
              {...register("contactNumber")}
              placeholder="9876543210"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            {errors.contactNumber && (
              <p className="text-xs text-red-600 mt-1">{errors.contactNumber.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-md px-3 py-2">
              Could not save driver. Please check the details and try again.
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-md font-medium disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Save driver"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

