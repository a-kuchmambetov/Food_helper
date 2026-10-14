import { Suspense } from "react";
import type { Metadata } from "next";
import EmailVerification from "@/screens/EmailVerification";

export const metadata: Metadata = { title: "Verify email" };

export default function VerifyEmailPage() {
  // EmailVerification reads search params, which opt the subtree out of static prerendering.
  return (
    <Suspense>
      <EmailVerification />
    </Suspense>
  );
}
