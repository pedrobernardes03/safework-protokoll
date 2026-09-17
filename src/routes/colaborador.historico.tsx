import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { CollaboratorShell } from "@/components/safework/CollaboratorShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  MessageSquare,
  Package,
  Calendar,
  Layers,
  X,
} from "lucide-react";
import {
  observacoes,
  entregas,
  logsAuditoria,
  colaboradores,
  MATRICULA_COLABORADOR_ATUAL,
} from "@/lib/safework-data";

export const Route = createFileRoute("/colaborador/historico")({
  head: () => ({ meta: [{ title: "Histórico — SafeWork" }] }),
  component: Historico,
});

type TipoHistorico = "entrega" | "confirmacao" | "observacao";
type PeriodoFiltro = "todos" | "7d" | "30d" | "6m" | "custom";

interface ItemHistorico {
  id: string;
  data: string;
  tipo: TipoHistorico;
  titulo: string;
  detalhe: string;
  epi?: string;
  subtipo?: string;
  status?: string;
}

const tipoLabels: Record<TipoHistorico, string> = {
  confirmacao: "Confirmação",
  observacao: "Observação",
  entrega: "Entrega",
};

const MESES = [
  "JANEIRO",
  "FEVEREIRO",
  "MARÇO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO",
];

const MESES_ABREV = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
];

function parseData(iso: string) {
  const [dataPart] = iso.split("T");
  const [ano, mes, dia] = dataPart.split("-").map(Number);
  return {
    ano,
    mes,
    dia,
    dataObj: new Date(ano, mes - 1, dia),
  };
}

function getGrupoMesAno(iso: string) {
  const { ano, mes } = parseData(iso);
  const nomeMes = MESES[mes - 1] ?? "";
  return `${nomeMes} ${ano}`;
}

function formatDiaMes(iso: string) {
  const { dia, mes } = parseData(iso);
  const diaFmt = String(dia).padStart(2, "0");
  const mesFmt = MESES_ABREV[mes - 1] ?? "";
  return `${diaFmt} ${mesFmt}`;
}

function formatDataCompleta(iso: string) {
  const { dia, mes, ano } = parseData(iso);
  return `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}/${ano}`;
}

