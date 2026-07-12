"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import VerifyEmail from "@/features/auth/ui/pages/VerifyEmail";
import ResendVerification from "@/features/auth/ui/pages/ResendVerification";

function VerifyEmailSwitcher() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (token) {
    return <VerifyEmail />;
  }

  return <ResendVerification />;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailSwitcher />
    </Suspense>
  );
}

