import { useEffect, useState, type ReactNode } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  HardHat,
  Footprints,
  Glasses,
  RefreshCw,
  Send,
  FileClock,
  PackageSearch,
  TriangleAlert,
} from "lucide-react";
import { Mascot } from "./Mascot";

type Step = {
  role: string;
  title: string;
  desc: string;
  render: () => ReactNode;
};

function Pill({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "danger" | "warning" | "success" }) {
  const tones = {
    default: "border-slate-200 text-slate-500",
    danger: "border-danger/30 bg-danger/10 text-danger",
    warning: "border-warning/40 bg-warning/10 text-warning-foreground",
    success: "border-success/30 bg-success/10 text-success",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
      {initials}
    </div>
  );
}

// Cada preview abaixo é uma recriação simplificada (não um clone pixel-a-pixel) das telas
// reais — feita a partir do conteúdo/rótulos de cada rota em src/routes/, já que tirar
// screenshot das telas reais exigiria login (elas ficam atrás do Supabase).
const steps: Step[] = [
  {
    role: "Colaborador",
    title: "Confirma o próprio checklist de EPI",
    desc: "Cada colaborador só vê os equipamentos que a função dele exige — nunca uma lista genérica — e confirma em segundos, direto do celular.",
    render: () => (
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl border bg-white p-3">
          <div className="flex items-center gap-3">
            <Avatar initials="JS" />
            <div>
              <p className="text-sm font-semibold text-slate-800">João Silva</p>
              <p className="text-xs text-slate-400">Soldador · Produção</p>
            </div>
          </div>
          <Pill tone="success"><ShieldCheck className="h-3 w-3" /> Em dia</Pill>
        </div>
        <div className="rounded-xl border bg-white p-3">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">EPIs obrigatórios</span>
            <span className="text-slate-400">3/4 confirmados</span>
          </div>
          <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-3/4 rounded-full bg-primary" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: HardHat, nome: "Capacete", ca: "CA 31.480", ok: true },
              { icon: Glasses, nome: "Óculos", ca: "CA 28.902", ok: true },
              { icon: Footprints, nome: "Botina", ca: "CA 40.115", ok: true },
              { icon: ShieldCheck, nome: "Luva de raspa", ca: "CA 19.774", ok: false },
            ].map((e) => (
              <div key={e.nome} className={`flex items-center gap-2 rounded-lg border p-2 ${e.ok ? "border-success/30 bg-success/5" : "border-slate-200"}`}>
                <e.icon className="h-4 w-4 shrink-0 text-slate-400" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-slate-700">{e.nome}</p>
                  <p className="truncate text-[10px] text-slate-400">{e.ca}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white">
          Concluir confirmação
        </div>
      </div>
    ),
  },
  {
    role: "Gestor",
    title: "Define o que cada colaborador precisa usar",
    desc: "A Segurança do Trabalho escolhe, por pessoa, quais EPIs entram no checklist dela — é isso que alimenta a tela anterior.",
    render: () => (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1.5">
            {["Todos", "Produção", "Almoxarifado"].map((s, i) => (
              <span key={s} className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium ${i === 0 ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-slate-500"}`}>
                {s}
              </span>
            ))}
          </div>
          <Pill tone="warning"><TriangleAlert className="h-3 w-3 shrink-0" /> 1 sem EPI definido</Pill>
        </div>
        <div className="divide-y rounded-xl border bg-white">
          {[
            { initials: "JS", nome: "João Silva", cargo: "Soldador · Produção", epis: ["Capacete", "Botina"] },
            { initials: "MO", nome: "Maria Oliveira", cargo: "Almoxarife · Almoxarifado", epis: ["Luva", "Colete"] },
            { initials: "PC", nome: "Pedro Costa", cargo: "Ajudante · Produção", epis: [] },
          ].map((c) => (
            <div key={c.nome} className="flex flex-wrap items-center gap-3 p-3">
              <Avatar initials={c.initials} />
              <div className="min-w-[120px] flex-1">
                <p className="text-sm font-medium text-slate-800">{c.nome}</p>
                <p className="text-xs text-slate-400">{c.cargo}</p>
              </div>
              <div className="flex flex-1 flex-wrap items-center gap-1.5">
                {c.epis.length === 0 ? (
                  <span className="text-xs font-medium text-warning-foreground">Nenhum EPI definido ainda</span>
                ) : (
                  c.epis.map((e) => <Pill key={e}>{e}</Pill>)
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    role: "Gestor",
    title: "Acompanha o vencimento dos Certificados de Aprovação",
    desc: "Nenhum CA vence de surpresa: o sistema separa o que já venceu, o que está próximo e o que ainda está em dia.",
    render: () => (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-danger/30 bg-danger/5 p-2.5 text-center">
            <p className="text-lg font-extrabold text-danger">2</p>
            <p className="text-[11px] text-danger">Vencidos</p>
          </div>
          <div className="rounded-xl border border-warning/30 bg-warning/10 p-2.5 text-center">
            <p className="text-lg font-extrabold text-warning-foreground">3</p>
            <p className="text-[11px] text-warning-foreground">Próximos</p>
          </div>
          <div className="rounded-xl border border-success/30 bg-success/5 p-2.5 text-center">
            <p className="text-lg font-extrabold text-success">41</p>
            <p className="text-[11px] text-success">Vigentes</p>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { nome: "João Silva", epi: "Luva de raspa · CA 19.774", val: "venceu em 12/08/2026", tone: "danger" as const },
            { nome: "Maria Oliveira", epi: "Máscara PFF2 · CA 33.220", val: "vence em 05/10/2026", tone: "warning" as const },
            { nome: "Pedro Costa", epi: "Capacete · CA 31.480", val: "válido até 03/2027", tone: "success" as const },
          ].map((r) => (
            <div key={r.nome} className={`flex items-center justify-between rounded-lg border-l-4 bg-white p-2.5 text-xs ${r.tone === "danger" ? "border-l-danger" : r.tone === "warning" ? "border-l-warning" : "border-l-success"}`}>
              <div className="min-w-0">
                <p className="font-medium text-slate-700">{r.nome}</p>
                <p className="text-slate-400">{r.epi} · {r.val}</p>
              </div>
              <RefreshCw className="h-3.5 w-3.5 shrink-0 text-slate-300" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    role: "Colaborador → Gestor",
    title: "Observações e ocorrências viram um fluxo, não um recado perdido",
    desc: "O colaborador registra o que aconteceu com um EPI; a Segurança do Trabalho acompanha tudo em um quadro, do pendente ao resolvido.",
    render: () => (
      <div className="grid grid-cols-3 gap-2 text-xs">
        {[
          { titulo: "Pendente", tone: "danger" as const, n: 2, card: { nome: "João Silva", epi: "Luva de raspa", desc: "Costura da luva rasgou durante o turno." } },
          { titulo: "Em análise", tone: "warning" as const, n: 1, card: { nome: "Maria Oliveira", epi: "Máscara PFF2", desc: "Elástico folgado, não veda direito." } },
          { titulo: "Resolvido", tone: "success" as const, n: 4, card: { nome: "Pedro Costa", epi: "Botina", desc: "Sola descolando na ponta." } },
        ].map((col) => (
          <div key={col.titulo} className="rounded-xl border bg-white p-2">
            <div className="mb-2 flex items-center justify-between">
              <Pill tone={col.tone}>{col.titulo}</Pill>
              <span className="text-[10px] text-slate-400">{col.n}</span>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
              <p className="font-medium text-slate-700">{col.card.nome}</p>
              <Pill>{col.card.epi}</Pill>
              <p className="mt-1 line-clamp-2 text-[10px] text-slate-400">{col.card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    role: "Colaborador ↔ Gestor",
    title: "Mensagens diretas com a Segurança do Trabalho",
    desc: "Dúvida sobre um EPI ou uma entrega? A conversa fica registrada no mesmo lugar, sem depender de WhatsApp pessoal.",
    render: () => (
      <div className="flex gap-2 text-xs">
        <div className="w-2/5 divide-y rounded-xl border bg-white">
          {[
            { initials: "JS", nome: "João Silva", prev: "Minha luva rasgou, e agora?" },
            { initials: "MO", nome: "Maria Oliveira", prev: "Obrigada!" },
          ].map((c, i) => (
            <div key={c.nome} className={`flex items-center gap-2 p-2 ${i === 0 ? "bg-primary/5" : ""}`}>
              <Avatar initials={c.initials} />
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-700">{c.nome}</p>
                <p className="truncate text-[10px] text-slate-400">{c.prev}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-1 flex-col justify-between rounded-xl border bg-white p-2.5">
          <div className="space-y-1.5">
            <div className="max-w-[80%] rounded-lg rounded-tl-none bg-slate-100 px-2.5 py-1.5 text-slate-600">
              Minha luva rasgou, e agora?
            </div>
            <div className="ml-auto max-w-[80%] rounded-lg rounded-tr-none bg-primary/10 px-2.5 py-1.5 text-right text-primary">
              Já registrei a troca, retira uma nova no almoxarifado.
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-lg border bg-slate-50 px-2 py-1.5 text-slate-400">
            <span className="flex-1">Escrever mensagem...</span>
            <Send className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    ),
  },
  {
    role: "Gestor",
    title: "Auditoria: rastro completo de quem fez o quê",
    desc: "Toda ação relevante — entrega, aprovação, edição de cadastro — fica registrada com autor, alvo e horário, disponível para consulta a qualquer momento.",
    render: () => (
      <div className="space-y-2.5">
        {[
          { autor: "Ana Souza", acao: "aprovou entrega de EPI para", alvo: "João Silva", quando: "hoje 14:32", tone: "success" as const },
          { autor: "Ana Souza", acao: "renovou o CA de", alvo: "Máscara PFF2", quando: "hoje 11:05", tone: "default" as const },
          { autor: "Carlos Lima", acao: "definiu EPIs obrigatórios de", alvo: "Pedro Costa", quando: "ontem 17:48", tone: "default" as const },
        ].map((e, i) => (
          <div key={i} className="flex items-start gap-2.5 text-xs">
            <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${e.tone === "success" ? "bg-success" : "bg-primary/50"}`} />
            <div className="min-w-0 flex-1 border-b border-slate-100 pb-2.5">
              <p className="text-slate-600">
                <span className="font-medium text-slate-800">{e.autor}</span> {e.acao}{" "}
                <span className="font-medium text-slate-800">{e.alvo}</span>
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400">
                <FileClock className="h-3 w-3" /> {e.quando}
              </p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    role: "Gestor",
    title: "Almoxarifado sempre com o estoque em dia",
    desc: "Toda entrega desconta o estoque na hora. O que está baixo ou em falta aparece primeiro, com sugestão de reposição.",
    render: () => (
      <div className="space-y-3">
        <div className="rounded-xl border bg-white p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">Estoque total</span>
            <span className="text-slate-400">312 unidades</span>
          </div>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[70%] bg-success" />
            <div className="h-full w-[20%] bg-warning" />
            <div className="h-full w-[10%] bg-danger" />
          </div>
        </div>
        <div className="space-y-2">
          {[
            { nome: "Luva de raspa", ca: "CA 19.774", status: "Em falta", tone: "danger" as const, qtd: "0 un." },
            { nome: "Máscara PFF2", ca: "CA 33.220", status: "Estoque baixo", tone: "warning" as const, qtd: "8 un." },
          ].map((it) => (
            <div key={it.nome} className="flex items-center gap-2.5 rounded-lg border bg-white p-2.5 text-xs">
              <PackageSearch className="h-4 w-4 shrink-0 text-slate-400" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-700">{it.nome} <span className="font-normal text-slate-400">· {it.ca}</span></p>
                <p className="text-slate-400">{it.qtd} em estoque</p>
              </div>
              <Pill tone={it.tone}>{it.status}</Pill>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export function HowItWorksOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setStep((s) => Math.min(s + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setStep((s) => Math.max(s - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const current = steps[step];
  const isFirst = step === 0;
  const isLast = step === steps.length - 1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl lg:h-[620px] lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-slate-900/5 text-slate-500 transition-colors hover:bg-slate-900/10"
          aria-label="Fechar"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Boneco guia — só no desktop, onde há espaço pra ele sem brigar com o conteúdo */}
        <div className="relative hidden shrink-0 items-end justify-center overflow-hidden bg-gradient-to-b from-primary/[0.06] to-white pb-4 lg:flex lg:w-[210px]">
          <div className="animate-float">
            <Mascot pointing />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-8 lg:p-10">
          <div key={step} className="animate-in fade-in-0 slide-in-from-right-2 duration-300">
            <Pill>{current.role}</Pill>
            <h3 className="mt-3 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              {current.title}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">{current.desc}</p>

            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
              {current.render()}
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between pt-6">
            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setStep(i)}
                  aria-label={`Ir para a etapa ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-primary" : "w-1.5 bg-slate-200 hover:bg-slate-300"}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(s - 1, 0))}
                disabled={isFirst}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-0"
              >
                <ChevronLeft className="h-4 w-4" /> Voltar
              </button>
              {isLast ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  Concluir
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  Próximo <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
