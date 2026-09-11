import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/safework/Logo";
import { LogOut, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { colaboradores, MATRICULA_COLABORADOR_ATUAL } from "@/lib/safework-data";

export function CollaboratorShell({ children, back }: { children: ReactNode; back?: { to: string; label: string } }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  // Antes o nome/matrícula ficavam escritos direto aqui — se o RH editasse o cadastro de
  // Carlos, o cabeçalho continuaria mostrando o nome antigo pra sempre. Lendo do cadastro
  // de verdade, qualquer edição aparece na hora, igual já acontece no cabeçalho do gestor.
  const colaborador = colaboradores.find((c) => c.matricula === MATRICULA_COLABORADOR_ATUAL);
  const iniciais = colaborador ? colaborador.nome.split(" ").slice(0, 2).map((n) => n[0]).join("") : "";
  return (
    <div className="min-h-screen bg-accent/20">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Logo to="/colaborador/meus-epis" imageClassName="h-12 w-12 object-contain sm:h-14 sm:w-14" textClassName="text-2xl font-extrabold tracking-tight" />
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">{colaborador?.nome}</p>
              <p className="text-xs text-muted-foreground">Matrícula {colaborador?.matricula}</p>
            </div>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">{iniciais}</AvatarFallback>
            </Avatar>
            <Button asChild size="icon" variant="ghost" title="Sair">
              <Link to="/login"><LogOut className="h-4 w-4" /></Link>
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
