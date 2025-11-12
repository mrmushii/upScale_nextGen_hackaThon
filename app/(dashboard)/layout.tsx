import DashboardNav from "@/components/dashboard/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-primary">
      <DashboardNav />
      
      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-20">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

