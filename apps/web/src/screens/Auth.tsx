"use client";

import { useEffect, useState } from "react";
import { HeartHand } from "@untitledui/icons";
import axios from "axios";
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
      // Unverified sign-in: Better Auth has already sent a new verification email
      if (
        axios.isAxiosError(err) &&
        err.response?.data?.code === "EMAIL_NOT_VERIFIED"
      ) {
        router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
        return;
      }
      if (err instanceof Error) {
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

  const switchMode = (login: boolean) => {
    setIsLogin(login);
    setError("");
    setSuccess("");
    setPasswordErrors(login ? [] : validatePassword(form.password));
  };

  return (
    <section className="min-h-screen bg-primary px-4 py-12 sm:bg-secondary md:px-8 md:pt-24">
      <div className="flex w-full flex-col gap-6 bg-primary sm:mx-auto sm:max-w-110 sm:rounded-2xl sm:px-10 sm:py-8 sm:shadow-sm">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex size-10 items-center justify-center rounded-lg bg-brand-solid text-white shadow-xs">
            <HeartHand className="size-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-2 md:gap-3">
            <h1 className="text-xl font-semibold text-primary md:text-display-xs">
              {showVerificationPrompt
                ? "Account Created Successfully!"
                : isLogin
                  ? "Welcome back"
                  : "Create an account"}
            </h1>
            <p className="text-md text-tertiary">
              {showVerificationPrompt
                ? "Check your inbox to finish signing up."
                : isLogin
                  ? "Please enter your details."
                  : "Start planning your meals with Food Helper."}
            </p>
          </div>
        </div>

        {showVerificationPrompt ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 text-center">
              <p className="text-md text-secondary" role="status">
                {success}
              </p>
              <p className="text-sm text-tertiary">
                We've sent a verification email to{" "}
                <strong className="font-semibold text-secondary">
                  {registeredEmail}
                </strong>
                . Please check your inbox and click the verification link to
                activate your account.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Button size="lg" onClick={handleGoToVerification}>
                Go to Email Verification
              </Button>
              <Button size="lg" color="secondary" onClick={handleBackToAuth}>
                Back to Sign In
              </Button>
            </div>
          </div>
        ) : (
          <>
            <form
              className="flex flex-col gap-6"
              onSubmit={handleSubmit}
              aria-label={isLogin ? "Sign in" : "Sign up"}
            >
              <div className="flex flex-col gap-5">
                {!isLogin && (
                  <Input
                    label="Name"
                    name="name"
                    size="lg"
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
                  size="lg"
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
                  size="lg"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={form.password}
                  onChange={(value) => handleChange("password", value)}
                  placeholder="••••••••••••"
                  inputClassName="placeholder:text-placeholder/50"
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
              </div>

              {isLogin && (
                <div className="flex items-center">
                  <Checkbox
                    name="remember-me"
                    isSelected={rememberMe}
                    onChange={setRememberMe}
                    label="Remember for 30 days"
                  />
                </div>
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

            <div className="flex justify-center gap-1 text-center">
              <span className="text-sm text-tertiary">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </span>
              <Button
                color="link-color"
                size="md"
                onClick={() => switchMode(!isLogin)}
              >
                {isLogin ? "Sign up" : "Log in"}
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Auth;
