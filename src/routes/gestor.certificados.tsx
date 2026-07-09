import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, AlertCircle, Clock, ShieldCheck } from "lucide-react";
import { entregas, dashboardStats, type EpiStatus } from "@/lib/safework-data";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/gestor/certificados")({
  head: () => ({ meta: [{ title: "Monitoramento de CAs — SafeWork" }] }),
  component: CertificadosPage,
});

const statusMap: Record<EpiStatus, { label: string; className: string; dot: string }> = {
  vencido: { label: "Vencido", className: "bg-danger/10 text-danger border-danger/30", dot: "bg-danger" },
  proximo: { label: "Próximo do vencimento", className: "bg-warning/20 text-warning-foreground border-warning/40", dot: "bg-warning" },
  vigente: { label: "Vigente", className: "bg-success/10 text-success border-success/30", dot: "bg-success" },
};

function CertificadosPage() {
  const [q, setQ] = useState("");
  const list = entregas.filter((e) => {
    const s = q.toLowerCase();
    return (
      e.colaborador.toLowerCase().includes(s) ||
      e.matricula.includes(s) ||
      e.epi.toLowerCase().includes(s)
    );
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <IndicatorCard
          icon={AlertCircle}
          label="CAs vencidos"
          value={dashboardStats.vencidos}
          tone="danger"
          desc="Substituição imediata"
        />
        <IndicatorCard
          icon={Clock}
          label="Próximos do vencimento"
          value={dashboardStats.proximos}
          tone="warning"
          desc="Renovar em até 30 dias"
        />
        <IndicatorCard
          icon={ShieldCheck}
          label="CAs vigentes"
          value={dashboardStats.vigentes}
          tone="success"
          desc="Em conformidade"
        />
      </section>

      <Card>
        <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b sm:flex sm:justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="mb-3">Entregas e certificados</CardTitle>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por colaborador, matrícula ou EPI..."
                className="pl-9"
              />
            </div>
          </div>
          <Button className="shrink-0" onClick={() => toast.success("Formulário de nova entrega aberto.")}>
            <Plus className="mr-2 h-4 w-4" /> Registrar nova entrega
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>EPI</TableHead>
                  <TableHead>CA</TableHead>
                  <TableHead>Entrega</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((e) => {
                  const s = statusMap[e.status];
                  return (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.colaborador}</TableCell>
                      <TableCell className="font-mono text-sm">{e.matricula}</TableCell>
                      <TableCell className="text-muted-foreground">{e.cargo}</TableCell>
                      <TableCell>{e.epi}</TableCell>
                      <TableCell className="font-mono text-sm">{e.ca}</TableCell>
                      <TableCell>{new Date(e.dataEntrega).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{new Date(e.validade).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={s.className}>
                          <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </Badge>
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
}: {
  icon: typeof AlertCircle;
  label: string;
  value: number;
  tone: "danger" | "warning" | "success";
  desc: string;
}) {
  const tones = {
    danger: { chip: "bg-danger/10 text-danger", ring: "ring-danger/20" },
    warning: { chip: "bg-warning/20 text-warning-foreground", ring: "ring-warning/30" },
    success: { chip: "bg-success/10 text-success", ring: "ring-success/20" },
  };
  return (
    <Card className={`ring-1 ${tones[tone].ring}`}>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`grid h-12 w-12 place-items-center rounded-xl ${tones[tone].chip}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}
