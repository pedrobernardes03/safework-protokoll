import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, ArrowLeft, CheckCircle2, Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export const Route = createFileRoute("/esqueci-senha")({
  head: () => ({ meta: [{ title: "Recuperar senha — SafeWork" }] }),
  component: ForgotPage,
});

type Step = "identify" | "code" | "new-password" | "success";

function ForgotPage() {
  const [step, setStep] = useState<Step>("identify");
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-accent/30 p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/login" className="inline-flex items-center gap-8 text-sm text-muted-foreground hover:text-foreground text-white bg-ring p-2 rounded-lg mr-auto">
            <ArrowLeft className="h-6 w-6 " /> <b>Voltar ao Login</b>
          </Link>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground ml-12">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold mr-2">SafeWork</span>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-10 shadow-[var(--shadow-card)]">
          <Stepper step={step} />

          {step === "identify" && (
            <form className="mt-6 space-y-5" onSubmit={(e) => { e.preventDefault(); setStep("code"); }}>
              <div>
                <h1 className="text-xl font-bold">Recuperar acesso</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Informe seu CPF, matrícula ou e-mail corporativo.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ident">CPF, matrícula ou e-mail</Label>
                <Input id="ident" required placeholder="Ex.: 000.000.000-00" />
              </div>
              <Button type="submit" className="w-full" size="lg">Enviar código</Button>
            </form>
          )}

          {step === "code" && (
            <form className="mt-6 space-y-5" onSubmit={(e) => { e.preventDefault(); setStep("new-password"); }}>
              <div>
                <h1 className="text-xl font-bold">Código de verificação</h1>
                <p className="mt-1 text-md text-muted-foreground">
                  Enviamos um código de 6 dígitos para seu e-mail .
                </p>
              </div>
              <div className="flex justify-center">
                <InputOTP maxLength={6}>
                  <InputOTPGroup>
                    {[0,1,2,3,4,5].map((i) => <InputOTPSlot key={i} index={i} />)}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button type="submit" className="w-full" size="lg">Verificar</Button>
            </form>
          )}

          {step === "new-password" && (
            <form className="mt-6 space-y-5" onSubmit={(e) => { e.preventDefault(); setStep("success"); }}>
              <div>
                <h1 className="text-xl font-bold">Criar nova senha</h1>
                <p className="mt-1 text-md text-muted-foreground">
                  Escolha uma senha forte com pelo menos 8 caracteres.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="p1">Nova senha</Label>
                <Input id="p1" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p2">Confirmar senha</Label>
                <Input id="p2" type="password" required />
              </div>
              <Button type="submit" className="w-full" size="lg">Salvar nova senha</Button>
            </form>
          )}

          {step === "success" && (
            <div className="mt-6 text-center">
              <div className="mr-auto grid h-14 w-14 place-items-center rounded-full bg-success/15 text-success">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h1 className="mt-4 text-xl font-bold">Senha alterada!</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sua senha foi atualizada com sucesso. Você já pode acessar a plataforma.
              </p>
              <Button className="mt-6 w-full" size="lg" onClick={() => navigate({ to: "/login" })}>
                Voltar ao login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const order: Step[] = ["identify", "code", "new-password", "success"];
  const idx = order.indexOf(step);
  return (
    <div className="flex items-center gap-2">
      {order.map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${i <= idx ? "bg-primary" : "bg-border"}`}
        />
      ))}
    </div>
  );
}

