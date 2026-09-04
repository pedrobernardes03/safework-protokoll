import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/safework/Logo";
import {
  LayoutDashboard,
  Users,
  HardHat,
  BadgeCheck,
  MessageSquareWarning,
  MessageCircle,
  ShieldCheck,
  History,
  Boxes,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { gestorAtual } from "@/lib/safework-data";

const nav: Array<{ title: string; to: string; icon: typeof LayoutDashboard; exact?: boolean }> = [
  { title: "Visão Geral", to: "/gestor", icon: LayoutDashboard, exact: true },
  { title: "Colaboradores", to: "/gestor/colaboradores", icon: Users },
  { title: "Equipamento de Proteção Individual", to: "/gestor/epis", icon: HardHat },
  { title: "Almoxarifado", to: "/gestor/almoxarifado", icon: Boxes },
  { title: "Certificado de Aprovação (CA)", to: "/gestor/certificados", icon: BadgeCheck },
  { title: "Observações", to: "/gestor/observacoes", icon: MessageSquareWarning },
  { title: "Mensagens", to: "/gestor/mensagens", icon: MessageCircle },
  { title: "Auditoria", to: "/gestor/auditoria", icon: History },
];

const navAdministrador: { title: string; to: string; icon: typeof LayoutDashboard; exact?: boolean } = {
  title: "Usuários e Permissões",
  to: "/gestor/usuarios",
  icon: ShieldCheck,
};

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(to + "/");
  // Item só visível para quem tem perfil Administrador — o resto da equipe de gestão
  // não precisa (nem deve) ver a tela de controle de acesso.
  const items = gestorAtual().perfil === "Administrador" ? [...nav, navAdministrador] : nav;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/gestor" className="flex items-center gap-3 px-2 py-3">
          <Logo showText={false} imageClassName="h-14 w-14 shrink-0 object-contain" />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-bold leading-tight">SafeWork</p>
            <p className="truncate text-xs text-muted-foreground">Gestão de Segurança</p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={isActive(item.to, item.exact)} tooltip={item.title}>
                    <Link to={item.to}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Sair">
              <Link to="/login">
                <LogOut className="h-4 w-4" /> <span>Sair</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
