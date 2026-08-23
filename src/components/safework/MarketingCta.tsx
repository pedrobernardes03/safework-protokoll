import { Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/safework/Reveal";

export function MarketingCta({
  title,
  description,
  buttonLabel,
  buttonTo,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  buttonTo: string;
}) {
  return (
    <Reveal className="relative mt-20 flex flex-col items-center gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.28_0.06_150)] via-primary to-[oklch(0.62_0.12_165)] px-8 py-16 text-center text-primary-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-[oklch(0.7_0.14_165)]/25 blur-3xl" />

      <ShieldCheck className="relative h-10 w-10" />
      <h2 className="relative text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
      <p className="relative max-w-xl text-sm text-primary-foreground/80 sm:text-base">{description}</p>
      <Button
        asChild
        size="lg"
        variant="secondary"
        className="relative rounded-xl px-6 py-6 text-base font-semibold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
      >
        <Link to={buttonTo} className="flex items-center gap-2">
          {buttonLabel} <ArrowRight className="h-5 w-5" />
        </Link>
      </Button>
    </Reveal>
  );
}
