import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Eye, MessageSquareWarning } from "lucide-react";
import { observacoes, type Observacao } from "@/lib/safework-data";
import { useState } from "react";

export const Route = createFileRoute("/gestor/observacoes")({
  head: () => ({ meta: [{ title: "Observações — SafeWork" }] }),
  component: ObservacoesPage,
});

const statusStyle: Record<Observacao["status"], string> = {
  Pendente: "bg-danger/10 text-danger border-danger/30",
  "Em análise": "bg-warning/20 text-warning-foreground border-warning/40",
  Resolvido: "bg-success/10 text-success border-success/30",
};

function ObservacoesPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("todos");

  const filtered = observacoes.filter((o) => {
    const matchesQ =
      o.colaborador.toLowerCase().includes(q.toLowerCase()) ||
      o.epi.toLowerCase().includes(q.toLowerCase()) ||
      o.matricula.includes(q);
    const matchesTab =
      tab === "todos" ||
      (tab === "pendentes" && o.status === "Pendente") ||
      (tab === "analise" && o.status === "Em análise") ||
      (tab === "resolvidos" && o.status === "Resolvido");
    return matchesQ && matchesTab;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Card>
        <CardHeader className="space-y-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por colaborador, matrícula ou EPI..."
              className="pl-9"
            />
          </div>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
              <TabsTrigger value="analise">Em análise</TabsTrigger>
              <TabsTrigger value="resolvidos">Resolvidos</TabsTrigger>
            </TabsList>
            <TabsContent value={tab} className="mt-0" />
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {filtered.length === 0 && (
              <li className="p-8 text-center text-sm text-muted-foreground">
                Nenhuma observação encontrada.
              </li>
            )}
            {filtered.map((o) => (
              <li key={o.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <MessageSquareWarning className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{o.colaborador}</p>
                    <span className="text-xs text-muted-foreground">Mat. {o.matricula}</span>
                    <Badge variant="secondary">{o.epi}</Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{o.descricao}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(o.data).toLocaleDateString("pt-BR")} · {o.id}
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <Badge variant="outline" className={statusStyle[o.status]}>
                    {o.status}
                  </Badge>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/gestor/observacoes/$id" params={{ id: o.id }}>
                      <Eye className="mr-1.5 h-4 w-4" /> Visualizar
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
