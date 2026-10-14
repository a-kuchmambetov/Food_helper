"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../contexts/useAuth";

function EmailVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      router.push("/catalog");
    }
  }, [isAuthenticated, router]);
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
          setTimeout(() => router.push("/auth"), 3000);
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
  }, [searchParams, loading, success, error, verifyEmail, router]);
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
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">Food Helper</h1>
          <p className="text-sm text-tertiary">Email Verification</p>
        </div>

        {/* Verification Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
          {/* Loading State */}{" "}
          {loading && (
            <div className="text-center">
              <div
                className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white"
                role="status"
              ></div>
              <p className="text-white">Processing...</p>
            </div>
          )}{" "}
          {/* Success Message */}
          {success && !loading && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 p-3">
                <svg
                  className="h-8 w-8 text-green-600"
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
              <h2 className="mb-2 text-xl font-semibold text-white">
                Email Verified!
              </h2>
              <p className="mb-4 text-gray-300">{success}</p>{" "}
              <div className="mb-4 rounded-lg border border-green-700 bg-green-900/20 p-4">
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 p-3">
                <svg
                  className="h-8 w-8 text-red-600"
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
              <h2 className="mb-2 text-xl font-semibold text-white">
                Verification Failed
              </h2>
              <div className="mb-6 rounded-lg border border-red-700 bg-red-900/20 p-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>{" "}
              {showResendForm && (
                <div>
                  {" "}
                  <h3 className="mb-4 text-lg font-medium text-white">
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
                        className="block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-400 transition-all duration-200 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700 focus:outline-none"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={resendLoading}
                      className="w-full rounded-lg bg-zinc-700 px-4 py-3 font-semibold text-white transition-all duration-200 hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {resendLoading
                        ? "Sending..."
                        : "Resend Verification Email"}
                    </button>
                  </form>
                </div>
              )}
              <div className="mt-6 border-t border-zinc-700 pt-6">
                <button
                  onClick={() => router.push("/auth")}
                  className="text-zinc-400 transition-colors duration-200 hover:text-white"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          )}{" "}
          {/* Initial State - No token in URL */}
          {!loading && !success && !searchParams.get("token") && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 p-3">
                <svg
                  className="h-8 w-8 text-blue-600"
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
              <h2 className="mb-2 text-xl font-semibold text-white">
                Check Your Email
              </h2>
              <p className="mb-6 text-gray-300">
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
                <h3 className="mb-4 text-lg font-medium text-white">
                  Didn't receive the email?
                </h3>{" "}
                <form onSubmit={handleResendVerification} className="space-y-4">
                  {error && (
                    <div className="rounded-lg border border-red-700 bg-red-900/20 p-4">
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-400 transition-all duration-200 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700 focus:outline-none"
                      placeholder="Enter your email address"
                      readOnly={!!searchParams.get("email")}
                    />
                  </div>{" "}
                  <button
                    type="submit"
                    disabled={resendLoading}
                    className="w-full rounded-lg bg-zinc-700 px-4 py-3 font-semibold text-white transition-all duration-200 hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {resendLoading ? "Sending..." : "Resend Verification Email"}
                  </button>
                </form>
              </div>
              <div className="mt-6 border-t border-zinc-700 pt-6">
                <button
                  onClick={() => router.push("/auth")}
                  className="text-zinc-400 transition-colors duration-200 hover:text-white"
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
