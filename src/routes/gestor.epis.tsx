import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { HardHat, Search, Pencil, Trash2, Layers } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/gestor/epis")({
  head: () => ({ meta: [{ title: "Cadastro de EPIs — SafeWork" }] }),
  component: EpisPage,
});

interface Epi {
  id: string;
  nome: string;
  categoria: string;
  ca: string;
  funcao: string;
  validade: string;
  estoque: number;
}

const categorias = [
  { value: "Proteção da cabeça", label: "Proteção da cabeça" },
  { value: "Proteção visual", label: "Proteção visual" },
  { value: "Proteção das mãos", label: "Proteção das mãos" },
  { value: "Proteção dos pés", label: "Proteção dos pés" },
  { value: "Proteção facial", label: "Proteção facial" },
  { value: "Proteção auditiva", label: "Proteção auditiva" },
];

const funcoes = [
  { value: "Todos", label: "Todas" },
  { value: "Eletricista", label: "Eletricista" },
  { value: "Soldador", label: "Soldador" },
  { value: "Operador de máquina", label: "Operador de máquina" },
  { value: "Ajudante geral", label: "Ajudante geral" },
];

const episIniciais: Epi[] = [
  { id: "1", nome: "Capacete de segurança", categoria: "Proteção da cabeça", ca: "12345", funcao: "Todos", validade: "2027-08-15", estoque: 42 },
  { id: "2", nome: "Óculos de proteção", categoria: "Proteção visual", ca: "22987", funcao: "Todos", validade: "2027-11-02", estoque: 58 },
  { id: "3", nome: "Luvas isolantes", categoria: "Proteção das mãos", ca: "31402", funcao: "Eletricista", validade: "2026-03-20", estoque: 15 },
  { id: "4", nome: "Botina de segurança", categoria: "Proteção dos pés", ca: "40551", funcao: "Todos", validade: "2027-01-10", estoque: 30 },
  { id: "5", nome: "Máscara de solda", categoria: "Proteção facial", ca: "50213", funcao: "Soldador", validade: "2026-05-18", estoque: 8 },
];

