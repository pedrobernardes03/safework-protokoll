import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Plus, AlertCircle, Clock, ShieldCheck, RefreshCw, Trash2, PackageMinus, Building2, Layers } from "lucide-react";
import {
  entregas as entregasIniciais,
  setores as setoresCatalogo,
  epis,
  colaboradores,
  saidasEmLote as saidasEmLoteIniciais,
  colaboradorRemovido,
  addLogAuditoria,
  updateEpi,
  addEntrega,
  updateEntrega,
  removeEntrega,
  addSaidaEmLote,
  gestorAtual,
  temAcessoGeral,
  type EntregaEpi,
  type EpiStatus,
} from "@/lib/safework-data";
import { AcessoRestrito } from "@/components/safework/AcessoRestrito";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type ValidadesSearch = {
  novaEntrega?: boolean;
};

export const Route = createFileRoute("/gestor/validades")({
  validateSearch: (search: Record<string, unknown>): ValidadesSearch => {
    return {
      novaEntrega: search.novaEntrega === true || search.novaEntrega === "true" || search.openModal === true || search.openModal === "true",
    };
  },
  head: () => ({ meta: [{ title: "Monitoramento de Validades — SafeWork" }] }),
  component: ValidadesPage,
});

type Certificado = EntregaEpi;

const setores = setoresCatalogo.filter((s) => s !== "Todos");

const tiposEpi = [
  "Proteção da cabeça",
  "Proteção visual",
  "Proteção das mãos",
  "Proteção dos pés",
  "Proteção facial",
  "Proteção do corpo",
  "Proteção auditiva",
];

const HOJE_STR = "2026-08-14";

function calcularStatus(validade: string): EpiStatus {
  if (!validade) return "vencido";
  const [vAno, vMes, vDia] = validade.split("T")[0].split("-").map(Number);
  const [hAno, hMes, hDia] = HOJE_STR.split("-").map(Number);
  const dValidade = new Date(vAno, vMes - 1, vDia);
  const dHoje = new Date(hAno, hMes - 1, hDia);
  const dias = Math.ceil((dValidade.getTime() - dHoje.getTime()) / (1000 * 3600 * 24));
  if (dias < 0) return "vencido";
  if (dias <= 30) return "proximo";
  return "vigente";
}

const statusMap: Record<EpiStatus, { label: string; className: string; dot: string }> = {
  vencido: { label: "Vencido", className: "bg-danger/10 text-danger border-danger/30", dot: "bg-danger" },
  proximo: { label: "Próximo do vencimento", className: "bg-warning/20 text-warning-foreground border-warning/40", dot: "bg-warning" },
  vigente: { label: "Vigente", className: "bg-success/10 text-success border-success/30", dot: "bg-success" },
};

const statusOrdem: Record<EpiStatus, number> = { vencido: 0, proximo: 1, vigente: 2 };

