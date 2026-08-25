import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const columns = [
  {
    title: "Produto",
    links: [
      { label: "Soluções", to: "/solucoes" as const },
      { label: "Planos", to: "/planos" as const },
      { label: "Entrar", to: "/login" as const },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre nós", to: "/sobre" as const },
      { label: "Área do gestor", to: "/gestor" as const },
      { label: "Área do colaborador", to: "/colaborador/meus-epis" as const },
    ],
  },
] as const;

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">SafeWork</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-slate-500">
              Plataforma de gestão de segurança do trabalho para equipes que levam EPIs, CAs e
              conformidade a sério.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-slate-900">{col.title}</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-500">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-sm font-semibold text-slate-900">Legal</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              <li>
                <button
                  type="button"
                  className="text-left transition-colors hover:text-primary"
                  onClick={() => toast.info("Política de Privacidade disponível em breve.")}
                >
                  Política de Privacidade
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-left transition-colors hover:text-primary"
                  onClick={() => toast.info("Termos de Uso disponíveis em breve.")}
                >
                  Termos de Uso
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
          <p className="text-xs text-slate-400">© 2026 SafeWork Corp. Todos os direitos reservados.</p>
          <p className="text-xs text-slate-400">SafeWork v2.4.0</p>
        </div>
      </div>
    </footer>
  );
}
