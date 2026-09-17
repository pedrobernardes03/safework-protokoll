import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/safework/Logo";
import { LogOut, ArrowLeft, User, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { colaboradores, MATRICULA_COLABORADOR_ATUAL } from "@/lib/safework-data";
import { toast } from "sonner";

export function CollaboratorShell({ children, back }: { children: ReactNode; back?: { to: string; label: string } }) {
  const navigate = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });
  // Antes o nome/matrícula ficavam escritos direto aqui — se o RH editasse o cadastro de
  // Carlos, o cabeçalho continuaria mostrando o nome antigo pra sempre. Lendo do cadastro
  // de verdade, qualquer edição aparece na hora, igual já acontece no cabeçalho do gestor.
  const colaborador = colaboradores.find((c) => c.matricula === MATRICULA_COLABORADOR_ATUAL);
  const iniciais = colaborador ? colaborador.nome.split(" ").slice(0, 2).map((n) => n[0]).join("") : "";

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    toast.success("Sessão encerrada com sucesso.");
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-accent/20">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Logo to="/colaborador/meus-epis" imageClassName="h-12 w-12 object-contain sm:h-14 sm:w-14" textClassName="text-2xl font-extrabold tracking-tight" />
          
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-xl p-1.5 text-left transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                  aria-label="Abrir menu do perfil do colaborador"
                >
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium leading-tight">{colaborador?.nome}</p>
                    <p className="text-xs text-muted-foreground">Matrícula {colaborador?.matricula}</p>
                  </div>
                  <Avatar className="h-9 w-9 ring-1 ring-border transition-transform hover:scale-105">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">{iniciais}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-lg">
                <DropdownMenuLabel className="font-normal px-2 py-1.5">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-semibold leading-tight text-foreground">{colaborador?.nome}</p>
                    <p className="text-xs text-muted-foreground">Matrícula {colaborador?.matricula}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/colaborador/perfil" className="flex items-center gap-2 px-2 py-1.5 cursor-pointer">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Meu perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate({ to: "/colaborador/perfil" })}
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

            <Button
              size="icon"
              variant="ghost"
              title="Sair"
              onClick={handleLogout}
              className="cursor-pointer text-muted-foreground hover:text-danger"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {back && path !== "/colaborador/meus-epis" && (
          <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
            <Link to={back.to}><ArrowLeft className="mr-1 h-4 w-4" /> {back.label}</Link>
          </Button>
        )}
        {children}
      </main>
    </div>
  );
}

