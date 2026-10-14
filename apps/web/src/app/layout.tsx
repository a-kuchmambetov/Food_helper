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
  title: { default: "Food Helper", template: "%s | Food Helper" },
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
            <AppShell>{children}</AppShell>
          </Theme>
        </RouteProvider>
      </body>
    </html>
  );
}
