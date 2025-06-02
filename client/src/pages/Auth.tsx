import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Auth() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(form.email, form.password);
        setSuccess("Login successful!");
        setTimeout(() => navigate("/profile"), 1000);
      } else {
        await register({
          email: form.email,
          password: form.password,
          username: form.username,
          firstName: form.firstName,
          lastName: form.lastName,
        });
        setSuccess("Registration successful!");
        setTimeout(() => navigate("/profile"), 1000);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 px-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 shadow-xl p-8">
        <h1 className="mb-6 text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300 tracking-tight">
          {isLogin ? "Log in" : "Sign Up"}
        </h1>{" "}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-sky-400 mb-1">
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  className="block w-full rounded-lg bg-slate-700 px-3 py-2 text-slate-300 focus:outline-2 focus:outline-sky-500 focus:ring-2 focus:ring-zinc-950"
                  placeholder="your_username"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sky-400 mb-1">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                    className="block w-full rounded-lg bg-slate-700 px-3 py-2 text-slate-300 focus:outline-2 focus:outline-sky-500 focus:ring-2 focus:ring-zinc-950"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sky-400 mb-1">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    className="block w-full rounded-lg bg-slate-700 px-3 py-2 text-slate-300 focus:outline-2 focus:outline-sky-500 focus:ring-2 focus:ring-zinc-950"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-sky-400 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="block w-full rounded-lg bg-slate-700 px-3 py-2 text-slate-300 focus:outline-2 focus:outline-sky-500 focus:ring-2 focus:ring-zinc-950"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sky-400 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="block w-full rounded-lg bg-slate-700 px-3 py-2 text-slate-300 focus:outline-2 focus:outline-sky-500 focus:ring-2 focus:ring-zinc-950"
              placeholder="••••••••"
              required
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm text-center">{success}</div>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-sky-500 py-2 font-semibold text-white shadow hover:bg-zinc-500 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading
              ? isLogin
                ? "Logining In..."
                : "Signing Up..."
              : isLogin
              ? "Log In"
              : "Sign Up"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-sky-500 hover:underline text-sm font-medium"
            onClick={() => {
              setIsLogin((v) => !v);
              setError("");
              setSuccess("");
            }}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
