import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Entrar — SafeWork" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Painel do vídeo — visível em qualquer largura agora, não só lg:. A caixa interna
          usa aspect-video (a proporção nativa do arquivo) então o vídeo nunca é cortado;
          no desktop, onde a coluna estica pra altura cheia da tela, ele fica centralizado
          dentro do painel escuro em vez de esticar/cortar pra preencher tudo. */}
      <div className="relative flex items-center justify-center self-start overflow-hidden bg-slate-900 lg:self-stretch">
        <div className="relative aspect-video w-full">
          <video
            src="/login-showcase.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="absolute left-8 top-8 z-10 flex items-center gap-2 text-primary-foreground drop-shadow-md">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/15 backdrop-blur">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">SafeWork</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 [animation-fill-mode:both]">
            <h2 className="text-2xl font-bold tracking-tight">Bem-vindo de volta</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Acesse com seus dados corporativos.
            </p>
          </div>

          <form
            className="mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:120ms] [animation-fill-mode:both]"
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              setTimeout(() => navigate({ to: "/colaborador/meus-epis" }), 500);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF ou Matrícula</Label>
              <div className="group relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input id="cpf" required placeholder="000.000.000-00" className="pl-9" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <div className="group relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  id="senha"
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <Checkbox id="lembrar" className="rounded-[4px]" />
                Lembrar acesso
              </label>
              <Link to="/esqueci-senha" className="text-primary hover:underline">
                Esqueci minha senha
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>SafeWork v2.4.0</span>
            <span className="text-border">·</span>
            <button
              type="button"
              className="transition-colors hover:text-foreground hover:underline"
              onClick={() => toast.info("Nossa equipe de suporte responde em até 2 horas úteis.")}
            >
              Suporte
            </button>
            <span className="text-border">·</span>
            <button
              type="button"
              className="transition-colors hover:text-foreground hover:underline"
              onClick={() => toast.info("Política de Privacidade disponível em breve.")}
            >
              Política de Privacidade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
