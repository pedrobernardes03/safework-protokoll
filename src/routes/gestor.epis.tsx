import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { HardHat } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/gestor/epis")({
  head: () => ({ meta: [{ title: "Cadastro de EPIs — SafeWork" }] }),
  component: EpisPage,
});

const epis = [
  { id: 1, nome: "Capacete de segurança", categoria: "Proteção da cabeça", ca: "12345", funcao: "Todos", validade: "2027-08-15" },
  { id: 2, nome: "Óculos de proteção", categoria: "Proteção visual", ca: "22987", funcao: "Todos", validade: "2027-11-02" },
  { id: 3, nome: "Luvas isolantes", categoria: "Proteção das mãos", ca: "31402", funcao: "Eletricista", validade: "2026-03-20" },
  { id: 4, nome: "Botina de segurança", categoria: "Proteção dos pés", ca: "40551", funcao: "Todos", validade: "2027-01-10" },
  { id: 5, nome: "Máscara de solda", categoria: "Proteção facial", ca: "50213", funcao: "Soldador", validade: "2026-05-18" },
];

function EpisPage() {
  return (
    <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-[380px_1fr]">
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
              toast.success("EPI cadastrado com sucesso.");
            }}
          >
            <div className="space-y-1.5">
              <Label>Nome do EPI</Label>
              <Input required placeholder="Ex.: Capacete de segurança" />
            </div>
            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cabeca">Proteção da cabeça</SelectItem>
                  <SelectItem value="visual">Proteção visual</SelectItem>
                  <SelectItem value="maos">Proteção das mãos</SelectItem>
                  <SelectItem value="pes">Proteção dos pés</SelectItem>
                  <SelectItem value="facial">Proteção facial</SelectItem>
                  <SelectItem value="auditiva">Proteção auditiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Número do CA</Label>
                <Input required placeholder="12345" />
              </div>
              <div className="space-y-1.5">
                <Label>Validade do CA</Label>
                <Input required type="date" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Função associada</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="eletricista">Eletricista</SelectItem>
                  <SelectItem value="soldador">Soldador</SelectItem>
                  <SelectItem value="operador">Operador de máquina</SelectItem>
                  <SelectItem value="ajudante">Ajudante geral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Salvar</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>EPIs cadastrados</CardTitle>
          <CardDescription>{epis.length} equipamentos no catálogo.</CardDescription>
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
                  <TableHead>Validade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {epis.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.nome}</TableCell>
                    <TableCell className="text-muted-foreground">{e.categoria}</TableCell>
                    <TableCell className="font-mono text-sm">{e.ca}</TableCell>
                    <TableCell><Badge variant="secondary">{e.funcao}</Badge></TableCell>
                    <TableCell>{new Date(e.validade).toLocaleDateString("pt-BR")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
