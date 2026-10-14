"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
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
      "Password must contain at least one special character (@$!%*?&)",
    );
  }

  return errors;
};

function Auth() {
  const router = useRouter();
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

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/catalog");
    }
  }, [isAuthenticated, router]);

  const handleChange = (name: keyof typeof form, value: string) => {
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
          router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
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
    router.push(`/verify-email?email=${encodeURIComponent(registeredEmail)}`);
  };
  const handleBackToAuth = () => {
    setShowVerificationPrompt(false);
    setSuccess("");
    setRegisteredEmail("");
    setIsLogin(true); // Set back to sign-in mode
    setPasswordErrors([]);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-black to-slate-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-display-sm font-bold text-primary">
            Food Helper
          </h1>
          <p className="text-sm text-tertiary">
            {showVerificationPrompt
              ? "Account created successfully!"
              : isLogin
                ? "Welcome back! Sign in to your account"
                : "Create your account to get started"}
          </p>
        </div>
        <div className="rounded-2xl border border-secondary bg-primary p-8 shadow-xl">
          {showVerificationPrompt ? (
            <div className="space-y-5 text-center">
              <h2 className="text-xl font-semibold text-primary">
                Account Created Successfully!
              </h2>
              <p className="text-secondary" role="status">
                {success}
              </p>
              <p className="text-sm text-tertiary">
                We've sent a verification email to{" "}
                <strong>{registeredEmail}</strong>. Please check your inbox and
                click the verification link to activate your account.
              </p>
              <Button className="w-full" onClick={handleGoToVerification}>
                Go to Email Verification
              </Button>
              <Button
                className="w-full"
                color="tertiary"
                onClick={handleBackToAuth}
              >
                Back to Sign In
              </Button>
            </div>
          ) : (
            <>
              <div
                className="mb-6 flex gap-2"
                role="group"
                aria-label="Account access"
              >
                <Button
                  className="flex-1"
                  color={isLogin ? "secondary" : "tertiary"}
                  aria-pressed={isLogin}
                  onClick={() => {
                    setIsLogin(true);
                    setError("");
                    setSuccess("");
                    setPasswordErrors([]);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  className="flex-1"
                  color={!isLogin ? "secondary" : "tertiary"}
                  aria-pressed={!isLogin}
                  onClick={() => {
                    setIsLogin(false);
                    setError("");
                    setSuccess("");
                    setPasswordErrors(validatePassword(form.password));
                  }}
                >
                  Sign Up
                </Button>
              </div>
              <form
                className="space-y-5"
                onSubmit={handleSubmit}
                aria-label={isLogin ? "Sign in" : "Sign up"}
              >
                {!isLogin && (
                  <Input
                    label="Name"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={(value) => handleChange("name", value)}
                    placeholder="Enter your name"
                    isRequired
                  />
                )}
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(value) => handleChange("email", value)}
                  placeholder="Enter your email"
                  isRequired
                />
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={form.password}
                  onChange={(value) => handleChange("password", value)}
                  placeholder="Enter your password"
                  isRequired
                  isInvalid={
                    !isLogin &&
                    form.password.length > 0 &&
                    passwordErrors.length > 0
                  }
                  hint={
                    !isLogin && (
                      <span>
                        Use at least 8 characters with lowercase and uppercase
                        letters, a number, and a special character (@$!%*?&).
                      </span>
                    )
                  }
                />
                {isLogin && (
                  <Checkbox
                    name="remember-me"
                    isSelected={rememberMe}
                    onChange={setRememberMe}
                    label="Keep me signed in for 30 days"
                  />
                )}
                {error && (
                  <p
                    role="alert"
                    className="rounded-lg bg-error-primary p-3 text-sm text-error-primary"
                  >
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={loading}
                  isDisabled={loading}
                >
                  {loading
                    ? isLogin
                      ? "Signing In..."
                      : "Creating Account..."
                    : isLogin
                      ? "Sign In"
                      : "Sign Up"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
