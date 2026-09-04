import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Package, PackageX, PackageCheck, Boxes } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { epis, setores, iconeParaEpi } from "@/lib/safework-data";

export const Route = createFileRoute("/gestor/almoxarifado")({
  head: () => ({ meta: [{ title: "Almoxarifado — SafeWork" }] }),
  component: AlmoxarifadoPage,
});

// Mesmo corte de "estoque baixo" já usado em /gestor/epis (≤10) — só criou-se um segundo
// nível aqui (0 = "Em falta") porque essa tela é justamente pra separar rápido o que já
// acabou do que só está ficando escasso.
type StatusEstoque = "falta" | "baixo" | "ok";

function statusDoEstoque(estoque: number): StatusEstoque {
  if (estoque <= 0) return "falta";
  if (estoque <= 10) return "baixo";
  return "ok";
}

const statusConfig: Record<StatusEstoque, { label: string; className: string; barClassName: string }> = {
  falta: { label: "Em falta", className: "bg-danger/10 text-danger border-danger/30", barClassName: "bg-danger" },
  baixo: { label: "Estoque baixo", className: "bg-warning/20 text-warning-foreground border-warning/40", barClassName: "bg-warning" },
  ok: { label: "Em estoque", className: "bg-success/10 text-success border-success/30", barClassName: "bg-success" },
};

const statusFiltros: Array<{ id: StatusEstoque | "todos"; label: string }> = [
  { id: "todos", label: "Todos" },
  { id: "falta", label: "Em falta" },
  { id: "baixo", label: "Estoque baixo" },
  { id: "ok", label: "Em estoque" },
];

// Tela só de conferência pro almoxarifado — "o que temos e o que está faltando" — por isso
// é somente leitura aqui. Ajustar a quantidade continua em /gestor/epis, junto do resto do
// cadastro do equipamento; duplicar esse formulário aqui só criaria duas fontes de verdade
// pro mesmo número.
function AlmoxarifadoPage() {
  const [q, setQ] = useState("");
  const [setorAtivo, setSetorAtivo] = useState<string>("Todos os setores");
  const [statusAtivo, setStatusAtivo] = useState<StatusEstoque | "todos">("todos");

  const maiorEstoque = useMemo(() => Math.max(1, ...epis.map((e) => e.estoque)), []);

  const lista = epis
    .filter((e) => e.nome.toLowerCase().includes(q.toLowerCase()) || e.ca.includes(q))
    .filter((e) => setorAtivo === "Todos os setores" || e.setores.includes(setorAtivo))
    .filter((e) => statusAtivo === "todos" || statusDoEstoque(e.estoque) === statusAtivo)
    .sort((a, b) => a.estoque - b.estoque);

  const totalItens = epis.length;
  const emFalta = epis.filter((e) => statusDoEstoque(e.estoque) === "falta").length;
  const estoqueBaixo = epis.filter((e) => statusDoEstoque(e.estoque) === "baixo").length;
  const totalUnidades = epis.reduce((soma, e) => soma + e.estoque, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col justify-between rounded-2xl border bg-card p-4">
          <Boxes className="h-4 w-4 text-primary" />
          <div className="mt-3">
            <p className="text-2xl font-extrabold">{totalItens}</p>
            <p className="text-xs text-muted-foreground">Itens no catálogo</p>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-2xl border bg-card p-4">
          <PackageX className="h-4 w-4 text-danger" />
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-danger">{emFalta}</p>
            <p className="text-xs text-muted-foreground">Em falta</p>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-2xl border bg-card p-4">
          <Package className="h-4 w-4 text-warning-foreground" />
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-warning-foreground">{estoqueBaixo}</p>
            <p className="text-xs text-muted-foreground">Estoque baixo</p>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-2xl border bg-card p-4">
          <PackageCheck className="h-4 w-4 text-success" />
          <div className="mt-3">
            <p className="text-2xl font-extrabold">{totalUnidades}</p>
            <p className="text-xs text-muted-foreground">Unidades no total</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-[260px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou CA..." className="pl-9" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            {statusFiltros.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStatusAtivo(s.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusAtivo === s.id ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:border-primary/30"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <Select value={setorAtivo} onValueChange={setSetorAtivo}>
            <SelectTrigger className="w-full sm:w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos os setores">Todos os setores</SelectItem>
              {setores.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {lista.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed py-16 text-center text-muted-foreground">
          <Package className="h-8 w-8" />
          <p className="text-sm">Nenhum item encontrado com esses filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((e) => {
            const Icon = iconeParaEpi(e.categoria);
            const status = statusDoEstoque(e.estoque);
            const cfg = statusConfig[status];
            const barPct = Math.max(4, Math.round((e.estoque / maiorEstoque) * 100));
            return (
              <div key={e.id} className="flex flex-col gap-3 rounded-2xl border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold leading-snug">{e.nome}</p>
                      <p className="text-xs text-muted-foreground">CA {e.ca}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`shrink-0 ${cfg.className}`}>
                    {cfg.label}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1">
                  {e.setores.map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                  ))}
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-xl font-extrabold">
                      {e.estoque} <span className="text-xs font-normal text-muted-foreground">unidades</span>
                    </p>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${cfg.barClassName}`} style={{ width: `${barPct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
