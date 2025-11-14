"use client";

import { useSession } from "next-auth/react";
import DynamicDashboardNav from "@/components/dashboard/DynamicDashboardNav";
import FloatingCareerBot from "@/components/career/FloatingCareerBot";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "user";

  return (
    <div className="min-h-screen bg-gradient-primary">
      <DynamicDashboardNav />
      
      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-20">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>

      {/* Floating CareerBot - Only for users */}
      {userRole === "user" && <FloatingCareerBot />}
    </div>
  );
}

