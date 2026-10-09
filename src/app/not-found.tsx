import { ButtonLink } from "@/components/ui/Button";
import { NightScene } from "@/components/ui/NightScene";
import { Container } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <section className="tone-night grain relative isolate flex min-h-svh items-center overflow-hidden pt-24">
      <NightScene className="-z-10" />
      <Container className="text-center">
        <p className="eyebrow text-gold">Erreur 404</p>
        <h1 className="display-xl mt-6 text-[clamp(4rem,18vw,12rem)]">
          <span className="text-gradient">Perdu</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-white/80">
          Cette page s&apos;est égarée entre la Tonnelle et le Caveau.
        </p>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/" size="lg" arrow>
            Retour à la fête
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
