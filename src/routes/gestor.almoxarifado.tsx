import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ClipboardCopy, CircleCheck, TriangleAlert, ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  epis,
  setores,
  iconeParaEpi,
  gestorAtual,
  temAcessoGeral,
  solicitacoesCompra,
  addSolicitacaoCompra,
  addLogAuditoria,
} from "@/lib/safework-data";
import { AcessoRestrito } from "@/components/safework/AcessoRestrito";

export const Route = createFileRoute("/gestor/almoxarifado")({
  head: () => ({ meta: [{ title: "Almoxarifado — SafeWork" }] }),
  component: AlmoxarifadoPage,
});

// Mesmo corte de "estoque baixo" já usado em /gestor/epis (≤10) — só criou-se um segundo
// nível aqui (0 = "Em falta") porque essa tela separa o que já acabou do que só está
// ficando escasso. META é o nível que consideramos "saudável" pra sugerir quanto repor —
// não existe esse campo no cadastro do EPI, então é um número fixo só pra essa sugestão.
type StatusEstoque = "falta" | "baixo" | "ok";
const META_REPOSICAO = 20;

function statusDoEstoque(estoque: number): StatusEstoque {
  if (estoque <= 0) return "falta";
  if (estoque <= 10) return "baixo";
  return "ok";
}

const statusConfig: Record<StatusEstoque, { label: string; text: string; bar: string; iconBg: string; border: string }> = {
  falta: { label: "Em falta", text: "text-danger", bar: "bg-danger", iconBg: "bg-danger/10 text-danger", border: "border-l-danger" },
  baixo: { label: "Estoque baixo", text: "text-warning-foreground", bar: "bg-warning", iconBg: "bg-warning/20 text-warning-foreground", border: "border-l-warning" },
  ok: { label: "Em estoque", text: "text-success", bar: "bg-success", iconBg: "bg-success/10 text-success", border: "border-l-success" },
};

