import { Suspense } from "react";
import ResetPassword from "@/features/auth/ui/pages/ResetPassword";

export const metadata = {
  title: "Reset Password | commuteX",
  description: "Reset your commuteX password",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}
