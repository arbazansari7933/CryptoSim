import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setMessage("");
      const res = await api.post("/auth/register", data);
      setMessage(res.data.message || "Account created!");
      setSuccess(true);
      reset();
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setMessage(error?.response?.data?.message || "Registration failed");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-xl font-bold tracking-widest text-white uppercase">
            Crypto<span className="text-emerald-400">Sim</span>
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Simulated trading · no real money
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0f0f17] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white">Create account</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
            {message && (
              <div
                className={`text-xs px-4 py-3 rounded-lg border ${
                  success
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                {message}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="text-xs text-slate-500 block mb-1.5">
                Full name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full bg-white/5 border border-white/8 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-white/20 transition-colors"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-slate-500 block mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/8 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-white/20 transition-colors"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-slate-500 block mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                className="w-full bg-white/5 border border-white/8 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-white/20 transition-colors"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-black transition-all disabled:opacity-50 mt-1"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="text-center text-xs text-slate-500 pt-1">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
