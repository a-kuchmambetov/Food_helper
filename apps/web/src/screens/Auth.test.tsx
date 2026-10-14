import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import Auth from "./Auth";

const auth = vi.hoisted(() => ({
  login: vi.fn(),
  register: vi.fn(),
  isAuthenticated: false,
}));
const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("../contexts/useAuth", () => ({ useAuth: () => auth }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

beforeEach(() => {
  vi.clearAllMocks();
  auth.login.mockResolvedValue(undefined);
  auth.register.mockResolvedValue({
    message: "Check your inbox to verify your email.",
  });
});

it("submits credentials and the remember-me choice through the accessible form", async () => {
  const user = userEvent.setup();
  render(<Auth />);
  await user.type(screen.getByLabelText(/^Email/), "test@example.com");
  await user.type(screen.getByLabelText(/^Password/), "Password123!");
  await user.click(
    screen.getByRole("checkbox", { name: "Keep me signed in for 30 days" }),
  );
  await user.click(
    within(screen.getByRole("form", { name: "Sign in" })).getByRole("button", {
      name: "Sign In",
    }),
  );
  await waitFor(() =>
    expect(auth.login).toHaveBeenCalledWith(
      "test@example.com",
      "Password123!",
      true,
    ),
  );
});

it("blocks weak passwords and completes registration with an email verification link", async () => {
  const user = userEvent.setup();
  render(<Auth />);
  await user.click(screen.getByRole("button", { name: "Sign Up" }));
  await user.type(screen.getByLabelText(/^Name/), "Test User");
  await user.type(screen.getByLabelText(/^Email/), "test@example.com");
  const password = screen.getByLabelText(/^Password/);
  await user.type(password, "weak");
  expect(password).toHaveAttribute("aria-invalid", "true");
  const submit = within(
    screen.getByRole("form", { name: "Sign up" }),
  ).getByRole("button", { name: "Sign Up" });
  await user.click(submit);
  expect(auth.register).not.toHaveBeenCalled();
  await user.clear(password);
  await user.type(password, "Password123!");
  await user.click(submit);
  expect(
    await screen.findByRole("heading", {
      name: "Account Created Successfully!",
    }),
  ).toBeInTheDocument();
  expect(auth.register).toHaveBeenCalledWith({
    name: "Test User",
    email: "test@example.com",
    password: "Password123!",
  });
  await user.click(
    screen.getByRole("button", { name: "Go to Email Verification" }),
  );
  expect(router.push).toHaveBeenCalledWith(
    "/verify-email?email=test%40example.com",
  );
});

it("announces a rejected sign-in and allows retrying", async () => {
  const user = userEvent.setup();
  auth.login.mockRejectedValueOnce(new Error("Invalid email or password"));
  render(<Auth />);
  await user.type(screen.getByLabelText(/^Email/), "test@example.com");
  await user.type(screen.getByLabelText(/^Password/), "Password123!");
  const submit = within(
    screen.getByRole("form", { name: "Sign in" }),
  ).getByRole("button", { name: "Sign In" });
  await user.click(submit);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Invalid email or password",
  );
  expect(submit).toBeEnabled();
});
