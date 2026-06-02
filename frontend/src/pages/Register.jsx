import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
const navigate = useNavigate();

const [message, setMessage] = useState("");
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


  const res = await api.post(
    "/auth/register",
    data
  );

  setMessage(
    res.data.message ||
      "Registration successful!"
  );

  reset();

  setTimeout(() => {
    navigate("/login");
  }, 1000);

} catch (error) {
  setMessage(
    error?.response?.data?.message ||
      "Registration failed"
  );
} finally {
  setLoading(false);
}


};

return ( <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

  <div className="absolute w-72 h-72 bg-yellow-500/20 blur-3xl rounded-full top-10 left-10"></div>
  <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

  <div className="relative w-full max-w-md">

    <div className="text-center mb-8">
      <h1 className="text-5xl font-bold text-white">
        CryptoSim
      </h1>

      <p className="text-slate-400 mt-3">
        Practice trading without risking real money
      </p>
    </div>

    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-2xl"
    >
      <h2 className="text-2xl font-semibold text-white text-center mb-6">
        Create Account
      </h2>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <p className="text-yellow-400 text-sm text-center">
            {message}
          </p>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-slate-300 mb-2 text-sm">
          Full Name
        </label>

        <input
          type="text"
          placeholder="Enter your name"
          className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          {...register("name", {
            required: "Name is required",
          })}
        />

        {errors.name && (
          <p className="text-red-400 text-sm mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-slate-300 mb-2 text-sm">
          Email Address
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          {...register("email", {
            required: "Email is required",
          })}
        />

        {errors.email && (
          <p className="text-red-400 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-slate-300 mb-2 text-sm">
          Password
        </label>

        <input
          type="password"
          placeholder="Create a password"
          className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message:
                "Password must be at least 6 characters",
            },
          })}
        />

        {errors.password && (
          <p className="text-red-400 text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition duration-200 disabled:opacity-50"
      >
        {loading
          ? "Creating Account..."
          : "Create Account"}
      </button>

      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-slate-700"></div>
        <span className="px-3 text-slate-500 text-sm">
          OR
        </span>
        <div className="flex-1 border-t border-slate-700"></div>
      </div>

      <p className="text-center text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-yellow-500 hover:text-yellow-400 font-medium"
        >
          Login
        </Link>
      </p>
    </form>

    <p className="text-center text-slate-600 text-sm mt-6">
      Simulated trading • No real money involved
    </p>
  </div>
</div>


);
};

export default Register;
