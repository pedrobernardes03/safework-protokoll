import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { colaboradores } from "@/lib/safework-data";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/gestor/colaboradores")({
  head: () => ({ meta: [{ title: "Colaboradores — SafeWork" }] }),
  component: ColaboradoresPage,
});

function ColaboradoresPage() {
  const [q, setQ] = useState("");
  const list = colaboradores.filter(
    (c) => c.nome.toLowerCase().includes(q.toLowerCase()) || c.matricula.includes(q),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-2xl font-bold tracking-tight">Colaboradores</h2>
          <p className="text-sm text-muted-foreground">Cadastre e gerencie sua equipe.</p>
        </div>
        <NewColaboradorDialog />
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome ou matrícula..."
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {c.nome.split(" ").slice(0,2).map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{c.nome}</p>
                          <p className="truncate text-xs text-muted-foreground">{c.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{c.matricula}</TableCell>
                    <TableCell>{c.cargo}</TableCell>
                    <TableCell>{c.setor}</TableCell>
                    <TableCell>
                      <Badge variant={c.perfil === "Gestor" ? "default" : "secondary"}>
                        {c.perfil}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <EditColaboradorDialog colaborador={c} />
                      <Button size="icon" variant="ghost" className="text-danger hover:text-danger">
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
  );
}

function NewColaboradorDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shrink-0"><Plus className="mr-2 h-4 w-4" /> Novo colaborador</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cadastrar colaborador</DialogTitle>
          <DialogDescription>Preencha os dados para adicionar um novo colaborador.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Colaborador cadastrado com sucesso.");
            setOpen(false);
          }}
        >
          <Field label="Nome completo"><Input required /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="CPF"><Input required placeholder="000.000.000-00" /></Field>
            <Field label="Matrícula"><Input required /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cargo"><Input required /></Field>
            <Field label="Setor"><Input required /></Field>
          </div>
          <Field label="E-mail corporativo"><Input required type="email" /></Field>
          <Field label="Perfil de acesso">
            <Select defaultValue="Colaborador">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Colaborador">Colaborador</SelectItem>
                <SelectItem value="Gestor">Gestor</SelectItem>
                <SelectItem value="Administrador">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Cadastrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditColaboradorDialog({ colaborador }: { colaborador: import("@/lib/safework-data").Colaborador }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar colaborador</DialogTitle>
          <DialogDescription>Atualize as informações de {colaborador.nome}.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Dados do colaborador atualizados.");
            setOpen(false);
          }}
        >
          <Field label="Nome completo"><Input required defaultValue={colaborador.nome} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="CPF"><Input required defaultValue={colaborador.cpf} /></Field>
            <Field label="Matrícula"><Input required defaultValue={colaborador.matricula} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cargo"><Input required defaultValue={colaborador.cargo} /></Field>
            <Field label="Setor"><Input required defaultValue={colaborador.setor} /></Field>
          </div>
          <Field label="E-mail corporativo"><Input required type="email" defaultValue={colaborador.email} /></Field>
          <Field label="Perfil de acesso">
            <Select defaultValue={colaborador.perfil}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Colaborador">Colaborador</SelectItem>
                <SelectItem value="Gestor">Gestor</SelectItem>
                <SelectItem value="Administrador">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar alterações</Button>
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
