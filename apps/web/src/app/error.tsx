"use client";

import { useEffect } from "react";
import { Button } from "@/components/base/buttons/button";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-display-xs font-semibold text-primary">
        Something went wrong
      </h1>
      <p className="text-md text-tertiary">
        An unexpected error occurred. Please try again.
      </p>
      <Button size="lg" onClick={() => retry()}>
        Try again
      </Button>
    </section>
  );
}
