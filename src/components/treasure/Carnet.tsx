"use client";

import { motion, useAnimationControls } from "framer-motion";
import {
  Check,
  Feather,
  Gem,
  Lock,
  RotateCcw,
  ScrollText,
  Sparkle,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { treasure, type TreasureStep } from "@/content/treasure";
import { Button, ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  treasureService,
  useTreasure,
  type StepRecord,
  type TreasureProgress,
} from "@/lib/treasure";

/** Carnet de la chasse : progression, piste en cours, réponses aux énigmes. */
export function Carnet() {
  const progress = useTreasure();
  const total = treasure.steps.length;
  const complete = progress.records.length === total;

  return (
    <div className="parchment relative mx-auto max-w-3xl rounded-[1.75rem] px-5 py-10 sm:px-12 sm:py-14">
      <header className="text-center">
        <ScrollText aria-hidden className="mx-auto size-8 text-[#8a5a2b]" />
        <p className="eyebrow mt-4 text-[#8a5a2b]">Carnet de chasse</p>
        <h2 className="mt-2 font-display text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-4xl">
          {treasure.title}
        </h2>
      </header>

      <Fragments progress={progress} />

      {!progress.ready ? (
        <p className="mt-10 text-center text-sm text-[#5b4632]">
          Ouverture du carnet…
        </p>
      ) : !progress.started ? (
        <Intro />
      ) : (
        <>
          <p className="mt-6 text-center text-sm font-semibold text-[#5b4632]">
            {complete
              ? "Tous les fragments sont réunis !"
              : `Étape ${progress.current + 1} sur ${total}`}
          </p>

          <ol className="mt-10 space-y-4">
            {treasure.steps.map((step, i) => (
              <li key={step.id}>
                {i < progress.current ? (
                  <DoneStep step={step} record={progress.records[i]} n={i} />
                ) : i === progress.current ? (
                  <CurrentStep step={step} n={i} />
                ) : (
                  <LockedStep n={i} />
                )}
              </li>
            ))}
          </ol>

          {complete && (
            <div className="mt-10 text-center">
              <ButtonLink href="/chasse/tresor" size="lg" arrow>
                Révéler le trésor
              </ButtonLink>
            </div>
          )}

          <div className="mt-12 border-t border-[#8a5a2b]/25 pt-6 text-center">
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    "Effacer ta progression et recommencer la chasse ?",
                  )
                ) {
                  treasureService.reset();
                }
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#5b4632] underline-offset-4 hover:underline"
            >
              <RotateCcw aria-hidden className="size-3.5" />
              Recommencer la chasse
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/** Cachets des fragments déjà trouvés. */
function Fragments({ progress }: { progress: TreasureProgress }) {
  return (
    <div className="mt-8">
      <p className="sr-only">
        {progress.records.length} fragment(s) trouvé(s) sur{" "}
        {treasure.steps.length}
      </p>
      <ul
        aria-hidden
        className="flex flex-wrap justify-center gap-1.5 sm:gap-3"
      >
        {treasure.steps.map((step, i) => {
          const record = progress.records[i];
          return (
            <li
              key={step.id}
              className={cn(
                "grid h-12 w-10 place-items-center rounded-xl border-2 font-mono text-sm font-bold tracking-[0.15em] sm:h-16 sm:w-14 sm:text-lg",
                record
                  ? "border-[#b2381c] bg-[#b2381c] text-[#fbf1dc] shadow-[0_6px_14px_-6px_rgba(120,30,10,0.7)]"
                  : "border-dashed border-[#8a5a2b]/40 text-[#8a5a2b]/50",
              )}
            >
              {record ? record.fragment : "··"}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Intro() {
  return (
    <div className="mt-10">
      <p className="text-lg leading-relaxed text-pretty">{treasure.intro}</p>
      <ul className="mt-6 space-y-2">
        {treasure.rules.map((rule) => (
          <li key={rule} className="flex gap-3 leading-relaxed text-[#5b4632]">
            <Feather
              aria-hidden
              className="mt-1 size-4 shrink-0 text-[#8a5a2b]"
            />
            {rule}
          </li>
        ))}
      </ul>
      <div className="mt-10 text-center">
        <Button size="lg" onClick={treasureService.start} arrow>
          Ouvrir la chasse
        </Button>
      </div>
    </div>
  );
}

const stepLabel = (step: TreasureStep, n: number) =>
  `Étape ${n + 1} · ${step.type === "indice" ? "Cachette" : "Énigme"}`;

function DoneStep({
  step,
  record,
  n,
}: {
  step: TreasureStep;
  record?: StepRecord;
  n: number;
}) {
  return (
    <article className="flex gap-4 rounded-2xl border border-[#8a5a2b]/25 bg-[#fffaf0]/50 p-5">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#2f7a4f] text-[#fbf1dc]">
        <Check aria-hidden className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold tracking-[0.15em] text-[#8a5a2b] uppercase">
          {stepLabel(step, n)}
        </p>
        <h3 className="mt-1 font-display text-xl font-extrabold">
          {step.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-[#5b4632]">
          {step.success}
        </p>
      </div>
      {record && (
        <span className="self-center font-mono text-lg font-bold tracking-[0.2em] text-[#b2381c]">
          {record.fragment}
        </span>
      )}
    </article>
  );
}

function CurrentStep({ step, n }: { step: TreasureStep; n: number }) {
  return (
    <article className="relative rounded-2xl border-2 border-[#b2381c]/70 bg-[#fffaf0]/80 p-5 shadow-[0_14px_40px_-24px_rgba(120,40,10,0.6)] sm:p-7">
      <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-[#b2381c] uppercase">
        <Sparkle aria-hidden className="size-3.5 fill-current" />
        {stepLabel(step, n)} — en cours
      </p>
      <h3 className="mt-2 font-display text-2xl font-extrabold">
        {step.title}
      </h3>
      <p className="mt-3 text-lg leading-relaxed text-pretty italic">
        « {step.clue} »
      </p>
      {step.type === "enigme" ? (
        <AnswerForm step={step} />
      ) : (
        <p className="mt-5 text-sm leading-relaxed text-[#5b4632]">
          Ce fragment ne s&apos;écrit pas ici : il se trouve.
        </p>
      )}
    </article>
  );
}

function AnswerForm({ step }: { step: TreasureStep }) {
  const [answer, setAnswer] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const shake = useAnimationControls();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!answer.trim() || pending) return;
    setPending(true);
    setError("");
    const [result] = await Promise.all([
      treasureService.submitAnswer(step.id, answer),
      // Petit délai : décourage les essais à la chaîne
      new Promise((r) => setTimeout(r, 600)),
    ]);
    setPending(false);
    if (!result.ok) {
      setError(
        result.reason === "decoy"
          ? "Fausse piste… quelqu'un a voulu t'égarer."
          : "Ce n'est pas la bonne piste…",
      );
      void shake.start({
        x: [0, -8, 8, -5, 5, 0],
        transition: { duration: 0.4 },
      });
    }
  }

  const inputId = `reponse-${step.id}`;
  return (
    <motion.form animate={shake} onSubmit={onSubmit} className="mt-6">
      <label htmlFor={inputId} className="text-sm font-semibold">
        Ta réponse
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id={inputId}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-erreur` : undefined}
          className="h-12 min-w-0 flex-1 rounded-full border-2 border-[#8a5a2b]/40 bg-[#fffaf0] px-5 text-base text-[#2b1d12] placeholder:text-[#8a5a2b]/60 focus:border-[#b2381c] focus:outline-none"
          placeholder="Écris ta réponse…"
        />
        <Button type="submit" disabled={pending} className="h-12">
          <span className="inline-flex items-center gap-2">
            <Gem aria-hidden className="size-4" />
            {pending ? "Vérification…" : "Valider"}
          </span>
        </Button>
      </div>
      <p
        id={`${inputId}-erreur`}
        role="alert"
        className="mt-3 min-h-5 text-sm font-semibold text-[#b2381c]"
      >
        {error}
      </p>
    </motion.form>
  );
}

function LockedStep({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-dashed border-[#8a5a2b]/30 p-5 text-[#8a5a2b]">
      <Lock aria-hidden className="size-5" />
      <p className="text-sm font-semibold">Étape {n + 1} — verrouillée</p>
    </div>
  );
}