// Tela só de conferência pro almoxarifado — "o que temos e o que está faltando" — por isso
// é somente leitura aqui. Ajustar a quantidade continua em /gestor/epis, junto do resto do
// cadastro do equipamento; duplicar esse formulário aqui só criaria duas fontes de verdade
// pro mesmo número.
function AlmoxarifadoPage() {
  const [q, setQ] = useState("");
  const [setorAtivo, setSetorAtivo] = useState<string>("Todos os setores");
  // solicitacoesCompra é um array compartilhado (mutado direto por addSolicitacaoCompra) —
  // esse contador não é lido em nenhum lugar, só existe pra forçar o componente a
  // re-renderizar depois de um envio e refletir o estado novo do array.
  const [, forcarAtualizacao] = useState(0);

  if (!temAcessoGeral(gestorAtual().perfil)) {
    return <AcessoRestrito mensagem="O Almoxarifado é do time de gestão/segurança." />;
  }

  const combina = (e: (typeof epis)[number]) =>
    (e.nome.toLowerCase().includes(q.toLowerCase()) || e.ca.includes(q)) &&
    (setorAtivo === "Todos os setores" || e.setores.includes(setorAtivo));

  const emFalta = epis.filter((e) => statusDoEstoque(e.estoque) === "falta");
  const estoqueBaixo = epis.filter((e) => statusDoEstoque(e.estoque) === "baixo");
  const emEstoque = epis.filter((e) => statusDoEstoque(e.estoque) === "ok");
  const totalUnidades = epis.reduce((soma, e) => soma + e.estoque, 0);

  const criticos = [...emFalta, ...estoqueBaixo].filter(combina).sort((a, b) => a.estoque - b.estoque);
  const saudaveis = emEstoque.filter(combina).sort((a, b) => a.nome.localeCompare(b.nome));
  const nadaEncontrado = criticos.length === 0 && saudaveis.length === 0;

  const idsJaSolicitados = new Set(
    solicitacoesCompra.filter((s) => s.status === "pendente").map((s) => s.epiId),
  );
  const pendentesDeEnvio = criticos.filter((e) => !idsJaSolicitados.has(e.id));

  const handleCopiarLista = () => {
    const linhas = criticos.map(
      (e) => `- ${e.nome} (CA ${e.ca}): repor ${Math.max(META_REPOSICAO - e.estoque, 0)} un. — atual ${e.estoque} un.`,
    );
    const texto = `Lista de reposição — Almoxarifado\n${linhas.join("\n")}`;
    navigator.clipboard
      .writeText(texto)
      .then(() => toast.success("Lista de reposição copiada."))
      .catch(() => toast.error("Não foi possível copiar a lista."));
  };

  const handleEnviarCompras = () => {
    if (pendentesDeEnvio.length === 0) {
      toast.info("Todos os itens críticos já foram solicitados ao Compras.");
      return;
    }
    const solicitante = gestorAtual().nome;
    pendentesDeEnvio.forEach((e) => {
      addSolicitacaoCompra({
        epiId: e.id,
        epiNome: e.nome,
        ca: e.ca,
        quantidade: Math.max(META_REPOSICAO - e.estoque, 0),
        solicitadoPor: solicitante,
      });
    });
    addLogAuditoria({
      acao: "Solicitou compra",
      alvo: pendentesDeEnvio.length === 1 ? pendentesDeEnvio[0].nome : `${pendentesDeEnvio.length} itens`,
      categoria: "compra",
    });
    toast.success(
      pendentesDeEnvio.length === 1
        ? `"${pendentesDeEnvio[0].nome}" enviado ao Compras.`
        : `${pendentesDeEnvio.length} itens enviados ao Compras.`,
    );
    forcarAtualizacao((n) => n + 1);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Painel único no lugar de 4 blocos de KPI repetidos — o número total vira o
          protagonista, e a barra empilhada mostra a proporção falta/baixo/ok de um jeito
          que dá pra "ler" em 1 segundo, em vez de comparar 4 caixas iguais lado a lado. */}
      <div className="rounded-2xl border bg-card p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estoque total</p>
            <p className="mt-1.5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              {totalUnidades}
              <span className="ml-2 text-base font-medium text-muted-foreground">unidades</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">distribuídas em {epis.length} itens do catálogo</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success" /> {emEstoque.length} em estoque
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-warning" /> {estoqueBaixo.length} baixo
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-danger" /> {emFalta.length} em falta
            </span>
          </div>
        </div>
        <div className="mt-5 flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
          {emEstoque.length > 0 && (
            <div
              className="h-full bg-success"
              style={{ width: `${(emEstoque.length / epis.length) * 100}%` }}
              title={`${emEstoque.length} em estoque`}
            />
          )}
          {estoqueBaixo.length > 0 && (
            <div
              className="h-full bg-warning"
              style={{ width: `${(estoqueBaixo.length / epis.length) * 100}%` }}
              title={`${estoqueBaixo.length} com estoque baixo`}
            />
          )}
          {emFalta.length > 0 && (
            <div
              className="h-full bg-danger"
              style={{ width: `${(emFalta.length / epis.length) * 100}%` }}
              title={`${emFalta.length} em falta`}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-[260px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou CA..." className="pl-9" />
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

      {nadaEncontrado ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed py-16 text-center text-muted-foreground">
          <Search className="h-8 w-8" />
          <p className="text-sm">Nenhum item encontrado com esses filtros.</p>
        </div>
      ) : (
        <>
          {criticos.length > 0 ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <TriangleAlert className="h-4 w-4 text-warning-foreground" />
                  <h2 className="text-sm font-bold text-foreground">Precisa de reposição</h2>
                  <Badge variant="secondary">{criticos.length}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopiarLista}
                    className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                  >
                    <ClipboardCopy className="h-3.5 w-3.5" /> Copiar lista
                  </button>
                  <button
                    type="button"
                    onClick={handleEnviarCompras}
                    disabled={pendentesDeEnvio.length === 0}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Enviar ao Compras
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {criticos.map((e) => {
                  const Icon = iconeParaEpi(e.categoria);
                  const status = statusDoEstoque(e.estoque);
                  const cfg = statusConfig[status];
                  const sugestao = Math.max(META_REPOSICAO - e.estoque, 0);
                  const jaSolicitado = idsJaSolicitados.has(e.id);
                  return (
                    <div key={e.id} className={`flex flex-col gap-3 rounded-xl border border-l-4 bg-card p-4 ${cfg.border}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${cfg.iconBg}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold leading-snug">{e.nome}</p>
                            <p className="text-xs text-muted-foreground">CA {e.ca}</p>
                          </div>
                        </div>
                        <span className={`shrink-0 text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1">
                        {e.setores.map((s) => (
                          <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                        ))}
                        {jaSolicitado && (
                          <Badge variant="outline" className="gap-1 border-blue-500/30 text-[10px] text-blue-600">
                            <Check className="h-2.5 w-2.5" /> Solicitado ao Compras
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-end justify-between border-t pt-3">
                        <div>
                          <p className="text-lg font-extrabold leading-none">{e.estoque}<span className="ml-1 text-xs font-normal text-muted-foreground">un. agora</span></p>
                        </div>
                        <p className={`text-sm font-semibold ${cfg.text}`}>Repor {sugestao} un.</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-success/30 bg-success/5 p-4">
              <CircleCheck className="h-5 w-5 shrink-0 text-success" />
              <p className="text-sm text-foreground">Nenhum item precisando de reposição no momento.</p>
            </div>
          )}

          {saudaveis.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-foreground">Em estoque</h2>
              <div className="divide-y rounded-2xl border bg-card">
                {saudaveis.map((e) => {
                  const Icon = iconeParaEpi(e.categoria);
                  return (
                    <div key={e.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-success/10 text-success">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{e.nome}</p>
                        <p className="truncate text-xs text-muted-foreground">CA {e.ca} · {e.setores.join(", ")}</p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-foreground">{e.estoque} <span className="font-normal text-muted-foreground">un.</span></p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