function ValidadesPage() {
  const { novaEntrega } = Route.useSearch();
  const [lista, setLista] = useState<Certificado[]>(() => [...entregasIniciais]);
  const [lote, setLote] = useState(() => [...saidasEmLoteIniciais]);
  const [q, setQ] = useState("");
  const [statusAtivo, setStatusAtivo] = useState<EpiStatus | null>(null);
  const [setorAtivo, setSetorAtivo] = useState<string | null>(null);
  const [tipoAtivo, setTipoAtivo] = useState<string | null>(null);

  const contagens = useMemo(
    () => ({
      vencido: lista.filter((e) => e.status === "vencido").length,
      proximo: lista.filter((e) => e.status === "proximo").length,
      vigente: lista.filter((e) => e.status === "vigente").length,
    }),
    [lista],
  );

  if (!temAcessoGeral(gestorAtual().perfil)) {
    return <AcessoRestrito mensagem="O monitoramento de validades é do time de gestão/segurança." />;
  }

  const list = lista
    .filter((e) => {
      const s = q.toLowerCase();
      const matchesQuery =
        e.colaborador.toLowerCase().includes(s) || e.matricula.includes(s) || e.epi.toLowerCase().includes(s);
      return (
        matchesQuery &&
        (!statusAtivo || e.status === statusAtivo) &&
        (!setorAtivo || e.setor === setorAtivo) &&
        (!tipoAtivo || e.tipoEpi === tipoAtivo)
      );
    })
    .sort((a, b) => statusOrdem[a.status] - statusOrdem[b.status]);

  const filtrosAtivos = [
    statusAtivo && { label: statusMap[statusAtivo].label, clear: () => setStatusAtivo(null) },
    setorAtivo && { label: setorAtivo, clear: () => setSetorAtivo(null) },
    tipoAtivo && { label: tipoAtivo, clear: () => setTipoAtivo(null) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const handleAdd = (nova: Omit<Certificado, "id">) => {
    const criada = addEntrega(nova);
    setLista([...entregasIniciais]);
    if (criada.epiId) {
      const epi = epis.find((e) => e.id === criada.epiId);
      if (epi) updateEpi({ ...epi, estoque: Math.max(0, epi.estoque - 1) });
    }
    addLogAuditoria({ acao: "Registrou entrega de EPI", alvo: `${criada.epi} — ${criada.colaborador}`, categoria: "certificado" });
    toast.success("Entrega registrada com sucesso — baixa de 1 unidade dada no estoque.");
  };

  const handleRenovar = (id: string, novaValidade: string, novaDataEntrega?: string) => {
    const alvo = lista.find((e) => e.id === id);
    if (!alvo) return;
    const dataEntrega = novaDataEntrega || HOJE_STR;
    const novoStatus = calcularStatus(novaValidade);
    const itemAtualizado: Certificado = {
      ...alvo,
      dataEntrega,
      validade: novaValidade,
      status: novoStatus,
    };
    updateEntrega(itemAtualizado);
    setLista((prev) => prev.map((item) => (item.id === id ? itemAtualizado : item)));
    addLogAuditoria({ acao: "Renovou entrega de EPI", alvo: `${alvo.epi} — ${alvo.colaborador}`, categoria: "certificado" });
    toast.success("Entrega de EPI renovada com sucesso.");
  };

  const handleDelete = (id: string) => {
    const alvo = lista.find((e) => e.id === id);
    removeEntrega(id);
    setLista([...entregasIniciais]);
    if (alvo?.epiId) {
      const epi = epis.find((e) => e.id === alvo.epiId);
      if (epi) updateEpi({ ...epi, estoque: epi.estoque + 1 });
    }
    if (alvo) addLogAuditoria({ acao: "Removeu registro de entrega de EPI", alvo: `${alvo.epi} — ${alvo.colaborador}`, categoria: "certificado" });
    toast.success("Registro removido.");
  };

  const handleBaixaDemanda = (input: { setor: string; epiId: string; quantidade: number; responsavel: string }) => {
    const criada = addSaidaEmLote(input);
    if (!criada) return;
    setLote([...saidasEmLoteIniciais]);
    addLogAuditoria({
      acao: "Deu baixa por demanda",
      alvo: `${criada.epiNome} — ${criada.setor}`,
      detalhe: `${criada.quantidade} un. · responsável: ${criada.responsavel}`,
      categoria: "epi",
    });
    toast.success(`Baixa de ${criada.quantidade} un. de "${criada.epiNome}" registrada para ${criada.setor}.`);
  };

  const grupos = (
    [
      { status: "vencido", titulo: "Vencidos", itens: list.filter((e) => e.status === "vencido") },
      { status: "proximo", titulo: "Próximos do vencimento", itens: list.filter((e) => e.status === "proximo") },
      { status: "vigente", titulo: "Vigentes", itens: list.filter((e) => e.status === "vigente") },
    ] as { status: EpiStatus; titulo: string; itens: Certificado[] }[]
  ).filter((g) => g.itens.length > 0);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Cabeçalho */}
      <section className="flex flex-wrap items-center justify-between gap-6 border-b pb-6">
        <div className="flex flex-wrap items-center gap-8">
          <StatusStat
            icon={AlertCircle}
            label="Vencidos"
            value={contagens.vencido}
            tone="danger"
            active={statusAtivo === "vencido"}
            onClick={() => setStatusAtivo((s) => (s === "vencido" ? null : "vencido"))}
          />
          <StatusStat
            icon={Clock}
            label="Próximos"
            value={contagens.proximo}
            tone="warning"
            active={statusAtivo === "proximo"}
            onClick={() => setStatusAtivo((s) => (s === "proximo" ? null : "proximo"))}
          />
          <StatusStat
            icon={ShieldCheck}
            label="Vigentes"
            value={contagens.vigente}
            tone="success"
            active={statusAtivo === "vigente"}
            onClick={() => setStatusAtivo((s) => (s === "vigente" ? null : "vigente"))}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <BaixaPorDemandaDialog onConfirm={handleBaixaDemanda} />
          <NovaEntregaDialog onAdd={handleAdd} defaultOpen={novaEntrega} />
        </div>
      </section>

      {lote.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-foreground">Saídas em lote recentes</h2>
          <div className="divide-y rounded-2xl border bg-card">
            {lote.slice(0, 5).map((s) => (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {s.epiNome} <span className="text-muted-foreground">— {s.quantidade} un.</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Setor {s.setor} · responsável {s.responsavel} · {new Date(s.data).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0">Baixa por demanda</Badge>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Barra de Filtros e Busca Unificada */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border bg-card p-3 shadow-2xs">
        <div className="relative w-full sm:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por colaborador, matrícula ou EPI..."
            className="pl-9 h-9 text-xs sm:text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusAtivo ?? "todos"} onValueChange={(v) => setStatusAtivo(v === "todos" ? null : (v as EpiStatus))}>
            <SelectTrigger className="w-full sm:w-[170px] h-9 text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="vencido">Vencido</SelectItem>
              <SelectItem value="proximo">Próximo do vencimento</SelectItem>
              <SelectItem value="vigente">Vigente</SelectItem>
            </SelectContent>
          </Select>

          <Select value={setorAtivo ?? "todos"} onValueChange={(v) => setSetorAtivo(v === "todos" ? null : v)}>
            <SelectTrigger className="w-full sm:w-[160px] h-9 text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Setor" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os setores</SelectItem>
              {setores.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={tipoAtivo ?? "todos"} onValueChange={(v) => setTipoAtivo(v === "todos" ? null : v)}>
            <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <Layers className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Tipo de EPI" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              {tiposEpi.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filtrosAtivos.map((f) => (
            <Badge key={f.label} variant="outline" className="gap-1.5 border-primary/30 text-primary">
              {f.label}
              <button type="button" onClick={f.clear} className="font-bold" aria-label={`Limpar filtro ${f.label}`}>
                ×
              </button>
            </Badge>
          ))}
        </div>
      </section>

      {/* Registros agrupados por status */}
      {grupos.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">Nenhum registro encontrado.</p>
      )}
      <div className="space-y-8">
        {grupos.map((grupo) => (
          <section key={grupo.status}>
            <div className="mb-3 flex items-center gap-2.5">
              <span className={`h-2 w-2 rounded-full ${statusMap[grupo.status].dot}`} />
              <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{grupo.titulo}</h3>
              <span className="text-sm text-muted-foreground">({grupo.itens.length})</span>
            </div>
            <div className="divide-y divide-border rounded-xl border overflow-hidden">
              {grupo.itens.map((e) => (
                <div
                  key={e.id}
                  className={`border-l-4 p-3.5 sm:p-4 transition-colors ${
                    grupo.status === "vencido"
                      ? "border-l-danger bg-danger/[0.015]"
                      : grupo.status === "proximo"
                        ? "border-l-warning bg-warning/[0.015]"
                        : "border-l-success bg-success/[0.015]"
                  }`}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
                    
                    {/* Colaborador e EPI Lado a Lado (grid de 2 colunas perfeitamente alinhadas) */}
                    <div className="grid grid-cols-2 items-start gap-3 min-w-0 md:flex-1 md:gap-6">
                      
                      {/* Colaborador */}
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex flex-wrap items-center gap-1">
                          <p className="font-semibold text-foreground text-sm leading-tight truncate">{e.colaborador}</p>
                          {colaboradorRemovido(e.matricula) && (
                            <Badge variant="outline" className="shrink-0 border-muted-foreground/30 text-[9px] px-1 py-0 text-muted-foreground">
                              Removido
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{e.cargo} · {e.setor}</p>
                        <p className="font-mono text-[11px] font-semibold text-primary/90 truncate">Matrícula: {e.matricula}</p>
                      </div>

                      {/* EPI Relacionado */}
                      <div className="min-w-0 space-y-0.5">
                        <p className="font-semibold text-foreground text-sm leading-tight truncate">{e.epi}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {e.tipoEpi}
                          <span className="hidden sm:inline">{e.ca && e.ca !== "N/A" ? ` · CA ${e.ca}` : ""}</span>
                        </p>
                      </div>

                    </div>

                    {/* Datas e Ações */}
                    <div className="flex items-center justify-between gap-3 border-t border-border/40 pt-2.5 sm:border-t-0 sm:pt-0 md:shrink-0 md:justify-end">
                      
                      {/* Datas */}
                      <div className="flex flex-1 flex-col gap-1 rounded-xl border bg-muted/40 px-3.5 py-1.5 text-xs sm:flex-initial sm:min-w-[200px]">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium text-muted-foreground">Entrega:</span>
                          <span className="font-semibold text-foreground">{new Date(e.dataEntrega).toLocaleDateString("pt-BR")}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-1">
                          <span className="font-medium text-muted-foreground">Validade:</span>
                          <span className={`font-bold ${grupo.status === "vencido" ? "text-danger" : grupo.status === "proximo" ? "text-warning-foreground" : "text-success"}`}>
                            {new Date(e.validade).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex shrink-0 items-center gap-1">
                        <RenovarDialog entrega={e} onRenovar={handleRenovar} />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-danger hover:text-danger hover:bg-danger/10" title="Excluir entrega de EPI">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir entrega de "{e.colaborador}"?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza de que deseja excluir este registro de entrega de EPI? Essa ação não poderá ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(e.id)}
                                className="bg-danger text-danger-foreground hover:bg-danger/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                    </div>

                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function StatusStat({
  icon: Icon,
  label,
  value,
  tone,
  active,
  onClick,
}: {
  icon: typeof AlertCircle;
  label: string;
  value: number;
  tone: "danger" | "warning" | "success";
  active: boolean;
  onClick: () => void;
}) {
  const toneText = { danger: "text-danger", warning: "text-warning-foreground", success: "text-success" };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-lg px-2 py-1 text-left transition-colors ${active ? "bg-muted" : "hover:bg-muted/60"}`}
    >
      <Icon className={`h-4 w-4 ${toneText[tone]}`} />
      <span className={`text-2xl font-extrabold ${toneText[tone]}`}>{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </button>
  );
}

function NovaEntregaDialog({ onAdd, defaultOpen }: { onAdd: (entrega: Omit<Certificado, "id">) => void; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  useEffect(() => {
    if (defaultOpen) {
      setOpen(true);
    }
  }, [defaultOpen]);

  const [colaboradorId, setColaboradorId] = useState("");
  const [epiId, setEpiId] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [validade, setValidade] = useState("");

  const colaboradorSelecionado = colaboradores.find((c) => c.id === colaboradorId);
  const epiSelecionado = epis.find((e) => e.id === epiId);

  const reset = () => {
    setColaboradorId("");
    setEpiId("");
    setDataEntrega("");
    setValidade("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button className="shrink-0"><Plus className="mr-2 h-4 w-4" /> Registrar nova entrega</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar nova entrega</DialogTitle>
          <DialogDescription>Escolha o colaborador e o EPI do catálogo — a entrega já dá baixa de 1 unidade no estoque.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!colaboradorSelecionado || !epiSelecionado) return;
            onAdd({
              colaborador: colaboradorSelecionado.nome,
              matricula: colaboradorSelecionado.matricula,
              cargo: colaboradorSelecionado.cargo,
              setor: colaboradorSelecionado.setor,
              epi: epiSelecionado.nome,
              epiId: epiSelecionado.id,
              tipoEpi: epiSelecionado.categoria,
              ca: epiSelecionado.ca || "N/A",
              dataEntrega,
              validade,
              status: calcularStatus(validade),
            });
            setOpen(false);
            reset();
          }}
        >
          <Field label="Colaborador">
            <Select required value={colaboradorId} onValueChange={setColaboradorId}>
              <SelectTrigger><SelectValue placeholder="Selecione o colaborador..." /></SelectTrigger>
              <SelectContent>
                {colaboradores.filter((c) => c.ativo).map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.nome} — Matr. {c.matricula}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {colaboradorSelecionado && (
              <p className="text-xs text-muted-foreground">
                {colaboradorSelecionado.cargo} · {colaboradorSelecionado.setor}
              </p>
            )}
          </Field>
          <Field label="EPI">
            <Select required value={epiId} onValueChange={setEpiId}>
              <SelectTrigger><SelectValue placeholder="Selecione o item do catálogo..." /></SelectTrigger>
              <SelectContent>
                {epis.map((e) => (
                  <SelectItem key={e.id} value={e.id} disabled={e.estoque <= 0}>
                    {e.nome} — {e.estoque > 0 ? `${e.estoque} em estoque` : "sem estoque"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {epiSelecionado && (
              <p className="text-xs text-muted-foreground">
                {epiSelecionado.categoria}
              </p>
            )}
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Data de entrega"><Input required type="date" value={dataEntrega} onChange={(e) => setDataEntrega(e.target.value)} /></Field>
            <Field label="Data de validade"><Input required type="date" value={validade} onChange={(e) => setValidade(e.target.value)} /></Field>
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Registrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function BaixaPorDemandaDialog({
  onConfirm,
}: {
  onConfirm: (input: { setor: string; epiId: string; quantidade: number; responsavel: string; responsavelId?: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [setor, setSetor] = useState("");
  const [epiId, setEpiId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [responsavelId, setResponsavelId] = useState("");

  const epiSelecionado = epis.find((e) => e.id === epiId);
  const candidatosDoSetor = setor ? colaboradores.filter((c) => c.ativo && c.setor === setor) : [];
  const responsaveis = candidatosDoSetor.length > 0 ? candidatosDoSetor : colaboradores.filter((c) => c.ativo);
  const responsavelSelecionado = colaboradores.find((c) => c.id === responsavelId);

  const quantidadeNum = Number(quantidade) || 0;
  const excedeEstoque = epiSelecionado ? quantidadeNum > epiSelecionado.estoque : false;

  const reset = () => {
    setSetor("");
    setEpiId("");
    setQuantidade("");
    setResponsavelId("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="shrink-0"><PackageMinus className="mr-2 h-4 w-4" /> Baixa por demanda</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Baixa de estoque por demanda</DialogTitle>
          <DialogDescription>
            Pra quando um setor pede uma quantidade de uma vez (ex.: "RH pediu 20 botinas") — sem certificado
            individual, só desconta do estoque em nome de quem assina pela retirada.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!epiSelecionado || !responsavelSelecionado || quantidadeNum <= 0 || excedeEstoque) return;
            onConfirm({
              setor,
              epiId: epiSelecionado.id,
              quantidade: quantidadeNum,
              responsavel: responsavelSelecionado.nome,
              responsavelId: responsavelSelecionado.id,
            });
            setOpen(false);
            reset();
          }}
        >
          <Field label="Setor solicitante">
            <Select required value={setor} onValueChange={(v) => { setSetor(v); setResponsavelId(""); }}>
              <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                {setores.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="EPI">
            <Select required value={epiId} onValueChange={setEpiId}>
              <SelectTrigger><SelectValue placeholder="Selecione o item do catálogo..." /></SelectTrigger>
              <SelectContent>
                {epis.map((e) => (
                  <SelectItem key={e.id} value={e.id} disabled={e.estoque <= 0}>
                    {e.nome} — {e.estoque > 0 ? `${e.estoque} em estoque` : "sem estoque"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Quantidade">
            <Input
              required
              type="number"
              min={1}
              max={epiSelecionado?.estoque}
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
            />
            {excedeEstoque && <p className="text-xs text-danger">Só há {epiSelecionado?.estoque} un. em estoque.</p>}
          </Field>
          <Field label="Responsável pela retirada">
            <Select required value={responsavelId} onValueChange={setResponsavelId} disabled={!setor}>
              <SelectTrigger><SelectValue placeholder={setor ? "Selecione..." : "Escolha o setor primeiro"} /></SelectTrigger>
              <SelectContent>
                {responsaveis.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.nome} — {c.setor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={excedeEstoque || quantidadeNum <= 0}>Dar baixa</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RenovarDialog({ entrega, onRenovar }: { entrega: Certificado; onRenovar: (id: string, validade: string, dataEntrega?: string) => void }) {
  const [open, setOpen] = useState(false);
  const dataHojeStr = HOJE_STR;
  const defaultNovaValidade = "2027-08-14";

  const [dataEntrega, setDataEntrega] = useState(dataHojeStr);
  const [validade, setValidade] = useState(defaultNovaValidade);

  useEffect(() => {
    if (open) {
      setDataEntrega(dataHojeStr);
      setValidade(defaultNovaValidade);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" title="Renovar entrega de EPI"><RefreshCw className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Renovar entrega de EPI</DialogTitle>
          <DialogDescription>
            {entrega.epi} · {entrega.colaborador} (Matrícula: {entrega.matricula})
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onRenovar(entrega.id, validade, dataEntrega);
            setOpen(false);
          }}
        >
          <Field label="Data da renovação/entrega">
            <Input required type="date" value={dataEntrega} onChange={(e) => setDataEntrega(e.target.value)} />
          </Field>
          <Field label="Nova data de validade">
            <Input required type="date" value={validade} onChange={(e) => setValidade(e.target.value)} />
          </Field>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Confirmar renovação</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
