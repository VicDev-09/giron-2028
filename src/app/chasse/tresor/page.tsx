import type { Metadata } from "next";
import { TreasureReveal } from "@/components/treasure/TreasureReveal";
import { Container } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Le trésor",
  robots: { index: false, follow: false },
};

export default function TresorPage() {
  return (
    <section className="tone-night grain mesh relative isolate flex min-h-svh items-center overflow-hidden pt-32 pb-24">
      <Container className="relative z-10">
        <TreasureReveal />
      </Container>
    </section>
  );
}
