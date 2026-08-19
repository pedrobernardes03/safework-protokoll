import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/safework/Logo";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/", label: "Recursos" },
  { to: "/solucoes", label: "Soluções" },
  { to: "/planos", label: "Planos" },
  { to: "/sobre", label: "Sobre nós" },
] as const;

export function MarketingHeader() {
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Logo
          to="/"
          imageClassName="h-10 w-10 rounded-xl object-contain"
          textClassName="text-2xl font-extrabold tracking-tight text-slate-900"
        />

        <nav className="hidden items-center gap-8 md:flex text-sm font-semibold text-slate-700">
          {navLinks.map((item) => {
            const active = path === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex flex-col items-center gap-1 transition-colors ${active ? "text-slate-900" : "hover:text-slate-900"}`}
              >
                <span>{item.label}</span>
                <span
                  className={`h-1.5 w-1.5 rounded-full bg-primary transition-opacity ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="font-semibold text-slate-700 hover:text-slate-900">
            <Link to="/login">Entrar</Link>
          </Button>
          <Button
            asChild
            className="rounded-xl bg-primary text-primary-foreground font-semibold px-5 py-2.5 shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
          >
            <Link to="/gestor" className="flex items-center gap-2">
              Área do Gestor <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
