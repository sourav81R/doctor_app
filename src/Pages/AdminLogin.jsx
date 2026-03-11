import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { getAdminSession, loginAdmin, setAdminSession } from "../services/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const existingSession = useMemo(() => getAdminSession(), []);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (existingSession?.token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await loginAdmin(credentials);
      setAdminSession({
        token: response.data.token,
        admin: response.data.admin,
      });
      navigate("/admin/dashboard", { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Unable to login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-100 px-4 py-28 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-500 p-8 text-white shadow-xl sm:p-10">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">Admin Portal</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight">Manage clinic appointments securely.</h1>
          <p className="mt-5 max-w-xl text-base text-white/80">
            Login to review appointment submissions, monitor daily totals, filter patients, and delete outdated records.
          </p>

          <div className="mt-10 space-y-4 rounded-3xl bg-white/10 p-6 backdrop-blur">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
              <p className="text-sm text-white/70">Protected endpoints</p>
              <p className="mt-2 text-lg font-semibold">JWT-authenticated admin access</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
              <p className="text-sm text-white/70">Backend</p>
              <p className="mt-2 text-lg font-semibold">PHP 8 + MySQL REST API</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Login</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Admin Sign In</h2>
            <p className="mt-2 text-sm text-slate-500">
              {location.state?.from
                ? `Please sign in to continue to ${location.state.from}.`
                : "Use your admin credentials to access the dashboard."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="admin@clinic.com"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-blue-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:bg-blue-700"
            >
              {isLoading ? "Signing in..." : "Login to Dashboard"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Need to return to the site?{" "}
            <Link to="/" className="font-semibold text-blue-600 hover:text-blue-700">
              Go back home
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
