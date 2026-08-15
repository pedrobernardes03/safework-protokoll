import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/safework/AppSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotificationProvider } from "@/hooks/useNotifications";
import { NotificationPopover } from "@/components/safework/NotificationPopover";

export const Route = createFileRoute("/gestor")({
  component: GestorLayout,
});

const titleMap: Record<string, string> = {
  "/gestor": "Visão Geral",
  "/gestor/colaboradores": "Cadastro de Colaboradores",
  "/gestor/epis": "Cadastro de EPIs",
  "/gestor/certificados": "Monitoramento de Certificados",
  "/gestor/observacoes": "Observações dos EPIs",
};

function GestorLayout() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const title =
    titleMap[path] ??
    (path.startsWith("/gestor/observacoes/") ? "Detalhes da observação" : "SafeWork");

  return (
    <NotificationProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-accent/20">
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
              <SidebarTrigger />
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-base font-semibold sm:text-lg">{title}</h1>
              </div>
              <NotificationPopover />
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium leading-tight">Ana Beatriz Silva</p>
                <p className="text-xs text-muted-foreground">Engenheira de Segurança</p>
              </div>
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 font-semibold text-primary">AB</AvatarFallback>
              </Avatar>
            </header>
            <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </NotificationProvider>
  );
}

