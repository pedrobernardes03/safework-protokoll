import { createFileRoute, Outlet, useRouterState, useNavigate, Link } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/safework/AppSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotificationProvider } from "@/hooks/useNotifications";
import { NotificationPopover } from "@/components/safework/NotificationPopover";
import { gestorAtual } from "@/lib/safework-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/gestor")({
  component: GestorLayout,
});

const titleMap: Record<string, string> = {
  "/gestor": "Visão Geral",
  "/gestor/perfil": "Meu Perfil",
  "/gestor/colaboradores": "EPIs por Colaborador",
  "/gestor/rh": "Colaboradores",
  "/gestor/epis": "Cadastro de EPIs",
  "/gestor/almoxarifado": "Almoxarifado",
  "/gestor/compras": "Compras",
  "/gestor/certificados": "Monitoramento de Certificados",
  "/gestor/observacoes": "Observações dos EPIs",
  "/gestor/mensagens": "Mensagens",
  "/gestor/auditoria": "Auditoria",
  "/gestor/usuarios": "Usuários e Permissões",
};

function GestorLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const title =
    titleMap[path] ??
    (path.startsWith("/gestor/observacoes/") ? "Detalhes da observação" : "SafeWork");
  const gestor = gestorAtual();
  const iniciais = gestor.nome.split(" ").slice(0, 2).map((n) => n[0]).join("");

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    toast.success("Sessão encerrada com sucesso.");
    navigate({ to: "/login" });
  };

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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-xl p-1.5 text-left transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                    aria-label="Abrir menu do perfil de usuário"
                  >
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-medium leading-tight">{gestor.nome}</p>
                      <p className="text-xs text-muted-foreground">{gestor.cargo}</p>
                    </div>
                    <Avatar className="h-9 w-9 ring-1 ring-border transition-transform hover:scale-105">
                      <AvatarFallback className="bg-primary/10 font-semibold text-primary">{iniciais}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-lg">
                  <DropdownMenuLabel className="font-normal px-2 py-1.5">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-semibold leading-tight text-foreground">{gestor.nome}</p>
                      <p className="text-xs text-muted-foreground">{gestor.cargo}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/gestor/perfil" className="flex items-center gap-2 px-2 py-1.5 cursor-pointer">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Meu perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate({ to: "/gestor/perfil" })}
                    className="flex items-center gap-2 px-2 py-1.5 cursor-pointer"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-2 py-1.5 cursor-pointer text-danger focus:bg-danger/10 focus:text-danger"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

