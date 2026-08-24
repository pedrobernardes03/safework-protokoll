import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  UserPlus,
  MessageSquareWarning,
  MessageCircle,
  Check,
  X,
  Inbox,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  useNotifications,
  type Notificacao,
  type TipoNotificacao,
} from "@/hooks/useNotifications";

const iconMap: Record<TipoNotificacao, { icon: typeof AlertTriangle; className: string }> = {
  ca_vencido: { icon: AlertTriangle, className: "bg-danger/10 text-danger" },
  ca_proximo: { icon: Clock, className: "bg-warning/20 text-warning-foreground" },
  epi_entregue: { icon: CheckCircle2, className: "bg-success/10 text-success" },
  novo_colaborador: { icon: UserPlus, className: "bg-primary/10 text-primary" },
  nova_observacao: { icon: MessageSquareWarning, className: "bg-warning/20 text-warning-foreground" },
  nova_mensagem: { icon: MessageCircle, className: "bg-primary/10 text-primary" },
};

const prioridadeMap = {
  alta: "bg-danger/10 text-danger border-danger/30",
  media: "bg-warning/20 text-warning-foreground border-warning/40",
  baixa: "bg-muted text-muted-foreground border-border",
};

export function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"todas" | "nao_lidas">("todas");
  const navigate = useNavigate();

  const {
    notificacoes,
    naoLidasCount,
    badgeTexto,
    marcarComoLida,
    marcarTodasComoLidas,
    excluirNotificacao,
    limparTodas,
  } = useNotifications();

  const listaFiltrada = notificacoes.filter((n) => (tab === "nao_lidas" ? !n.lida : true));

  const handleItemClick = (n: Notificacao) => {
    if (!n.lida) {
      marcarComoLida(n.id);
    }
    if (n.link) {
      navigate({ to: n.link as any });
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="relative h-9 w-9 rounded-full">
          <Bell className="h-4 w-4" />
          {naoLidasCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-danger-foreground animate-in zoom-in-50">
              {badgeTexto}
            </span>
          )}
          <span className="sr-only">Notificações</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 p-0 sm:w-[400px] shadow-lg rounded-xl border border-border"
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b p-3 px-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold tracking-tight">Notificações</h3>
            {naoLidasCount > 0 ? (
              <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] font-semibold">
                {naoLidasCount} não lida{naoLidasCount > 1 ? "s" : ""}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                Tudo em dia
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {naoLidasCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                onClick={() => {
                  marcarTodasComoLidas();
                  toast.success("Todas as notificações foram marcadas como lidas.");
                }}
                title="Marcar todas como lidas"
              >
                <CheckCheck className="mr-1 h-3.5 w-3.5 text-primary" />
                Lera todas
              </Button>
            )}
            {notificacoes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-[11px] text-muted-foreground hover:text-danger"
                onClick={() => {
                  limparTodas();
                  toast.info("Todas as notificações foram removidas.");
                }}
                title="Limpar todas as notificações"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Filtros em Abas */}
        {notificacoes.length > 0 && (
          <div className="border-b px-4 py-2 bg-muted/20">
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
              <TabsList className="h-7 w-full grid grid-cols-2 p-0.5 bg-muted/60">
                <TabsTrigger value="todas" className="text-[11px] py-1">
                  Todas ({notificacoes.length})
                </TabsTrigger>
                <TabsTrigger value="nao_lidas" className="text-[11px] py-1">
                  Não lidas ({naoLidasCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Lista de Notificações */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-border/60">
          {listaFiltrada.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground mb-2">
                <Inbox className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold text-foreground">Nenhuma notificação encontrada</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {tab === "nao_lidas" ? "Você leu todas as notificações." : "Você está em dia com os alertas do sistema."}
              </p>
            </div>
          ) : (
            listaFiltrada.map((n) => {
              const IconComp = iconMap[n.tipo].icon;
              const iconStyle = iconMap[n.tipo].className;

              return (
                <div
                  key={n.id}
                  onClick={() => handleItemClick(n)}
                  className={`group relative flex items-start gap-3 p-3.5 transition cursor-pointer hover:bg-accent/40 ${
                    !n.lida ? "bg-primary/5" : "bg-card"
                  }`}
                >
                  {/* Ponto indicador de não lida */}
                  {!n.lida && (
                    <span className="absolute left-1.5 top-5 h-2 w-2 rounded-full bg-primary animate-pulse" />
                  )}

                  {/* Ícone da notificação */}
                  <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs ${iconStyle}`}>
                    <IconComp className="h-4 w-4" />
                  </div>

                  {/* Conteúdo */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-semibold truncate ${!n.lida ? "text-foreground font-bold" : "text-foreground/90"}`}>
                        {n.titulo}
                      </p>
                      <Badge variant="outline" className={`text-[9px] py-0 px-1 uppercase shrink-0 ${prioridadeMap[n.prioridade]}`}>
                        {n.prioridade}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">
                      {n.descricao}
                    </p>

                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{n.dataHora}</span>
                      {n.link && (
                        <span className="text-primary font-medium group-hover:underline">
                          Acessar →
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Botões de Ação Rápida */}
                  <div
                    className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {!n.lida && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-primary"
                        onClick={() => marcarComoLida(n.id)}
                        title="Marcar como lida"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-danger"
                      onClick={() => excluirNotificacao(n.id)}
                      title="Excluir notificação"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
