import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, AlertCircle, Clock, ShieldCheck, RefreshCw, Trash2, PackageMinus } from "lucide-react";
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

export const Route = createFileRoute("/gestor/certificados")({
  head: () => ({ meta: [{ title: "Monitoramento de CAs — SafeWork" }] }),
  component: CertificadosPage,
});

// setor e tipoEpi já vêm prontos no próprio registro de entrega (safework-data.ts) — nada
// pra enriquecer aqui.
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

const HOJE = new Date("2026-08-14");

function calcularStatus(validade: string): EpiStatus {
  const dias = Math.ceil((new Date(validade).getTime() - HOJE.getTime()) / (1000 * 3600 * 24));
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

function CertificadosPage() {
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
    return <AcessoRestrito mensagem="O monitoramento de certificados é do time de gestão/segurança." />;
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

  // Toda mutação passa pelo registro compartilhado (safework-data.ts) — sem isso, sair
  // desta tela e voltar perdia qualquer entrega/renovação/exclusão feita, porque o
  // componente reconstruía a lista do zero a partir do estado inicial de novo.
  const handleAdd = (nova: Omit<Certificado, "id">) => {
    const criada = addEntrega(nova);
    setLista([...entregasIniciais]);
    // A entrega sai do estoque do próprio catálogo de EPIs — sem isso, o Almoxarifado
    // continuaria mostrando a quantidade de antes mesmo depois do item já estar com o
    // colaborador.
    if (criada.epiId) {
      const epi = epis.find((e) => e.id === criada.epiId);
      if (epi) updateEpi({ ...epi, estoque: Math.max(0, epi.estoque - 1) });
    }
    addLogAuditoria({ acao: "Registrou entrega de EPI", alvo: `${criada.epi} — ${criada.colaborador}`, categoria: "certificado" });
    toast.success("Entrega registrada com sucesso — baixa de 1 unidade dada no estoque.");
  };

  const handleRenovar = (id: string, novaValidade: string) => {
    const alvo = lista.find((e) => e.id === id);
    if (!alvo) return;
    updateEntrega({ ...alvo, validade: novaValidade, status: calcularStatus(novaValidade) });
    setLista([...entregasIniciais]);
    addLogAuditoria({ acao: "Renovou certificado", alvo: `${alvo.epi} — ${alvo.colaborador}`, categoria: "certificado" });
    toast.success("Certificado renovado com sucesso.");
  };

  const handleDelete = (id: string) => {
    const alvo = lista.find((e) => e.id === id);
    removeEntrega(id);
    setLista([...entregasIniciais]);
    // Desfaz a baixa dada na hora da entrega — excluir o registro por engano não pode
    // deixar o estoque permanentemente errado.
    if (alvo?.epiId) {
      const epi = epis.find((e) => e.id === alvo.epiId);
      if (epi) updateEpi({ ...epi, estoque: epi.estoque + 1 });
    }
    if (alvo) addLogAuditoria({ acao: "Removeu registro de certificado", alvo: `${alvo.epi} — ${alvo.colaborador}`, categoria: "certificado" });
    toast.success("Registro removido.");
  };

  // Saída em lote pra quando um setor inteiro pede uma quantidade de uma vez (ex.: "RH
  // pediu 20 botinas") — não gera um certificado individual com CA/validade, só desconta
  // do estoque em nome de quem assinou pela retirada.
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
      {/* Cabeçalho — faixa de números clicáveis em vez de três cards com ícone e cor de fundo */}
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
          <NovaEntregaDialog onAdd={handleAdd} />
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

      {/* Barra de busca e filtros — sem envelope de card, parte natural do cabeçalho */}
      <section className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por colaborador, matrícula ou EPI..."
            className="pl-9"
          />
        </div>
        <Select value={statusAtivo ?? "todos"} onValueChange={(v) => setStatusAtivo(v === "todos" ? null : (v as EpiStatus))}>
          <SelectTrigger className="w-[170px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="vencido">Vencido</SelectItem>
            <SelectItem value="proximo">Próximo do vencimento</SelectItem>
            <SelectItem value="vigente">Vigente</SelectItem>
          </SelectContent>
        </Select>
        <Select value={setorAtivo ?? "todos"} onValueChange={(v) => setSetorAtivo(v === "todos" ? null : v)}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Setor" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os setores</SelectItem>
            {setores.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={tipoAtivo ?? "todos"} onValueChange={(v) => setTipoAtivo(v === "todos" ? null : v)}>
          <SelectTrigger className="w-[190px]"><SelectValue placeholder="Tipo de EPI" /></SelectTrigger>
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
      </section>

      {/* Registros agrupados por status — a urgência organiza a página em vez de ser
          só mais uma coluna com badge dentro de uma tabela genérica. */}
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
            <div className="divide-y divide-border rounded-xl border">
              {grupo.itens.map((e) => (
                <div
                  key={e.id}
                  className={`flex flex-wrap items-center gap-x-6 gap-y-2 border-l-4 p-4 ${
                    grupo.status === "vencido" ? "border-l-danger" : grupo.status === "proximo" ? "border-l-warning" : "border-l-success"
                  }`}
                >
                  <div className="min-w-[160px] flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="font-semibold">{e.colaborador}</p>
                      {colaboradorRemovido(e.matricula) && (
                        <Badge variant="outline" className="shrink-0 border-muted-foreground/30 text-[10px] text-muted-foreground">
                          Usuário removido
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{e.cargo} · {e.setor}</p>
                  </div>
                  <div className="min-w-[160px] flex-1">
                    <p>{e.epi}</p>
                    <p className="text-xs text-muted-foreground">{e.tipoEpi}</p>
                  </div>
                  <div className="min-w-[90px]">
                    <p className="font-mono text-sm">CA {e.ca}</p>
                    <p className="text-xs text-muted-foreground">Matr. {e.matricula}</p>
                  </div>
                  <div className="min-w-[110px]">
                    <p className="text-sm">{new Date(e.validade).toLocaleDateString("pt-BR")}</p>
                    <p className="text-xs text-muted-foreground">Entrega {new Date(e.dataEntrega).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div className="ml-auto flex shrink-0 items-center gap-1">
                    <RenovarDialog entrega={e} onRenovar={handleRenovar} />
                    <Button size="icon" variant="ghost" className="text-danger hover:text-danger" onClick={() => handleDelete(e.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

function NovaEntregaDialog({ onAdd }: { onAdd: (entrega: Omit<Certificado, "id">) => void }) {
  const [open, setOpen] = useState(false);
  const [colaboradorId, setColaboradorId] = useState("");
  const [epiId, setEpiId] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [validade, setValidade] = useState("");

  // Matrícula, cargo e setor não são mais digitados à mão — vêm do cadastro junto com o
  // colaborador escolhido, então não tem como errar o nome ou divergir do que já existe em
  // Colaboradores. Mesma ideia pro CA/tipo do EPI, que vem do catálogo.
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
              ca: epiSelecionado.ca,
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
                CA {epiSelecionado.ca} · {epiSelecionado.categoria}
              </p>
            )}
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Data de entrega"><Input required type="date" value={dataEntrega} onChange={(e) => setDataEntrega(e.target.value)} /></Field>
            <Field label="Validade do CA"><Input required type="date" value={validade} onChange={(e) => setValidade(e.target.value)} /></Field>
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
  // O responsável só faz sentido dentro de quem já está no setor que está pedindo — cai
  // pra lista inteira só se ainda não existir ninguém daquele setor no cadastro.
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

function RenovarDialog({ entrega, onRenovar }: { entrega: Certificado; onRenovar: (id: string, validade: string) => void }) {
  const [open, setOpen] = useState(false);
  const [validade, setValidade] = useState(entrega.validade);

  useEffect(() => {
    if (open) setValidade(entrega.validade);
  }, [open, entrega.validade]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" title="Renovar certificado"><RefreshCw className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Renovar certificado</DialogTitle>
          <DialogDescription>
            {entrega.epi} (CA {entrega.ca}) · {entrega.colaborador}
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onRenovar(entrega.id, validade);
            setOpen(false);
          }}
        >
          <Field label="Nova validade">
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
