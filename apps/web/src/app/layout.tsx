import { Suspense } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { RouteProvider } from "@/providers/router-provider";
import { Theme } from "@/providers/theme";
import AppShell from "../component/AppShell";
import "@/styles/globals.css";

const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Food Helper",
  description: "Plan your meals and manage your ingredients.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-primary text-primary">
        <RouteProvider>
          <Theme>
            <Suspense fallback={<p>Loading…</p>}>
              <AppShell>{children}</AppShell>
            </Suspense>
          </Theme>
        </RouteProvider>
      </body>
    </html>
  );
}