function EpisPage() {
  const [lista, setLista] = useState<Epi[]>(episIniciais);
  const [q, setQ] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);

  const categoriasComContagem = useMemo(() => {
    const counts = new Map<string, number>();
    lista.forEach((e) => counts.set(e.categoria, (counts.get(e.categoria) ?? 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [lista]);

  const list = lista.filter(
    (e) =>
      (e.nome.toLowerCase().includes(q.toLowerCase()) || e.ca.includes(q)) &&
      (!categoriaAtiva || e.categoria === categoriaAtiva),
  );

  const handleAdd = (novo: Epi) => {
    setLista((prev) => [novo, ...prev]);
    toast.success("EPI cadastrado com sucesso.");
  };

  const handleSave = (atualizado: Epi) => {
    setLista((prev) => prev.map((e) => (e.id === atualizado.id ? atualizado : e)));
    toast.success("EPI atualizado com sucesso.");
  };

  const handleDelete = (id: string) => {
    setLista((prev) => prev.filter((e) => e.id !== id));
    toast.success("EPI removido do catálogo.");
  };

  return (
    <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-[380px_1fr]">
      <EpiForm onAdd={handleAdd} />

      <div className="space-y-6">
        {/* Categorias — clicar filtra o catálogo abaixo para aquela categoria específica */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setCategoriaAtiva(null)}
            className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${
              categoriaAtiva === null ? "border-primary bg-primary/5" : "hover:border-primary/30"
            }`}
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Layers className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-snug">Todas</p>
              <p className="text-xs text-muted-foreground">{lista.length} equipamentos</p>
            </div>
          </button>
          {categoriasComContagem.map(([categoria, count]) => (
            <button
              key={categoria}
              type="button"
              onClick={() => setCategoriaAtiva(categoria)}
              className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                categoriaAtiva === categoria ? "border-primary bg-primary/5" : "hover:border-primary/30"
              }`}
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <HardHat className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-snug">{categoria}</p>
                <p className="text-xs text-muted-foreground">{count} equipamento{count > 1 ? "s" : ""}</p>
              </div>
            </button>
          ))}
        </div>

        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>EPIs cadastrados</CardTitle>
                <CardDescription>{lista.length} equipamentos no catálogo.</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full max-w-[220px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou CA..." className="pl-9" />
                </div>
                {categoriaAtiva && (
                  <Badge variant="outline" className="gap-1.5 border-primary/30 text-primary">
                    {categoriaAtiva}
                    <button type="button" onClick={() => setCategoriaAtiva(null)} className="font-bold" aria-label="Limpar filtro de categoria">
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>EPI</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>CA</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.nome}</TableCell>
                      <TableCell className="text-muted-foreground">{e.categoria}</TableCell>
                      <TableCell className="font-mono text-sm">{e.ca}</TableCell>
                      <TableCell><Badge variant="secondary">{e.funcao}</Badge></TableCell>
                      <TableCell>
                        <span className={e.estoque <= 10 ? "font-semibold text-warning-foreground" : ""}>
                          {e.estoque} un.
                        </span>
                      </TableCell>
                      <TableCell>{new Date(e.validade).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell className="text-right">
                        <EpiEditDialog epi={e} onSave={handleSave} />
                        <Button size="icon" variant="ghost" className="text-danger hover:text-danger" onClick={() => handleDelete(e.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

function EpiForm({ onAdd }: { onAdd: (epi: Epi) => void }) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ca, setCa] = useState("");
  const [validade, setValidade] = useState("");
  const [funcao, setFuncao] = useState("Todos");
  const [estoque, setEstoque] = useState("");

  const reset = () => {
    setNome("");
    setCategoria("");
    setCa("");
    setValidade("");
    setFuncao("Todos");
    setEstoque("");
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><HardHat className="h-5 w-5 text-primary" /> Cadastrar EPI</CardTitle>
        <CardDescription>Informe os dados do equipamento e do CA.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onAdd({
              id: Math.random().toString(36).slice(2),
              nome,
              categoria,
              ca,
              funcao,
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
          <div className="space-y-1.5">
            <Label>Categoria</Label>
            <Select required value={categoria} onValueChange={setCategoria}>
              <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                {categorias.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Número do CA</Label>
              <Input required placeholder="12345" value={ca} onChange={(e) => setCa(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Validade do CA</Label>
              <Input required type="date" value={validade} onChange={(e) => setValidade(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Função associada</Label>
              <Select value={funcao} onValueChange={setFuncao}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {funcoes.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Estoque inicial</Label>
              <Input required type="number" min={0} placeholder="0" value={estoque} onChange={(e) => setEstoque(e.target.value)} />
            </div>
          </div>
          <Button type="submit" className="w-full">Salvar</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function EpiEditDialog({ epi, onSave }: { epi: Epi; onSave: (epi: Epi) => void }) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState(epi.nome);
  const [categoria, setCategoria] = useState(epi.categoria);
  const [ca, setCa] = useState(epi.ca);
  const [validade, setValidade] = useState(epi.validade);
  const [funcao, setFuncao] = useState(epi.funcao);
  const [estoque, setEstoque] = useState(String(epi.estoque));

  useEffect(() => {
    if (open) {
      setNome(epi.nome);
      setCategoria(epi.categoria);
      setCa(epi.ca);
      setValidade(epi.validade);
      setFuncao(epi.funcao);
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
            onSave({ ...epi, nome, categoria, ca, funcao, validade, estoque: Number(estoque) || 0 });
            setOpen(false);
          }}
        >
          <div className="space-y-1.5">
            <Label>Nome do EPI</Label>
            <Input required value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Categoria</Label>
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categorias.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Número do CA</Label>
              <Input required value={ca} onChange={(e) => setCa(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Validade do CA</Label>
              <Input required type="date" value={validade} onChange={(e) => setValidade(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Função associada</Label>
              <Select value={funcao} onValueChange={setFuncao}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {funcoes.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Estoque</Label>
              <Input required type="number" min={0} value={estoque} onChange={(e) => setEstoque(e.target.value)} />
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
