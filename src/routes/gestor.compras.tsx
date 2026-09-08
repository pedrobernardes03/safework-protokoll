import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, ShoppingCart, PackageCheck, Clock3, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { gestorAtual, solicitacoesCompra, marcarComprado, addLogAuditoria } from "@/lib/safework-data";

export const Route = createFileRoute("/gestor/compras")({
  head: () => ({ meta: [{ title: "Compras — SafeWork" }] }),
  component: ComprasPage,
});

function formatData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// Só vê essa tela quem tem perfil Compras (ou Administrador, que enxerga tudo) — o
// Almoxarifado que ORIGINA os pedidos não tem acesso aqui; ele só sabe que já solicitou
// (badge "Solicitado ao Compras"), não o andamento do lado do Compras.
function ComprasPage() {
  const eu = gestorAtual();
  const [, forcarAtualizacao] = useState(0);

  if (eu.perfil !== "Compras" && eu.perfil !== "Administrador") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
        <Lock className="h-8 w-8 text-muted-foreground" />
        <p className="font-semibold">Acesso restrito</p>
        <p className="text-sm text-muted-foreground">
          Só o setor de Compras pode ver e dar andamento nos pedidos de reposição.
        </p>
      </div>
    );
  }

  const pendentes = solicitacoesCompra
    .filter((s) => s.status === "pendente")
    .sort((a, b) => b.data.localeCompare(a.data));
  const compradas = solicitacoesCompra
    .filter((s) => s.status === "comprado")
    .sort((a, b) => (b.dataComprado ?? "").localeCompare(a.dataComprado ?? ""));
  const unidadesPendentes = pendentes.reduce((soma, s) => soma + s.quantidade, 0);

  const handleMarcarComprado = (id: string, epiNome: string) => {
    marcarComprado(id);
    addLogAuditoria({ acao: "Marcou compra como concluída", alvo: epiNome, categoria: "compra" });
    toast.success(`"${epiNome}" marcado como comprado — estoque atualizado.`);
    forcarAtualizacao((n) => n + 1);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
        <ShoppingCart className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <div>
          <p className="text-sm font-semibold text-blue-600">Painel do setor de Compras</p>
          <p className="text-xs text-muted-foreground">
            Pedidos de reposição enviados pelo Almoxarifado aparecem aqui. Marcar como comprado já dá entrada no estoque do item.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col justify-between rounded-2xl border bg-card p-4">
          <Clock3 className="h-4 w-4 text-warning-foreground" />
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-warning-foreground">{pendentes.length}</p>
            <p className="text-xs text-muted-foreground">Pedidos pendentes</p>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-2xl border bg-card p-4">
          <ShoppingCart className="h-4 w-4 text-primary" />
          <div className="mt-3">
            <p className="text-2xl font-extrabold">{unidadesPendentes}</p>
            <p className="text-xs text-muted-foreground">Unidades a comprar</p>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-2xl border bg-card p-4">
          <PackageCheck className="h-4 w-4 text-success" />
          <div className="mt-3">
            <p className="text-2xl font-extrabold">{compradas.length}</p>
            <p className="text-xs text-muted-foreground">Já compradas</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground">Pendentes</h2>
        {pendentes.length === 0 ? (
          <div className="flex items-center gap-3 rounded-2xl border border-success/30 bg-success/5 p-4">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
            <p className="text-sm text-foreground">Nenhum pedido pendente no momento.</p>
          </div>
        ) : (
          <div className="divide-y rounded-2xl border bg-card">
            {pendentes.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{s.epiNome}</p>
                  <p className="text-xs text-muted-foreground">
                    CA {s.ca} · {s.quantidade} un. · pedido por {s.solicitadoPor} em {formatData(s.data)}
                  </p>
                </div>
                <Button size="sm" onClick={() => handleMarcarComprado(s.id, s.epiNome)} className="shrink-0">
                  <PackageCheck className="h-3.5 w-3.5" /> Marcar como comprado
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {compradas.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-foreground">Histórico</h2>
          <div className="divide-y rounded-2xl border bg-card">
            {compradas.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{s.epiNome}</p>
                  <p className="text-xs text-muted-foreground">
                    CA {s.ca} · {s.quantidade} un. · pedido por {s.solicitadoPor}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0 border-success/30 text-success">
                  Comprado em {s.dataComprado ? formatData(s.dataComprado) : "—"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
