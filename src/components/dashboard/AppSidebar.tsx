import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Briefcase, Gift, LayoutDashboard, LogOut, MessageSquareText, Rocket, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useDashboard } from "@/lib/dashboard-store";

const items: Array<{ title: string; url: string; icon: React.ComponentType<{ className?: string }>; exact?: boolean }> = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard, exact: true },
  { title: "Jobs", url: "/dashboard/jobs", icon: Briefcase },
  { title: "Hivemind AI", url: "/dashboard/coach", icon: MessageSquareText },
  { title: "Refer & Earn", url: "/dashboard/refer", icon: Gift },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { openUpgrade } = useDashboard();
  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  const handleSignOut = () => {
    try {
      localStorage.removeItem("cc_credits");
      localStorage.removeItem("cc_plan");
    } catch {}
    toast.success("Signed out", { description: "Your session has been cleared." });
    navigate({ to: "/", replace: true });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-display text-base font-semibold">Career Copilot</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url, item.exact)}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={openUpgrade}
                  tooltip="Upgrade Plan"
                  className="bg-gradient-to-r from-primary to-[oklch(0.55_0.2_265)] font-semibold text-primary-foreground shadow-md hover:opacity-90 hover:text-primary-foreground data-[active=true]:text-primary-foreground"
                >
                  <Rocket className="h-4 w-4" />
                  <span>🚀 Upgrade Plan</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground"
              tooltip="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
