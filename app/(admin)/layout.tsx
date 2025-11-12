import DynamicDashboardNav from "@/components/dashboard/DynamicDashboardNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-primary">
      <DynamicDashboardNav />
      
      <main className="lg:ml-64 pt-16 lg:pt-20">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

