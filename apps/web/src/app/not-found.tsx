import type { Metadata } from "next";
import { Button } from "@/components/base/buttons/button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="flex flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-display-xs font-semibold text-primary">
        Page not found
      </h1>
      <p className="text-md text-tertiary">
        The page you are looking for does not exist.
      </p>
      <Button size="lg" href="/catalog">
        Back to catalog
      </Button>
    </section>
  );
}
