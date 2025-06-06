import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

// Password validation function
const validatePassword = (password: string) => {
  const errors = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push(
      "Password must contain at least one special character (@$!%*?&)"
    );
  }

  return errors;
};

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
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/catalog");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Validate password on change for registration
    if (name === "password" && !isLogin) {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Client-side password validation for registration
    if (!isLogin) {
      const errors = validatePassword(form.password);
      if (errors.length > 0) {
        setError("Please fix the password requirements listed below");
        setPasswordErrors(errors);
        setLoading(false);
        return;
      }
    }

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
    setPasswordErrors([]);
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
                {" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError("");
                    setSuccess("");
                    setPasswordErrors([]);
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
                    setPasswordErrors([]);
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
                </div>{" "}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      className={`block w-full rounded-lg bg-zinc-800 border px-4 py-3 pr-12 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        !isLogin && passwordErrors.length > 0
                          ? "border-red-500 focus:ring-red-500 focus:border-red-400"
                          : "border-zinc-700 focus:ring-zinc-700 focus:border-zinc-600"
                      }`}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {/* Password requirements for registration */}
                  {!isLogin && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 mb-2">
                        Password must contain:
                      </p>
                      <div className="space-y-1">
                        {[
                          {
                            test: (pwd: string) => pwd.length >= 8,
                            text: "At least 8 characters",
                          },
                          {
                            test: (pwd: string) => /(?=.*[a-z])/.test(pwd),
                            text: "One lowercase letter",
                          },
                          {
                            test: (pwd: string) => /(?=.*[A-Z])/.test(pwd),
                            text: "One uppercase letter",
                          },
                          {
                            test: (pwd: string) => /(?=.*\d)/.test(pwd),
                            text: "One number",
                          },
                          {
                            test: (pwd: string) => /(?=.*[@$!%*?&])/.test(pwd),
                            text: "One special character (@$!%*?&)",
                          },
                        ].map((requirement, index) => {
                          const isValid = requirement.test(form.password);
                          return (
                            <div
                              key={index}
                              className="flex items-center text-xs"
                            >
                              <span
                                className={`mr-2 ${
                                  isValid ? "text-green-400" : "text-red-400"
                                }`}
                              >
                                {isValid ? "✓" : "✗"}
                              </span>
                              <span
                                className={
                                  isValid ? "text-green-400" : "text-gray-400"
                                }
                              >
                                {requirement.text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
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
