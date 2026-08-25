import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { HardHat, Search, Pencil, Trash2, Layers, Plus } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import {
  epis as episIniciais,
  categoriasEpi,
  funcoesEpi,
  iconeParaEpi,
  addEpi,
  updateEpi,
  removeEpi,
  addCategoriaEpi,
  addFuncaoEpi,
  type Epi,
} from "@/lib/safework-data";

export const Route = createFileRoute("/gestor/epis")({
  head: () => ({ meta: [{ title: "Cadastro de EPIs — SafeWork" }] }),
  component: EpisPage,
});

function EpisPage() {
  const [lista, setLista] = useState<Epi[]>(() => [...episIniciais]);
  const [categorias, setCategorias] = useState<string[]>(() => [...categoriasEpi]);
  const [funcoes, setFuncoes] = useState<string[]>(() => [...funcoesEpi]);
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

  // Toda mutação passa pelo catálogo compartilhado (safework-data.ts) — é o que faz o
  // colaborador ver, na hora, um EPI novo cadastrado aqui quando o gestor o atribuir a ele.
  const handleAdd = (novo: Omit<Epi, "id">) => {
    const criado = addEpi(novo);
    setLista([...episIniciais]);
    toast.success(`"${criado.nome}" cadastrado com sucesso.`);
  };

  const handleSave = (atualizado: Epi) => {
    updateEpi(atualizado);
    setLista([...episIniciais]);
    toast.success("EPI atualizado com sucesso.");
  };

  const handleDelete = (id: string) => {
    removeEpi(id);
    setLista([...episIniciais]);
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

  return (
    <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-[380px_1fr]">
      <EpiForm categorias={categorias} funcoes={funcoes} onAdd={handleAdd} onCreateCategoria={handleCreateCategoria} onCreateFuncao={handleCreateFuncao} />

      <div className="min-w-0 space-y-6">
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
                {(() => { const Icon = iconeParaEpi(categoria); return <Icon className="h-4 w-4" />; })()}
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
                        <EpiEditDialog epi={e} categorias={categorias} funcoes={funcoes} onSave={handleSave} onCreateCategoria={handleCreateCategoria} onCreateFuncao={handleCreateFuncao} />
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

// Select com opção de criar um novo valor na hora — evita ter que sair do formulário
// pra cadastrar uma categoria ou função associada que ainda não existe na lista.
function CreatableSelect({
  label,
  value,
  onChange,
  options,
  onCreate,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  onCreate: (novo: string) => void;
  required?: boolean;
}) {
  const [criando, setCriando] = useState(false);
  const [novo, setNovo] = useState("");

  if (criando) {
    return (
      <div className="space-y-1.5">
        <Label>{label}</Label>
        <div className="flex gap-2">
          <Input
            autoFocus
            value={novo}
            onChange={(e) => setNovo(e.target.value)}
            placeholder={`Nova ${label.toLowerCase()}`}
            onKeyDown={(e) => {
              if (e.key === "Escape") { setCriando(false); setNovo(""); }
            }}
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            title="Cancelar"
            onClick={() => { setCriando(false); setNovo(""); }}
          >
            ×
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!novo.trim()}
            onClick={() => {
              const v = novo.trim();
              if (!v) return;
              onCreate(v);
              onChange(v);
              setNovo("");
              setCriando(false);
            }}
          >
            Adicionar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select
        required={required}
        value={value}
        onValueChange={(v) => {
          if (v === "__nova__") {
            setCriando(true);
            return;
          }
          onChange(v);
        }}
      >
        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>{o}</SelectItem>
          ))}
          <SelectItem value="__nova__" className="font-semibold text-primary">
            <span className="flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" /> Criar nova...</span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function EpiForm({
  categorias,
  funcoes,
  onAdd,
  onCreateCategoria,
  onCreateFuncao,
}: {
  categorias: string[];
  funcoes: string[];
  onAdd: (epi: Omit<Epi, "id">) => void;
  onCreateCategoria: (v: string) => void;
  onCreateFuncao: (v: string) => void;
}) {
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
          <CreatableSelect label="Categoria" value={categoria} onChange={setCategoria} options={categorias} onCreate={onCreateCategoria} required />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Número do CA</Label>
              <Input required placeholder="12345" value={ca} onChange={(e) => setCa(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Validade do CA</Label>
              <Input required type="date" value={validade} onChange={(e) => setValidade(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <CreatableSelect label="Função associada" value={funcao} onChange={setFuncao} options={funcoes} onCreate={onCreateFuncao} />
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

function EpiEditDialog({
  epi,
  categorias,
  funcoes,
  onSave,
  onCreateCategoria,
  onCreateFuncao,
}: {
  epi: Epi;
  categorias: string[];
  funcoes: string[];
  onSave: (epi: Epi) => void;
  onCreateCategoria: (v: string) => void;
  onCreateFuncao: (v: string) => void;
}) {
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
          <CreatableSelect label="Categoria" value={categoria} onChange={setCategoria} options={categorias} onCreate={onCreateCategoria} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Número do CA</Label>
              <Input required value={ca} onChange={(e) => setCa(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Validade do CA</Label>
              <Input required type="date" value={validade} onChange={(e) => setValidade(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <CreatableSelect label="Função associada" value={funcao} onChange={setFuncao} options={funcoes} onCreate={onCreateFuncao} />
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
