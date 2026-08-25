import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Menu } from "lucide-react";
import { Logo } from "@/components/safework/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";

const navLinks = [
  { to: "/", label: "Recursos" },
  { to: "/solucoes", label: "Soluções" },
  { to: "/planos", label: "Planos" },
  { to: "/sobre", label: "Sobre nós" },
] as const;

export function MarketingHeader() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo
          to="/"
          imageClassName="h-9 w-9 rounded-xl object-contain sm:h-10 sm:w-10"
          textClassName="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl"
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

        <div className="hidden items-center gap-3 md:flex">
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

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <SheetHeader className="text-left">
              <SheetTitle>
                <Logo
                  imageClassName="h-9 w-9 rounded-xl object-contain"
                  textClassName="text-xl font-extrabold tracking-tight text-slate-900"
                />
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1">
              {navLinks.map((item) => {
                const active = path === item.to;
                return (
                  <SheetClose asChild key={item.to}>
                    <Link
                      to={item.to}
                      className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                        active ? "bg-primary/10 text-primary" : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
            <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6">
              <SheetClose asChild>
                <Button asChild variant="outline" className="font-semibold">
                  <Link to="/login">Entrar</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild className="rounded-xl bg-primary font-semibold text-primary-foreground">
                  <Link to="/gestor" className="flex items-center justify-center gap-2">
                    Área do Gestor <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
