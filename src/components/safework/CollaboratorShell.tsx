import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/safework/Logo";
import { LogOut, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function CollaboratorShell({ children, back }: { children: ReactNode; back?: { to: string; label: string } }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <div className="min-h-screen bg-accent/20">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Logo to="/colaborador/meus-epis" imageClassName="h-14 w-14 rounded-xl object-contain" textClassName="text-2xl font-extrabold tracking-tight" />
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">Carlos Menezes</p>
              <p className="text-xs text-muted-foreground">Matrícula 10298</p>
            </div>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">CM</AvatarFallback>
            </Avatar>
            <Button asChild size="icon" variant="ghost" title="Sair">
              <Link to="/login"><LogOut className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
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
