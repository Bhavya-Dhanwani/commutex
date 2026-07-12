import { Suspense } from "react";
import Dashboard from "@/features/dashboard/pages/Dashboard";

export const metadata = {
  title: "Dashboard | commuteX",
  description: "TransitOps Management Platform",
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <Dashboard />
    </Suspense>
  );
}