function Historico() {
  const colaborador = colaboradores.find((c) => c.matricula === MATRICULA_COLABORADOR_ATUAL);
  const nome = colaborador?.nome ?? "";

  const [tipoAtivo, setTipoAtivo] = useState<string>("todos");
  const [periodoAtivo, setPeriodoAtivo] = useState<PeriodoFiltro>("todos");
  const [dataInicio, setDataInicio] = useState<string>("");
  const [dataFim, setDataFim] = useState<string>("");

  // Monta lista completa de registros
  const todosRegistros = useMemo<ItemHistorico[]>(() => {
    const list: ItemHistorico[] = [
      ...observacoes
        .filter((o) => o.matricula === MATRICULA_COLABORADOR_ATUAL)
        .map((o) => ({
          id: `obs-${o.id}`,
          data: o.data,
          tipo: "observacao" as const,
          titulo: `Observação sobre ${o.epi}`,
          detalhe: o.descricao ? `${o.tipo} — ${o.descricao}` : `${o.tipo} reportado ao gestor`,
          epi: o.epi,
          subtipo: o.tipo,
          status: o.status,
        })),
      ...entregas
        .filter((e) => e.matricula === MATRICULA_COLABORADOR_ATUAL)
        .map((e) => ({
          id: `ent-${e.id}`,
          data: e.dataEntrega,
          tipo: "entrega" as const,
          titulo: `Entrega de ${e.epi}`,
          detalhe: `CA ${e.ca} · Validade até ${formatDataCompleta(e.validade)}`,
          epi: e.epi,
          subtipo: `CA ${e.ca}`,
          status: e.status === "proximo" ? "Próximo da troca" : e.status === "vencido" ? "Vencido" : "Entregue",
        })),
      ...logsAuditoria
        .filter((l) => (l.autor === nome || l.alvo === nome) && l.acao.includes("Confirmou uso"))
        .map((l) => ({
          id: `aud-${l.id}`,
          data: l.data,
          tipo: "confirmacao" as const,
          titulo: "Confirmação de uso de EPIs",
          detalhe: l.detalhe ? `Equipamentos verificados: ${l.detalhe}` : "Uso diário dos EPIs obrigatórios confirmado",
          epi: l.detalhe,
          subtipo: "Em dia",
        })),
    ];

    return list.sort((a, b) => b.data.localeCompare(a.data));
  }, [nome]);

  // Contagens para os botões de tipo
  const contagens = useMemo(() => {
    return {
      todos: todosRegistros.length,
      entrega: todosRegistros.filter((r) => r.tipo === "entrega").length,
      confirmacao: todosRegistros.filter((r) => r.tipo === "confirmacao").length,
      observacao: todosRegistros.filter((r) => r.tipo === "observacao").length,
    };
  }, [todosRegistros]);

  // Filtra por tipo e por período
  const registrosFiltrados = useMemo(() => {
    return todosRegistros.filter((item) => {
      // Filtro por tipo
      if (tipoAtivo !== "todos" && item.tipo !== tipoAtivo) {
        return false;
      }

      // Filtro por período
      if (periodoAtivo === "todos") {
        return true;
      }

      const itemDate = parseData(item.data).dataObj;

      if (periodoAtivo === "custom") {
        if (dataInicio) {
          const dtIni = parseData(dataInicio).dataObj;
          if (itemDate.getTime() < dtIni.getTime()) return false;
        }
        if (dataFim) {
          const dtFim = parseData(dataFim).dataObj;
          if (itemDate.getTime() > dtFim.getTime()) return false;
        }
        return true;
      }

      const hoje = new Date();
      hoje.setHours(23, 59, 59, 999);

      let diasLimite = 0;
      if (periodoAtivo === "7d") diasLimite = 7;
      else if (periodoAtivo === "30d") diasLimite = 30;
      else if (periodoAtivo === "6m") diasLimite = 180;

      const dataLimite = new Date(hoje.getTime() - diasLimite * 24 * 60 * 60 * 1000);
      dataLimite.setHours(0, 0, 0, 0);

      return itemDate.getTime() >= dataLimite.getTime();
    });
  }, [todosRegistros, tipoAtivo, periodoAtivo, dataInicio, dataFim]);

  // Agrupa os registros por Mês/Ano
  const grupos = useMemo(() => {
    const list: { mesAno: string; itens: ItemHistorico[] }[] = [];
    for (const item of registrosFiltrados) {
      const mesAno = getGrupoMesAno(item.data);
      const grupoExistente = list.find((g) => g.mesAno === mesAno);
      if (grupoExistente) {
        grupoExistente.itens.push(item);
      } else {
        list.push({ mesAno, itens: [item] });
      }
    }
    return list;
  }, [registrosFiltrados]);

  const limparFiltros = () => {
    setTipoAtivo("todos");
    setPeriodoAtivo("todos");
    setDataInicio("");
    setDataFim("");
  };

  const temFiltroAtivo = tipoAtivo !== "todos" || periodoAtivo !== "todos" || dataInicio !== "" || dataFim !== "";

  const botoesTipo = [
    { id: "todos", label: "Todos", count: contagens.todos, icon: Layers },
    { id: "entrega", label: "Entregas", count: contagens.entrega, icon: Package },
    { id: "confirmacao", label: "Confirmações", count: contagens.confirmacao, icon: CheckCircle2 },
    { id: "observacao", label: "Observações", count: contagens.observacao, icon: MessageSquare },
  ];

  return (
    <CollaboratorShell back={{ to: "/colaborador/meus-epis", label: "Meus EPIs" }}>
      {/* 1. Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Histórico</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consulte o histórico das suas entregas, confirmações e observações.
        </p>
      </div>

      {/* 2. Área de Filtros Compacta */}
      <section className="mt-6 rounded-2xl border bg-card p-4 shadow-[var(--shadow-card)] space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Filtros por Tipo */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {botoesTipo.map((btn) => {
              const Icon = btn.icon;
              const isSelected = tipoAtivo === btn.id;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setTipoAtivo(btn.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer select-none ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-accent/40 text-muted-foreground hover:bg-accent/80 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{btn.label}</span>
                  <span
                    className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {btn.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filtro por Período */}
          <div className="flex items-center gap-2 shrink-0">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:block" />
            <Select
              value={periodoAtivo}
              onValueChange={(v) => setPeriodoAtivo(v as PeriodoFiltro)}
            >
              <SelectTrigger className="h-8.5 w-full sm:w-[170px] text-xs">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="6m">Últimos 6 meses</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>

            {temFiltroAtivo && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={limparFiltros}
                title="Limpar filtros"
                className="h-8.5 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="mr-1 h-3.5 w-3.5" /> Limpar
              </Button>
            )}
          </div>
        </div>

        {/* Período Personalizado */}
        {periodoAtivo === "custom" && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t text-xs">
            <span className="text-muted-foreground font-medium">De:</span>
            <Input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="h-8 w-auto text-xs"
            />
            <span className="text-muted-foreground font-medium">Até:</span>
            <Input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="h-8 w-auto text-xs"
            />
            {(dataInicio || dataFim) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDataInicio("");
                  setDataFim("");
                }}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Limpar datas
              </Button>
            )}
          </div>
        )}
      </section>

      {/* 3. Linha do Tempo Organizada por Data */}
      {registrosFiltrados.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed p-8 text-center">
          <p className="text-sm font-medium text-foreground">Nenhum registro encontrado</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {temFiltroAtivo
              ? "Tente ajustar ou limpar os filtros de tipo e período."
              : "Confirmações, observações e entregas aparecerão aqui assim que forem registradas."}
          </p>
          {temFiltroAtivo && (
            <Button
              variant="outline"
              size="sm"
              onClick={limparFiltros}
              className="mt-4 text-xs cursor-pointer"
            >
              Restaurar todos os filtros
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {grupos.map((grupo) => (
            <section key={grupo.mesAno} className="space-y-4">
              {/* Marcador do Período (Mês / Ano) */}
              <div className="flex items-center gap-3">
                <span className="rounded-lg border bg-muted/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-foreground">
                  {grupo.mesAno}
                </span>
                <div className="h-px flex-1 bg-border/60" />
                <span className="text-xs text-muted-foreground">
                  {grupo.itens.length} {grupo.itens.length === 1 ? "registro" : "registros"}
                </span>
              </div>

              {/* Linha do tempo vertical do grupo */}
              <div className="space-y-4">
                {grupo.itens.map((h, i) => {
                  const isLast = i === grupo.itens.length - 1;
                  return (
                    <div key={h.id} className="relative flex gap-4 pb-1">
                      {/* Linha vertical contínua */}
                      {!isLast && (
                        <span className="absolute left-5 top-11 h-[calc(100%-0.75rem)] w-px bg-border" />
                      )}

                      {/* Ícone de status na linha do tempo */}
                      <div
                        className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-4 border-background shadow-xs ${
                          h.tipo === "observacao"
                            ? "bg-destructive/15 text-destructive"
                            : h.tipo === "entrega"
                              ? "bg-primary/15 text-primary"
                              : "bg-success/15 text-success"
                        }`}
                      >
                        {h.tipo === "observacao" ? (
                          <MessageSquare className="h-5 w-5" />
                        ) : h.tipo === "entrega" ? (
                          <Package className="h-5 w-5" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5" />
                        )}
                      </div>

                      {/* Card de Detalhes do Registro */}
                      <Card className="flex-1 shadow-[var(--shadow-card)] hover:border-primary/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center rounded-md bg-accent/60 px-2 py-0.5 font-mono text-xs font-bold text-foreground">
                                  {formatDiaMes(h.data)}
                                </span>
                                <p className="font-semibold text-sm text-foreground truncate">
                                  {h.titulo}
                                </p>
                              </div>

                              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                                {h.detalhe}
                              </p>

                              {/* Badges complementares para fácil identificação rápida */}
                              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                                {h.epi && (
                                  <Badge variant="secondary" className="text-[11px] font-normal">
                                    EPI: {h.epi}
                                  </Badge>
                                )}
                                {h.subtipo && h.subtipo !== h.epi && (
                                  <span className="text-[11px] text-muted-foreground font-mono">
                                    {h.subtipo}
                                  </span>
                                )}
                                {h.status && (
                                  <Badge
                                    variant="outline"
                                    className={`text-[10px] ${
                                      h.status === "Vencido"
                                        ? "border-danger/40 text-danger bg-danger/5"
                                        : h.status === "Próximo da troca"
                                          ? "border-warning/40 text-warning-foreground bg-warning/5"
                                          : ""
                                    }`}
                                  >
                                    {h.status}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="self-start sm:self-auto shrink-0">
                              <Badge
                                variant="outline"
                                className={`text-[11px] ${
                                  h.tipo === "observacao"
                                    ? "border-destructive/30 bg-destructive/10 text-destructive"
                                    : h.tipo === "entrega"
                                      ? "border-primary/30 bg-primary/10 text-primary"
                                      : "border-success/30 bg-success/10 text-success"
                                }`}
                              >
                                {tipoLabels[h.tipo]}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </CollaboratorShell>
  );
}

