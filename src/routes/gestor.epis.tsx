import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { HardHat, Search, Pencil, Trash2, Layers } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { CreatableSelect, CreatableMultiSelect } from "@/components/safework/CreatableSelect";
import {
  epis as episIniciais,
  categoriasEpi,
  funcoesEpi,
  setores,
  iconeParaEpi,
  addEpi,
  updateEpi,
  removeEpi,
  addCategoriaEpi,
  addFuncaoEpi,
  addSetor,
  addLogAuditoria,
  gestorAtual,
  temAcessoGeral,
  type Epi,
} from "@/lib/safework-data";
import { AcessoRestrito } from "@/components/safework/AcessoRestrito";
import { ScrollableFilterBar } from "@/components/safework/ScrollableFilterBar";

export const Route = createFileRoute("/gestor/epis")({
  head: () => ({ meta: [{ title: "Cadastro de EPIs — SafeWork" }] }),
  component: EpisPage,
});

function formatPrazo(validade: string) {
  if (!validade) return "—";
  if (validade.includes("-")) {
    const d = new Date(validade);
    return isNaN(d.getTime()) ? validade : d.toLocaleDateString("pt-BR");
  }
  return validade;
}

const prazosPadrao = [
  "3 meses",
  "6 meses",
  "1 ano",
  "1 ano e meio",
  "2 anos",
  "3 anos",
  "5 anos",
];

type TimeUnit = "dias" | "meses" | "anos";

function parsePrazoCustom(val: string): { amount: number; unit: TimeUnit } {
  if (!val) return { amount: 18, unit: "meses" };
  if (val === "1 ano e meio") return { amount: 18, unit: "meses" };

  const match = val.match(/^(\d+(?:[\.,]\d+)?)\s*(dia|dias|mês|mes|meses|ano|anos)?$/i);
  if (match) {
    const rawAmount = parseFloat(match[1].replace(",", "."));
    const amount = isNaN(rawAmount) || rawAmount <= 0 ? 1 : rawAmount;
    const unitStr = match[2]?.toLowerCase() || "meses";
    let unit: TimeUnit = "meses";
    if (unitStr.startsWith("dia")) unit = "dias";
    else if (unitStr.startsWith("ano")) unit = "anos";
    else unit = "meses";
    return { amount, unit };
  }
  return { amount: 18, unit: "meses" };
}

function buildPrazoString(amount: number, unit: TimeUnit): string {
  const safeAmount = Math.max(1, amount);
  if (unit === "dias") {
    return safeAmount === 1 ? "1 dia" : `${safeAmount} dias`;
  }
  if (unit === "meses") {
    return safeAmount === 1 ? "1 mês" : `${safeAmount} meses`;
  }
  if (unit === "anos") {
    return safeAmount === 1 ? "1 ano" : `${safeAmount} anos`;
  }
  return `${safeAmount} ${unit}`;
}

function PrazoSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const isCustomValue = Boolean(value && !prazosPadrao.includes(value));
  const [mode, setMode] = useState<"select" | "custom">(isCustomValue ? "custom" : "select");

  const initialParsed = parsePrazoCustom(value);
  const [customAmount, setCustomAmount] = useState<number>(initialParsed.amount);
  const [customUnit, setCustomUnit] = useState<TimeUnit>(initialParsed.unit);

  useEffect(() => {
    if (value && !prazosPadrao.includes(value)) {
      setMode("custom");
      const parsed = parsePrazoCustom(value);
      setCustomAmount(parsed.amount);
      setCustomUnit(parsed.unit);
    } else if (value && prazosPadrao.includes(value)) {
      setMode("select");
    }
  }, [value]);

  const updateCustomValue = (newAmount: number, newUnit: TimeUnit) => {
    setCustomAmount(newAmount);
    setCustomUnit(newUnit);
    onChange(buildPrazoString(newAmount, newUnit));
  };

  return (
    <div className="space-y-1.5">
      <Label>Prazo de validade do EPI</Label>
      {mode === "custom" ? (
        <div className="space-y-2 rounded-lg border border-border/80 bg-muted/20 p-2.5">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Prazo personalizado em tempo:</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-primary hover:text-primary/80"
              onClick={() => {
                setMode("select");
                if (!prazosPadrao.includes(value)) {
                  onChange("1 ano");
                }
              }}
            >
              Voltar para lista
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-28">
              <Input
                type="number"
                min={1}
                max={365}
                required
                autoFocus
                className="h-9 font-medium"
                value={customAmount}
                onChange={(e) => {
                  const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                  updateCustomValue(val, customUnit);
                }}
              />
            </div>

            <Select
              value={customUnit}
              onValueChange={(u: TimeUnit) => {
                updateCustomValue(customAmount, u);
              }}
            >
              <SelectTrigger className="h-9 flex-1 font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dias">{customAmount === 1 ? "Dia" : "Dias"}</SelectItem>
                <SelectItem value="meses">{customAmount === 1 ? "Mês" : "Meses"}</SelectItem>
                <SelectItem value="anos">{customAmount === 1 ? "Ano" : "Anos"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-[11px] text-muted-foreground">
            Padrão final: <strong className="font-semibold text-foreground">{buildPrazoString(customAmount, customUnit)}</strong>
          </div>
        </div>
      ) : (
        <Select
          required
          value={prazosPadrao.includes(value) ? value : "__custom__"}
          onValueChange={(v) => {
            if (v === "__custom__") {
              setMode("custom");
              const parsed = parsePrazoCustom(value);
              const initialAmount = parsed.amount || 18;
              const initialUnit = parsed.unit || "meses";
              updateCustomValue(initialAmount, initialUnit);
            } else {
              onChange(v);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o prazo..." />
          </SelectTrigger>
          <SelectContent>
            {prazosPadrao.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
            <SelectItem value="__custom__" className="font-semibold text-primary">
              + Outro prazo (personalizado)...
            </SelectItem>
          </SelectContent>
        </Select>
      )}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {["6 meses", "1 ano", "2 anos", "3 anos"].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setMode("select");
              onChange(p);
            }}
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
              value === p
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function EpisPage() {
  const [lista, setLista] = useState<Epi[]>(() => [...episIniciais]);
  const [categorias, setCategorias] = useState<string[]>(() => [...categoriasEpi]);
  const [funcoes, setFuncoes] = useState<string[]>(() => [...funcoesEpi]);
  const [setoresState, setSetoresState] = useState<string[]>(() => [...setores]);
  const [q, setQ] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);

  const categoriasComContagem = useMemo(() => {
    const counts = new Map<string, number>();
    lista.forEach((e) => counts.set(e.categoria, (counts.get(e.categoria) ?? 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [lista]);

  if (!temAcessoGeral(gestorAtual().perfil)) {
    return <AcessoRestrito mensagem="O catálogo de EPIs é do time de gestão/segurança." />;
  }

  const list = lista.filter(
    (e) =>
      (e.nome.toLowerCase().includes(q.toLowerCase()) ||
        e.categoria.toLowerCase().includes(q.toLowerCase()) ||
        (e.ca && e.ca.includes(q))) &&
      (!categoriaAtiva || e.categoria === categoriaAtiva),
  );

  // Toda mutação passa pelo catálogo compartilhado (safework-data.ts) — é o que faz o
  // colaborador ver, na hora, um EPI novo cadastrado aqui quando o gestor o atribuir a ele.
  const handleAdd = (novo: Omit<Epi, "id">) => {
    const criado = addEpi(novo);
    setLista([...episIniciais]);
    addLogAuditoria({ acao: "Cadastrou EPI", alvo: criado.nome, categoria: "epi" });
    toast.success(`"${criado.nome}" cadastrado com sucesso.`);
  };

  const handleSave = (atualizado: Epi) => {
    updateEpi(atualizado);
    setLista([...episIniciais]);
    addLogAuditoria({ acao: "Editou EPI", alvo: atualizado.nome, categoria: "epi" });
    toast.success("EPI atualizado com sucesso.");
  };

  const handleDelete = (id: string) => {
    const alvo = lista.find((e) => e.id === id);
    removeEpi(id);
    setLista([...episIniciais]);
    if (alvo) addLogAuditoria({ acao: "Removeu EPI do catálogo", alvo: alvo.nome, categoria: "epi" });
    toast.success("EPI removido do catálogo.");
  };

  const handleCreateCategoria = (nova: string) => {
    addCategoriaEpi(nova);
    setCategorias([...categoriasEpi]);
    toast.success(`Categoria "${nova}" criada.`);
  };

  const handleCreateFuncao = (nova: string) => {
    addFuncaoEpi(nova);
    setFuncoes([...funcoesEpi]);
    toast.success(`Função "${nova}" criada.`);
  };

  const handleCreateSetor = (novo: string) => {
    addSetor(novo);
    setSetoresState([...setores]);
    toast.success(`Setor "${novo}" criado.`);
  };

  return (
    <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-[380px_1fr]">
      <EpiForm
        categorias={categorias}
        funcoes={funcoes}
        setores={setoresState}
        onAdd={handleAdd}
        onCreateCategoria={handleCreateCategoria}
        onCreateFuncao={handleCreateFuncao}
        onCreateSetor={handleCreateSetor}
      />

      <div className="min-w-0 space-y-6">
        {/* Categorias — no mobile fica um carrossel/barra de chips horizontal bem compacto; no desktop fica em grid */}
        {/* Barra de Filtros e Busca Unificada */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border bg-card p-3 shadow-2xs">
          {/* Campo de Busca */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome, CA ou categoria..."
              className="pl-9 h-9 text-xs sm:text-sm"
            />
          </div>

          {/* Filtros de Categoria */}
          <ScrollableFilterBar>
            <button
              type="button"
              onClick={() => setCategoriaAtiva(null)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                categoriaAtiva === null
                  ? "border-primary bg-primary text-primary-foreground shadow-xs"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Todas</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  categoriaAtiva === null
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {lista.length}
              </span>
            </button>
            {categoriasComContagem.map(([categoria, count]) => {
              const Icon = iconeParaEpi(categoria);
              const isSelected = categoriaAtiva === categoria;
              return (
                <button
                  key={categoria}
                  type="button"
                  onClick={() => setCategoriaAtiva(categoria)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-xs"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{categoria}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </ScrollableFilterBar>
        </div>

        <Card>
          <CardHeader className="border-b">
            <div>
              <CardTitle>EPIs cadastrados</CardTitle>
              <CardDescription>{list.length} equipamentos encontrados no catálogo.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>EPI</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Prazo de Validade</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.nome}</TableCell>
                      <TableCell className="text-muted-foreground">{e.categoria}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {e.setores.map((s) => (
                            <Badge key={s} variant="outline" className="border-primary/30 text-primary">{s}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="secondary">{e.funcao}</Badge></TableCell>
                      <TableCell>
                        <span className={e.estoque <= 10 ? "font-semibold text-warning-foreground" : ""}>
                          {e.estoque} un.
                        </span>
                      </TableCell>
                      <TableCell>{formatPrazo(e.validade)}</TableCell>
                      <TableCell className="text-right">
                        <EpiEditDialog
                          epi={e}
                          categorias={categorias}
                          funcoes={funcoes}
                          setores={setoresState}
                          onSave={handleSave}
                          onCreateCategoria={handleCreateCategoria}
                          onCreateFuncao={handleCreateFuncao}
                          onCreateSetor={handleCreateSetor}
                        />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="text-danger hover:text-danger" title="Excluir EPI">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir "{e.nome}"?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza de que deseja excluir este EPI? Essa ação não poderá ser desfeita.
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EpiForm({
  categorias,
  funcoes,
  setores,
  onAdd,
  onCreateCategoria,
  onCreateFuncao,
  onCreateSetor,
}: {
  categorias: string[];
  funcoes: string[];
  setores: string[];
  onAdd: (epi: Omit<Epi, "id">) => void;
  onCreateCategoria: (v: string) => void;
  onCreateFuncao: (v: string) => void;
  onCreateSetor: (v: string) => void;
}) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [validade, setValidade] = useState("1 ano");
  const [funcao, setFuncao] = useState("Todos");
  const [setoresSelecionados, setSetoresSelecionados] = useState<string[]>(["Todos"]);
  const [estoque, setEstoque] = useState("");

  const reset = () => {
    setNome("");
    setCategoria("");
    setValidade("1 ano");
    setFuncao("Todos");
    setSetoresSelecionados(["Todos"]);
    setEstoque("");
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><HardHat className="h-5 w-5 text-primary" /> Cadastrar EPI</CardTitle>
        <CardDescription>Informe os dados do equipamento e o prazo de validade.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (setoresSelecionados.length === 0 || !validade.trim()) return;
            onAdd({
              nome,
              categoria,
              funcao,
              setores: setoresSelecionados,
              validade,
              estoque: Number(estoque) || 0,
            });
            reset();
          }}
        >
          <div className="space-y-1.5">
            <Label>Nome do EPI</Label>
            <Input required placeholder="Ex.: Capacete de segurança" value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <CreatableSelect label="Categoria" value={categoria} onChange={setCategoria} options={categorias} onCreate={onCreateCategoria} required />
          <PrazoSelect value={validade} onChange={setValidade} />
          <CreatableMultiSelect
            label="Setores que usam"
            values={setoresSelecionados}
            onChange={setSetoresSelecionados}
            options={setores}
            onCreate={onCreateSetor}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <CreatableSelect label="Função associada" value={funcao} onChange={setFuncao} options={funcoes} onCreate={onCreateFuncao} />
            <div className="space-y-1.5">
              <Label>Estoque inicial</Label>
              <Input required type="number" min={0} placeholder="0" value={estoque} onChange={(e) => setEstoque(e.target.value)} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={setoresSelecionados.length === 0 || !validade.trim()}>Salvar</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function EpiEditDialog({
  epi,
  categorias,
  funcoes,
  setores,
  onSave,
  onCreateCategoria,
  onCreateFuncao,
  onCreateSetor,
}: {
  epi: Epi;
  categorias: string[];
  funcoes: string[];
  setores: string[];
  onSave: (epi: Epi) => void;
  onCreateCategoria: (v: string) => void;
  onCreateFuncao: (v: string) => void;
  onCreateSetor: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState(epi.nome);
  const [categoria, setCategoria] = useState(epi.categoria);
  const [validade, setValidade] = useState(epi.validade || "1 ano");
  const [funcao, setFuncao] = useState(epi.funcao);
  const [setoresSelecionados, setSetoresSelecionados] = useState<string[]>(epi.setores);
  const [estoque, setEstoque] = useState(String(epi.estoque));

  useEffect(() => {
    if (open) {
      setNome(epi.nome);
      setCategoria(epi.categoria);
      setValidade(epi.validade || "1 ano");
      setFuncao(epi.funcao);
      setSetoresSelecionados(epi.setores);
      setEstoque(String(epi.estoque));
    }
  }, [open, epi]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar EPI</DialogTitle>
          <DialogDescription>Atualize as informações de {epi.nome}.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (setoresSelecionados.length === 0 || !validade.trim()) return;
            onSave({ ...epi, nome, categoria, funcao, setores: setoresSelecionados, validade, estoque: Number(estoque) || 0 });
            setOpen(false);
          }}
        >
          <div className="space-y-1.5">
            <Label>Nome do EPI</Label>
            <Input required value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <CreatableSelect label="Categoria" value={categoria} onChange={setCategoria} options={categorias} onCreate={onCreateCategoria} />
          <PrazoSelect value={validade} onChange={setValidade} />
          <CreatableMultiSelect
            label="Setores que usam"
            values={setoresSelecionados}
            onChange={setSetoresSelecionados}
            options={setores}
            onCreate={onCreateSetor}
          />
          <CreatableSelect label="Função associada" value={funcao} onChange={setFuncao} options={funcoes} onCreate={onCreateFuncao} />
          <div className="space-y-1.5">
            <Label>Estoque</Label>
            <Input required type="number" min={0} value={estoque} onChange={(e) => setEstoque(e.target.value)} />
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={setoresSelecionados.length === 0 || !validade.trim()}>Salvar alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
