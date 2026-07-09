import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, HardHat, ClipboardList, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/30">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">SafeWork</span>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link to="/gestor">Área do Gestor</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-success" />
              Segurança do trabalho conectada
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Gestão inteligente de EPIs para equipes que valorizam segurança.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground">
              Centralize o controle de Equipamentos de Proteção Individual, monitore Certificados
              de Aprovação e mantenha uma comunicação direta entre colaboradores e gestores.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/login">
                  Acessar plataforma <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/colaborador/meus-epis">Área do colaborador</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: HardHat, title: "Meus EPIs", desc: "Colaborador confirma uso diário." },
              { icon: ClipboardList, title: "Observações", desc: "Reporte problemas em segundos." },
              { icon: BarChart3, title: "CAs monitorados", desc: "Alertas de vencimento." },
              { icon: ShieldCheck, title: "Conformidade", desc: "Histórico completo por pessoa." },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]"
              >
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold">{c.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
