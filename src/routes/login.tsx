import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ShieldCheck,
  Lock,
  User,
  HardHat,
  Glasses,
  Hand,
  Shirt,
  Clock,
  CheckCircle2,
  Users,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
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

const ppeChips = [
  { icon: HardHat, label: "Capacete", className: "-top-4 left-0 animate-float", delay: "0s" },
  { icon: Glasses, label: "Óculos", className: "top-2 -right-6 animate-float-slow", delay: "0.5s" },
  { icon: Hand, label: "Luvas", className: "bottom-6 -left-8 animate-float-slow", delay: "1s" },
  { icon: Shirt, label: "Colete", className: "-bottom-4 right-2 animate-float", delay: "1.4s" },
] as const;

const stats = [
  { icon: Users, value: "2.400+", label: "colaboradores protegidos" },
  { icon: CheckCircle2, value: "98%", label: "conformidade média" },
  { icon: Clock, value: "<2min", label: "tempo médio de resposta" },
] as const;

function GoogleIcon() {
  return (
    <svg viewBox="0 0 18 18" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 21 21" className="h-4 w-4">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Hero panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[oklch(0.3_0.08_304)] via-primary to-[oklch(0.62_0.19_298)] lg:block">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-blob" />
        <div
          className="absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-[oklch(0.7_0.16_220)]/20 blur-3xl animate-blob"
          style={{ animationDelay: "4s" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(1_0_0/0.12),transparent_50%),radial-gradient(circle_at_80%_85%,oklch(1_0_0/0.08),transparent_50%)]" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-700">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-foreground/15 backdrop-blur">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">SafeWork</span>
          </div>

          <div className="relative mx-auto flex h-64 w-64 items-center justify-center">
            <div className="absolute h-52 w-52 rounded-full bg-white/10 animate-glow-pulse" />
            <div className="absolute h-36 w-36 rounded-full border border-white/20" />
            <div className="relative z-10 grid h-20 w-20 place-items-center rounded-full border border-white/25 bg-white/15 shadow-xl backdrop-blur-md">
              <ShieldCheck className="h-9 w-9" />
            </div>

            {ppeChips.map(({ icon: Icon, label, className, delay }) => (
              <div
                key={label}
                className={`absolute inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium shadow-lg backdrop-blur-md ${className}`}
                style={{ animationDelay: delay }}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
            ))}
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:150ms] [animation-fill-mode:both]">
            <h1 className="text-4xl font-bold leading-tight">
              Segurança começa com informação em tempo real.
            </h1>
            <p className="mt-4 max-w-md text-primary-foreground/80">
              A plataforma completa para gestão de EPIs, controle de Certificados de Aprovação e
              comunicação com o time.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {stats.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 backdrop-blur-md"
                >
                  <Icon className="h-4 w-4 text-primary-foreground/80" />
                  <div className="leading-tight">
                    <p className="text-sm font-semibold">{value}</p>
                    <p className="text-[11px] text-primary-foreground/70">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-primary-foreground/70">© 2026 SafeWork Corp.</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">SafeWork</span>
          </div>

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

            <div className="relative flex items-center py-1">
              <div className="h-px flex-1 bg-border" />
              <span className="px-3 text-xs text-muted-foreground">ou continue com</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="transition-transform hover:-translate-y-0.5 hover:shadow-md"
                onClick={() =>
                  toast.info("Login corporativo com Microsoft será habilitado pelo TI da sua empresa.")
                }
              >
                <MicrosoftIcon /> Microsoft
              </Button>
              <Button
                type="button"
                variant="outline"
                className="transition-transform hover:-translate-y-0.5 hover:shadow-md"
                onClick={() =>
                  toast.info("Login corporativo com Google será habilitado pelo TI da sua empresa.")
                }
              >
                <GoogleIcon /> Google
              </Button>
            </div>
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
