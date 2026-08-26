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
  const [setoresState, setSetoresState] = useState<string[]>(() => [...setores]);
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
                    <TableHead>Setor</TableHead>
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
                      <TableCell>{new Date(e.validade).toLocaleDateString("pt-BR")}</TableCell>
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
  const [ca, setCa] = useState("");
  const [validade, setValidade] = useState("");
  const [funcao, setFuncao] = useState("Todos");
  const [setoresSelecionados, setSetoresSelecionados] = useState<string[]>(["Todos"]);
  const [estoque, setEstoque] = useState("");

  const reset = () => {
    setNome("");
    setCategoria("");
    setCa("");
    setValidade("");
    setFuncao("Todos");
    setSetoresSelecionados(["Todos"]);
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
            if (setoresSelecionados.length === 0) return;
            onAdd({
              nome,
              categoria,
              ca,
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
          <Button type="submit" className="w-full" disabled={setoresSelecionados.length === 0}>Salvar</Button>
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
  const [ca, setCa] = useState(epi.ca);
  const [validade, setValidade] = useState(epi.validade);
  const [funcao, setFuncao] = useState(epi.funcao);
  const [setoresSelecionados, setSetoresSelecionados] = useState<string[]>(epi.setores);
  const [estoque, setEstoque] = useState(String(epi.estoque));

  useEffect(() => {
    if (open) {
      setNome(epi.nome);
      setCategoria(epi.categoria);
      setCa(epi.ca);
      setValidade(epi.validade);
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
            if (setoresSelecionados.length === 0) return;
            onSave({ ...epi, nome, categoria, ca, funcao, setores: setoresSelecionados, validade, estoque: Number(estoque) || 0 });
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
            <Button type="submit" disabled={setoresSelecionados.length === 0}>Salvar alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
