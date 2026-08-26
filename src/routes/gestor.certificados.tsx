import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, AlertCircle, Clock, ShieldCheck, RefreshCw, Trash2 } from "lucide-react";
import { entregas as entregasIniciais, setores as setoresCatalogo, colaboradorRemovido, addLogAuditoria, type EntregaEpi, type EpiStatus } from "@/lib/safework-data";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/gestor/certificados")({
  head: () => ({ meta: [{ title: "Monitoramento de CAs — SafeWork" }] }),
  component: CertificadosPage,
});

interface Certificado extends EntregaEpi {
  setor: string;
  tipoEpi: string;
}

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

// A entrega bruta (safework-data.ts) não carrega setor/tipo — enriquecida aqui uma vez,
// no carregamento do módulo, por matrícula/EPI, em vez de recalcular a cada render.
const setorPorMatricula: Record<string, string> = {
  "10298": "Manutenção",
  "10122": "Produção",
  "10455": "Produção",
  "10390": "Logística",
};
const tipoPorEpi: Record<string, string> = {
  "Capacete": "Proteção da cabeça",
  "Óculos": "Proteção visual",
  "Luvas isolantes": "Proteção das mãos",
  "Botina": "Proteção dos pés",
  "Máscara de solda": "Proteção facial",
  "Colete refletivo": "Proteção do corpo",
};

const certificadosIniciais: Certificado[] = entregasIniciais.map((e) => ({
  ...e,
  setor: setorPorMatricula[e.matricula] ?? "SST",
  tipoEpi: tipoPorEpi[e.epi] ?? "Proteção da cabeça",
}));

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
  const [lista, setLista] = useState<Certificado[]>(certificadosIniciais);
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

  const handleAdd = (nova: Certificado) => {
    setLista((prev) => [nova, ...prev]);
    addLogAuditoria({ acao: "Registrou entrega de EPI", alvo: `${nova.epi} — ${nova.colaborador}`, categoria: "certificado" });
    toast.success("Entrega registrada com sucesso.");
  };

  const handleRenovar = (id: string, novaValidade: string) => {
    const alvo = lista.find((e) => e.id === id);
    setLista((prev) =>
      prev.map((e) => (e.id === id ? { ...e, validade: novaValidade, status: calcularStatus(novaValidade) } : e)),
    );
    if (alvo) addLogAuditoria({ acao: "Renovou certificado", alvo: `${alvo.epi} — ${alvo.colaborador}`, categoria: "certificado" });
    toast.success("Certificado renovado com sucesso.");
  };

  const handleDelete = (id: string) => {
    const alvo = lista.find((e) => e.id === id);
    setLista((prev) => prev.filter((e) => e.id !== id));
    if (alvo) addLogAuditoria({ acao: "Removeu registro de certificado", alvo: `${alvo.epi} — ${alvo.colaborador}`, categoria: "certificado" });
    toast.success("Registro removido.");
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
        <NovaEntregaDialog onAdd={handleAdd} />
      </section>

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

function NovaEntregaDialog({ onAdd }: { onAdd: (entrega: Certificado) => void }) {
  const [open, setOpen] = useState(false);
  const [colaborador, setColaborador] = useState("");
  const [matricula, setMatricula] = useState("");
  const [cargo, setCargo] = useState("");
  const [setor, setSetor] = useState("");
  const [epi, setEpi] = useState("");
  const [tipoEpi, setTipoEpi] = useState("");
  const [ca, setCa] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [validade, setValidade] = useState("");

  const reset = () => {
    setColaborador("");
    setMatricula("");
    setCargo("");
    setSetor("");
    setEpi("");
    setTipoEpi("");
    setCa("");
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
          <DialogDescription>Vincule um EPI e o CA correspondente a um colaborador.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onAdd({
              id: Math.random().toString(36).slice(2),
              colaborador,
              matricula,
              cargo,
              setor,
              epi,
              tipoEpi,
              ca,
              dataEntrega,
              validade,
              status: calcularStatus(validade),
            });
            setOpen(false);
            reset();
          }}
        >
          <Field label="Colaborador"><Input required value={colaborador} onChange={(e) => setColaborador(e.target.value)} /></Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Matrícula"><Input required value={matricula} onChange={(e) => setMatricula(e.target.value)} /></Field>
            <Field label="Cargo"><Input required value={cargo} onChange={(e) => setCargo(e.target.value)} /></Field>
          </div>
          <Field label="Setor">
            <Select required value={setor} onValueChange={setSetor}>
              <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                {setores.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="EPI"><Input required value={epi} onChange={(e) => setEpi(e.target.value)} /></Field>
            <Field label="Número do CA"><Input required value={ca} onChange={(e) => setCa(e.target.value)} /></Field>
          </div>
          <Field label="Tipo de EPI">
            <Select required value={tipoEpi} onValueChange={setTipoEpi}>
              <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                {tiposEpi.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
