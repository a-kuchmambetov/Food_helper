import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Auth() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/catalog");
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
        await login(form.email, form.password, rememberMe);
        // If login is successful, the AuthContext will handle the redirect
        // If user is not verified, login will throw an error
      } else {
        // Registration flow
        const result = await register({
          email: form.email,
          password: form.password,
          name: form.name,
        });

        // Registration successful - show verification message
        setRegisteredEmail(form.email);
        setShowVerificationPrompt(true);
        setSuccess(result.message);
        // Clear the form
        setForm({ name: "", email: "", password: "" });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Check if it's an email verification error during login
        if (
          err.message.includes("verify") ||
          err.message.includes("verification")
        ) {
          // Redirect to verification page with email info
          navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
          return;
        }
        setError(err.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoToVerification = () => {
    navigate(`/verify-email?email=${encodeURIComponent(registeredEmail)}`);
  };
  const handleBackToAuth = () => {
    setShowVerificationPrompt(false);
    setSuccess("");
    setRegisteredEmail("");
    setIsLogin(true); // Set back to sign-in mode
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black to-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Food Helper</h1>
          <p className="text-tertiary-600 text-sm">
            {showVerificationPrompt
              ? "Account created successfully!"
              : isLogin
              ? "Welcome back! Sign in to your account"
              : "Create your account to get started"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-8">
          {showVerificationPrompt ? (
            /* Verification Prompt */
            <div className="text-center">
              <div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Account Created Successfully!
              </h2>
              <p className="text-gray-300 mb-4">{success}</p>
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-300">
                  📧 We've sent a verification email to{" "}
                  <strong>{registeredEmail}</strong>. Please check your inbox
                  and click the verification link to activate your account.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleGoToVerification}
                  className="w-full bg-violet-800 hover:bg-violet-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                >
                  Go to Email Verification
                </button>
                <button
                  onClick={handleBackToAuth}
                  className="w-full text-zinc-400 hover:text-white transition-colors duration-200 py-2"
                >
                  ← Back to Sign In
                </button>
              </div>
            </div>
          ) : (
            /* Normal Auth Form */
            <>
              <div className="flex mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError("");
                    setSuccess("");
                  }}
                  className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    isLogin
                      ? "bg-zinc-800 text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-bg-active"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError("");
                    setSuccess("");
                  }}
                  className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ml-2 ${
                    !isLogin
                      ? "bg-zinc-800 text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-bg-active"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        className="block w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-zinc-600 transition-all duration-200"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="block w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-zinc-600 transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    className="block w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-zinc-600 transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-zinc-600 rounded bg-zinc-800 focus:ring-2 focus:ring-offset-0 focus:ring-offset-zinc-900"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-300 select-none cursor-pointer"
                      >
                        Keep me signed in for 30 days
                      </label>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-600 text-white p-3 rounded-lg text-sm text-center">
                    {error}
                  </div>
                )}
                {success && !showVerificationPrompt && (
                  <div className="bg-green-600 text-white p-3 rounded-lg text-sm text-center">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-lg bg-violet-800 border border-zinc-800 py-3 font-semibold text-white hover:bg-violet-950 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading
                    ? isLogin
                      ? "Signing In..."
                      : "Creating Account..."
                    : isLogin
                    ? "Sign In"
                    : "Sign Up"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
