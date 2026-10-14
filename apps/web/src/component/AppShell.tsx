"use client";

import { useEffect } from "react";
import { Settings02 } from "@untitledui/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cx } from "@/utils/cx";
import { AuthProvider } from "../contexts/AuthContext";
import { useAuth } from "../contexts/useAuth";
import Footer from "./Footer";

const navItems = [
  { label: "Catalog", href: "/catalog" },
  { label: "Planner", href: "/planner" },
  { label: "Inventory", href: "/inventory" },
  { label: "Help", href: "/help" },
];
const publicPaths = ["/auth", "/verify-email"];

const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

function Navigation() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="h-18 bg-black px-4 text-white shadow-md">
      <div className="container mx-auto flex h-full items-center justify-between">
        {/* Left side with page buttons */}
        <div className="flex h-full flex-row items-center justify-center">
          <div className="mr-4 font-body text-xl font-bold text-white">
            Food Helper
          </div>
          <div className="flex h-11 flex-row items-center space-x-1">
            {navItems.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "rounded-sm px-3 py-2 font-semibold transition-colors duration-300 hover:bg-active",
                    active ? "bg-active text-gray-200" : "text-gray-300",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right side with user info and settings */}
        <div className="flex h-full items-center space-x-4">
          <div className="w-10 stroke-black p-2">
            <Settings02
              className="size-5 text-fg-quaternary"
              aria-hidden="true"
            />
          </div>
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                aria-current={pathname === "/profile" ? "page" : undefined}
                className={cx(
                  "flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white transition-colors duration-300",
                  pathname === "/profile"
                    ? "bg-sky-500"
                    : "bg-gray-600 hover:bg-gray-500",
                )}
                title="Profile"
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-gray-300 transition-colors duration-300 hover:text-white"
                title="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="rounded-lg bg-sky-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-sky-600"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const publicPage = publicPaths.includes(pathname);
  useEffect(() => {
    if (!loading && !isAuthenticated && !publicPage) router.replace("/auth");
  }, [loading, isAuthenticated, publicPage, router]);
  if (loading || (!isAuthenticated && !publicPage))
    return <p className="p-8 text-white">Loading…</p>;
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-black to-slate-900 text-white">
      {isAuthenticated && <Navigation />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Content>{children}</Content>
    </AuthProvider>
  );
}
