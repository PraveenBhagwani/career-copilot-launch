import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardProvider } from "@/lib/dashboard-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Career Copilot AI" },
      { name: "description", content: "Your Career Copilot workspace: jobs, AI coach, credits and referrals." },
    ],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <DashboardProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </DashboardProvider>
  );
}
