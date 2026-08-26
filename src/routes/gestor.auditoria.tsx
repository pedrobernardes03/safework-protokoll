import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Users, HardHat, BadgeCheck, MessageSquareWarning, History, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { logsAuditoria, type CategoriaAuditoria } from "@/lib/safework-data";

const POR_PAGINA = 15;

export const Route = createFileRoute("/gestor/auditoria")({
  head: () => ({ meta: [{ title: "Auditoria — SafeWork" }] }),
  component: AuditoriaPage,
});

const categorias: { id: CategoriaAuditoria; label: string; icon: typeof Users; className: string }[] = [
  { id: "usuario", label: "Colaboradores e acesso", icon: Users, className: "bg-primary/10 text-primary" },
  { id: "epi", label: "EPIs", icon: HardHat, className: "bg-success/10 text-success" },
  { id: "certificado", label: "Certificados", icon: BadgeCheck, className: "bg-warning/20 text-warning-foreground" },
  { id: "observacao", label: "Observações", icon: MessageSquareWarning, className: "bg-danger/10 text-danger" },
];

function formatData(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function AuditoriaPage() {
  const [q, setQ] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaAuditoria | null>(null);
  const [pagina, setPagina] = useState(1);

  const filtrados = logsAuditoria.filter((l) => {
    const s = q.toLowerCase();
    const matchesQuery = l.autor.toLowerCase().includes(s) || l.alvo.toLowerCase().includes(s) || l.acao.toLowerCase().includes(s);
    return matchesQuery && (!categoriaAtiva || l.categoria === categoriaAtiva);
  });

  // Só renderiza uma página de cada vez — sem isso, um log que cresce por meses viraria
  // centenas de linhas na DOM de uma vez e o scroll começaria a travar.
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const visiveis = filtrados.slice((paginaSegura - 1) * POR_PAGINA, paginaSegura * POR_PAGINA);

  const filtrarPor = (fn: () => void) => {
    fn();
    setPagina(1);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start gap-3 rounded-2xl border bg-muted/30 p-4">
        <History className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
        <div>
          <p className="text-sm font-semibold">Log de auditoria</p>
          <p className="text-xs text-muted-foreground">
            Todas as ações que afetam colaboradores, EPIs, certificados e observações ficam registradas aqui — quem fez, o quê e quando.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => filtrarPor(() => setQ(e.target.value))}
            placeholder="Buscar por pessoa ou ação..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => filtrarPor(() => setCategoriaAtiva(null))}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              categoriaAtiva === null ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:border-primary/30"
            }`}
          >
            Todos
          </button>
          {categorias.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => filtrarPor(() => setCategoriaAtiva(c.id))}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                categoriaAtiva === c.id ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:border-primary/30"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {filtrados.length === 0 && (
          <p className="rounded-2xl border border-dashed py-16 text-center text-sm text-muted-foreground">
            Nenhum registro encontrado.
          </p>
        )}
        {visiveis.map((log, i) => {
          const cat = categorias.find((c) => c.id === log.categoria)!;
          return (
            <div key={log.id} className="relative flex gap-4 pb-5 last:pb-0">
              {i !== visiveis.length - 1 && (
                <span className="absolute left-4 top-9 h-[calc(100%-1.25rem)] w-px bg-border" />
              )}
              <div className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-4 border-background ${cat.className}`}>
                <cat.icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1 rounded-xl border bg-card p-3.5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-sm">
                    <span className="font-semibold">{log.autor}</span>{" "}
                    <span className="text-muted-foreground">{log.acao.toLowerCase()}</span>{" "}
                    <span className="font-medium">{log.alvo}</span>
                  </p>
                  <Badge variant="outline" className="shrink-0 text-[10px]">{log.autorPerfil}</Badge>
                </div>
                {log.detalhe && <p className="mt-1 text-xs text-muted-foreground">{log.detalhe}</p>}
                <p className="mt-1.5 text-[11px] text-muted-foreground">{formatData(log.data)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {filtrados.length > POR_PAGINA && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-xs text-muted-foreground">
            Página {paginaSegura} de {totalPaginas} · {filtrados.length} registros
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={paginaSegura === 1}
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Anterior
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={paginaSegura === totalPaginas}
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            >
              Próxima <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
