import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Admin Central Hub</h2>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}