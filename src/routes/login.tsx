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
      {/* Hero panel — a single full-bleed video, no overlays */}
      <div className="relative hidden overflow-hidden bg-slate-900 lg:block">
        <video
          src="/login-showcase.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
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
