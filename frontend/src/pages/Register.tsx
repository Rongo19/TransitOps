// src/pages/Register.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiClient } from "../api/clients";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["FLEET_MANAGER", "DISPATCHER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"], {
     message: "Select a role"
  }),
});
type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [serverError, setServerError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setServerError(null);
    try {
      const res = await apiClient.post("/auth/register", data);
      login(res.data.data.user, res.data.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? "Could not create account.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
        <p className="text-sm text-gray-500 mt-1">Set up access for your role</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">Name</label>
            <input {...register("name")} placeholder="Rohan" className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
            <input {...register("email")} type="email" placeholder="you@transitops.in" className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">Password</label>
            <input {...register("password")} type="password" placeholder="••••••••" className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">Role</label>
            <select {...register("role")} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option value="">Select role</option>
              <option value="FLEET_MANAGER">Fleet Manager</option>
              <option value="DISPATCHER">Dispatcher</option>
              <option value="SAFETY_OFFICER">Safety Officer</option>
              <option value="FINANCIAL_ANALYST">Financial Analyst</option>
            </select>
            {errors.role && <p className="text-xs text-red-600 mt-1">{errors.role.message}</p>}
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2">❌ {serverError}</div>
          )}

          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-md transition">
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
