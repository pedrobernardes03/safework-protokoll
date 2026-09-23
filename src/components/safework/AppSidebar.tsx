import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/safework/Logo";
import {
  LayoutDashboard,
  Users,
  HardHat,
  ListChecks,
  BadgeCheck,
  MessageSquareWarning,
  MessageCircle,
  ShieldCheck,
  History,
  Boxes,
  ShoppingCart,
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

type NavItem = { title: string; to: string; icon: typeof LayoutDashboard; exact?: boolean };

// Navegação da SST — dashboard, EPIs e o resto do que é trabalho da Segurança do Trabalho.
// Almoxarifado saiu daqui de propósito: agora é perfil próprio, com login próprio.
const navSST: NavItem[] = [
  { title: "Visão Geral", to: "/gestor", icon: LayoutDashboard, exact: true },
  { title: "EPIs por Colaborador", to: "/gestor/colaboradores", icon: ListChecks },
  { title: "Equipamento de Proteção Individual", to: "/gestor/epis", icon: HardHat },
  { title: "Certificado de Aprovação (CA)", to: "/gestor/certificados", icon: BadgeCheck },
  { title: "Observações", to: "/gestor/observacoes", icon: MessageSquareWarning },
  { title: "Mensagens", to: "/gestor/mensagens", icon: MessageCircle },
  { title: "Auditoria", to: "/gestor/auditoria", icon: History },
];

const navTI: NavItem = { title: "Usuários e Permissões", to: "/gestor/usuarios", icon: ShieldCheck };
const navCompras: NavItem = { title: "Compras", to: "/gestor/compras", icon: ShoppingCart };
const navRH: NavItem = { title: "Colaboradores", to: "/gestor/rh", icon: Users };
const navAlmoxarifado: NavItem = { title: "Almoxarifado", to: "/gestor/almoxarifado", icon: Boxes };

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(to + "/");
  const perfil = gestorAtual().perfil;
  // Cada perfil vê só a(s) tela(s) do próprio trabalho — nada do resto do painel.
  // Administrador é o único que enxerga tudo (acesso de exceção).
  const items: NavItem[] =
    perfil === "Compras"
      ? [navCompras]
      : perfil === "RH"
        ? [navRH]
        : perfil === "TI"
          ? [navTI]
          : perfil === "Almoxarifado"
            ? [navAlmoxarifado]
            : perfil === "Administrador"
              ? [...navSST, navAlmoxarifado, navRH, navCompras, navTI]
              : navSST;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          to="/gestor"
          className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 hover:bg-sidebar-accent/50"
        >
          <Logo
            showText={false}
            className="flex items-center justify-center shrink-0"
            imageClassName="h-8 w-8 shrink-0 object-contain transition-all duration-200 group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7"
          />
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
