import type { Metadata } from "next";
import { Carnet } from "@/components/treasure/Carnet";
import { Container } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Carnet secret",
  description: "Le carnet de la chasse au trésor du Giron 2028.",
  robots: { index: false, follow: false },
};

export default function ChassePage() {
  return (
    <section className="tone-night grain mesh relative min-h-svh overflow-hidden pt-32 pb-24 sm:pt-36">
      <Container className="relative z-10">
        <h1 className="eyebrow mb-8 flex items-center justify-center gap-3 text-amber">
          <span aria-hidden className="h-px w-8 bg-current" />
          Chasse au trésor
          <span aria-hidden className="h-px w-8 bg-current" />
        </h1>
        <Carnet />
      </Container>
    </section>
  );
}
