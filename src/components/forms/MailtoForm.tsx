"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Info, Send } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

export type Field =
  | {
      type: "text" | "email" | "tel";
      name: string;
      label: string;
      required?: boolean;
      autoComplete?: string;
      half?: boolean;
    }
  | { type: "textarea"; name: string; label: string; required?: boolean }
  | {
      type: "checkboxes";
      name: string;
      label: string;
      options: readonly string[];
    };

/**
 * Formulaire provisoire : aucune donnée n'est envoyée à un serveur. À la
 * validation, le client mail de l'utilisateur s'ouvre avec un message
 * pré-rempli. Le traitement serveur viendra dans une phase ultérieure.
 */
export function MailtoForm({
  to,
  subject,
  fields,
  submitLabel = "Envoyer",
}: {
  to: string;
  subject: string;
  fields: Field[];
  submitLabel?: string;
}) {
  const id = useId();
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const lines = fields.map((f) => {
      const value =
        f.type === "checkboxes"
          ? data.getAll(f.name).join(", ") || "—"
          : String(data.get(f.name) ?? "").trim() || "—";
      return `${f.label} : ${value}`;
    });
    const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    window.location.href = href;
    setSent(true);
  }

  const inputClass =
    "mt-2 w-full rounded-2xl border border-line bg-elevated px-4 py-3.5 text-base text-ink transition-[border-color,box-shadow] outline-none placeholder:text-muted/70 focus:border-accent focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--brand-scarlet)_20%,transparent)]";

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      {fields.map((f) => {
        const fieldId = `${id}-${f.name}`;
        if (f.type === "checkboxes") {
          return (
            <fieldset key={f.name} className="sm:col-span-2">
              <legend className="text-sm font-semibold">{f.label}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {f.options.map((option) => (
                  <label key={option} className="cursor-pointer">
                    <input
                      type="checkbox"
                      name={f.name}
                      value={option}
                      className="peer sr-only"
                    />
                    <span className="inline-flex rounded-full border border-line px-4 py-2 text-sm font-semibold transition-[background-color,border-color,color] peer-checked:border-ink peer-checked:bg-ink peer-checked:text-surface peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--ring)] hover:border-ink">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          );
        }
        return (
          <div
            key={f.name}
            className={
              f.type !== "textarea" && f.half
                ? "sm:col-span-1"
                : "sm:col-span-2"
            }
          >
            <label htmlFor={fieldId} className="text-sm font-semibold">
              {f.label}
              {f.required && (
                <span className="text-accent-strong" aria-hidden>
                  {" "}
                  *
                </span>
              )}
            </label>
            {f.type === "textarea" ? (
              <textarea
                id={fieldId}
                name={f.name}
                required={f.required}
                rows={5}
                className={cn(inputClass, "resize-y")}
              />
            ) : (
              <input
                id={fieldId}
                name={f.name}
                type={f.type}
                required={f.required}
                autoComplete={f.autoComplete}
                className={inputClass}
              />
            )}
          </div>
        );
      })}

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-sm text-muted">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
          Formulaire provisoire : il ouvre ton application e-mail avec un
          message pré-rempli.
        </p>
        <Button type="submit" size="lg" className="shrink-0">
          <span className="inline-flex items-center gap-2">
            {submitLabel}
            <Send
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
            />
          </span>
        </Button>
      </div>

      <AnimatePresence>
        {sent && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl bg-sunken p-4 text-sm font-medium sm:col-span-2"
          >
            Ton application e-mail devrait s&apos;ouvrir. Si rien ne se passe,
            écris-nous directement à{" "}
            <a
              href={`mailto:${to}`}
              className="font-semibold text-accent-strong underline"
            >
              {to}
            </a>
            .
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
