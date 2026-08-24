import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, AlertCircle, Clock, ShieldCheck, RefreshCw, Trash2 } from "lucide-react";
import { entregas as entregasIniciais, type EntregaEpi, type EpiStatus } from "@/lib/safework-data";
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

const setores = ["SST", "Manutenção", "Produção", "Logística"];

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
    toast.success("Entrega registrada com sucesso.");
  };

  const handleRenovar = (id: string, novaValidade: string) => {
    setLista((prev) =>
      prev.map((e) => (e.id === id ? { ...e, validade: novaValidade, status: calcularStatus(novaValidade) } : e)),
    );
    toast.success("Certificado renovado com sucesso.");
  };

  const handleDelete = (id: string) => {
    setLista((prev) => prev.filter((e) => e.id !== id));
    toast.success("Registro removido.");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Indicadores clicáveis — clicar filtra a tabela abaixo para aquele status específico */}
      <section className="grid gap-4 sm:grid-cols-3">
        <IndicatorCard
          icon={AlertCircle}
          label="CAs vencidos"
          value={contagens.vencido}
          tone="danger"
          desc="Substituição imediata"
          active={statusAtivo === "vencido"}
          onClick={() => setStatusAtivo((s) => (s === "vencido" ? null : "vencido"))}
        />
        <IndicatorCard
          icon={Clock}
          label="Próximos do vencimento"
          value={contagens.proximo}
          tone="warning"
          desc="Renovar em até 30 dias"
          active={statusAtivo === "proximo"}
          onClick={() => setStatusAtivo((s) => (s === "proximo" ? null : "proximo"))}
        />
        <IndicatorCard
          icon={ShieldCheck}
          label="CAs vigentes"
          value={contagens.vigente}
          tone="success"
          desc="Em conformidade"
          active={statusAtivo === "vigente"}
          onClick={() => setStatusAtivo((s) => (s === "vigente" ? null : "vigente"))}
        />
      </section>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Entregas e certificados</CardTitle>
              <CardDescription>{lista.length} registros · ordenados por urgência.</CardDescription>
            </div>
            <NovaEntregaDialog onAdd={handleAdd} />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por colaborador, matrícula ou EPI..."
                className="pl-9"
              />
            </div>
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
          </div>

          {filtrosAtivos.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {filtrosAtivos.map((f) => (
                <Badge key={f.label} variant="outline" className="gap-1.5 border-primary/30 text-primary">
                  {f.label}
                  <button type="button" onClick={f.clear} className="font-bold" aria-label={`Limpar filtro ${f.label}`}>
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Cargo / Setor</TableHead>
                  <TableHead>EPI / Tipo</TableHead>
                  <TableHead>CA</TableHead>
                  <TableHead>Entrega</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((e) => {
                  const s = statusMap[e.status];
                  return (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.colaborador}</TableCell>
                      <TableCell className="font-mono text-sm">{e.matricula}</TableCell>
                      <TableCell>
                        <p>{e.cargo}</p>
                        <p className="text-xs text-muted-foreground">{e.setor}</p>
                      </TableCell>
                      <TableCell>
                        <p>{e.epi}</p>
                        <p className="text-xs text-muted-foreground">{e.tipoEpi}</p>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{e.ca}</TableCell>
                      <TableCell>{new Date(e.dataEntrega).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{new Date(e.validade).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={s.className}>
                          <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <RenovarDialog entrega={e} onRenovar={handleRenovar} />
                        <Button size="icon" variant="ghost" className="text-danger hover:text-danger" onClick={() => handleDelete(e.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function IndicatorCard({
  icon: Icon,
  label,
  value,
  tone,
  desc,
  active,
  onClick,
}: {
  icon: typeof AlertCircle;
  label: string;
  value: number;
  tone: "danger" | "warning" | "success";
  desc: string;
  active: boolean;
  onClick: () => void;
}) {
  const tones = {
    danger: { chip: "bg-danger/10 text-danger", ring: "ring-danger/20", activeBg: "bg-danger/5", activeRing: "ring-danger/50" },
    warning: { chip: "bg-warning/20 text-warning-foreground", ring: "ring-warning/30", activeBg: "bg-warning/10", activeRing: "ring-warning/60" },
    success: { chip: "bg-success/10 text-success", ring: "ring-success/20", activeBg: "bg-success/5", activeRing: "ring-success/50" },
  };
  return (
    <button type="button" onClick={onClick} className="text-left">
      <Card
        className={`ring-1 transition-shadow hover:shadow-md ${
          active ? `${tones[tone].activeRing} ${tones[tone].activeBg} ring-2 shadow-md` : tones[tone].ring
        }`}
      >
        <CardContent className="flex items-center gap-4 p-5">
          <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${tones[tone].chip}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        </CardContent>
      </Card>
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
          <div className="grid grid-cols-2 gap-3">
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
          <div className="grid grid-cols-2 gap-3">
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
          <div className="grid grid-cols-2 gap-3">
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
