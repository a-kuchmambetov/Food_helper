import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

function EmailVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail, resendVerificationEmail, isAuthenticated } = useAuth();
  const verificationAttempted = useRef(false);
  const currentToken = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [showResendForm, setShowResendForm] = useState(false);

  // Get email from URL params if available
  useEffect(() => {
    const emailFromParams = searchParams.get("email");
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, [searchParams]);
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/catalog");
    }
  }, [isAuthenticated, navigate]);
  // Reset verification state when URL changes to a different token
  useEffect(() => {
    const token = searchParams.get("token");
    if (token !== currentToken.current) {
      verificationAttempted.current = false;
      currentToken.current = null;
      setError("");
      setSuccess("");
      setShowResendForm(false);
    }
  }, [searchParams]);

  // Auto-verify if token is in URL
  useEffect(() => {
    const token = searchParams.get("token");

    // Prevent multiple verification attempts for the same token
    if (
      token &&
      !verificationAttempted.current &&
      currentToken.current !== token &&
      !loading &&
      !success &&
      !error
    ) {
      verificationAttempted.current = true;
      currentToken.current = token;
      setLoading(true);
      setError("");
      setSuccess("");

      const performVerification = async () => {
        try {
          const result = await verifyEmail(token);
          setSuccess(result.message + ". You can now login with your account.");
          // Redirect after showing success message
          setTimeout(() => navigate("/auth"), 3000);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
            setShowResendForm(true);
          } else {
            setError("Email verification failed");
            setShowResendForm(true);
          }
        } finally {
          setLoading(false);
        }
      };

      performVerification();
    }
  }, [searchParams, loading, success, error, verifyEmail, navigate]);
  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setResendLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await resendVerificationEmail(email);
      setSuccess("✓ " + result.message + " Please check your inbox.");
      setShowResendForm(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to resend verification email");
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black to-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Food Helper</h1>
          <p className="text-tertiary-600 text-sm">Email Verification</p>
        </div>

        {/* Verification Card */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-8">
          {/* Loading State */}{" "}
          {loading && (
            <div className="text-center">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"
                role="status"
              ></div>
              <p className="text-white">Processing...</p>
            </div>
          )}{" "}
          {/* Success Message */}
          {success && !loading && (
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
                Email Verified!
              </h2>
              <p className="text-gray-300 mb-4">{success}</p>{" "}
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-300">
                  Your email has been successfully verified
                </p>
              </div>
              <p className="text-sm text-gray-400">
                Redirecting to login in 3 seconds...
              </p>
            </div>
          )}{" "}
          {/* Error Message and Resend Form */}
          {error && !loading && !success && searchParams.get("token") && (
            <div className="text-center">
              <div className="rounded-full bg-red-100 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Verification Failed
              </h2>
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
                <p className="text-red-400 text-sm">{error}</p>
              </div>{" "}
              {showResendForm && (
                <div>
                  {" "}
                  <h3 className="text-lg font-medium text-white mb-4">
                    Resend Email
                  </h3>
                  <form
                    onSubmit={handleResendVerification}
                    className="space-y-4"
                  >
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-zinc-600 transition-all duration-200"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={resendLoading}
                      className="w-full bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                    >
                      {resendLoading
                        ? "Sending..."
                        : "Resend Verification Email"}
                    </button>
                  </form>
                </div>
              )}
              <div className="mt-6 pt-6 border-t border-zinc-700">
                <button
                  onClick={() => navigate("/auth")}
                  className="text-zinc-400 hover:text-white transition-colors duration-200"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          )}{" "}
          {/* Initial State - No token in URL */}
          {!loading && !success && !searchParams.get("token") && (
            <div className="text-center">
              <div className="rounded-full bg-blue-100 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>{" "}
              <h2 className="text-xl font-semibold text-white mb-2">
                Check Your Email
              </h2>
              <p className="text-gray-300 mb-6">
                {email ? (
                  <>
                    We've sent a verification link to <strong>{email}</strong>.
                    Please check your inbox and click the link to verify your
                    account.
                  </>
                ) : (
                  "We've sent you a verification link. Please check your email and click the link to verify your account."
                )}
              </p>{" "}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">
                  Didn't receive the email?
                </h3>{" "}
                <form onSubmit={handleResendVerification} className="space-y-4">
                  {error && (
                    <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-zinc-600 transition-all duration-200"
                      placeholder="Enter your email address"
                      readOnly={!!searchParams.get("email")}
                    />
                  </div>{" "}
                  <button
                    type="submit"
                    disabled={resendLoading}
                    className="w-full bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                  >
                    {resendLoading ? "Sending..." : "Resend Verification Email"}
                  </button>
                </form>
              </div>
              <div className="mt-6 pt-6 border-t border-zinc-700">
                <button
                  onClick={() => navigate("/auth")}
                  className="text-zinc-400 hover:text-white transition-colors duration-200"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
