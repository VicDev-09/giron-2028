import { treasure, type TreasureStep } from "@/content/treasure";
import {
  CHAIN_SEED,
  checkHash,
  decryptFragment,
  finalCodeHash,
  nextChainKey,
  normalizeAnswer,
} from "./crypto";
import { clearRaw, readRaw, STORAGE_KEY, writeRaw } from "./storage";

/** Étape résolue (dans l'ordre du parcours). */
export interface StepRecord {
  id: string;
  /** Clé de chaîne de l'étape (permet de dériver la suivante) */
  key: string;
  fragment: string;
  /** Horodatage de résolution (ms) */
  at: number;
}

export interface TreasureProgress {
  /** Faux tant que l'état local n'est pas chargé (rendu serveur) */
  ready: boolean;
  started: boolean;
  startedAt: number | null;
  records: StepRecord[];
  /** Index de l'étape en cours (= nombre d'étapes résolues) */
  current: number;
  currentStep: TreasureStep | null;
  completedAt: number | null;
}

export type AttemptResult =
  | { ok: true; step: TreasureStep; fragment: string; complete: boolean }
  | { ok: false; reason: "not-started" | "locked" | "wrong" | "unknown" };

/**
 * Interface du jeu. Les composants n'utilisent QUE ceci : la mise en œuvre
 * locale (localStorage) peut être remplacée par une version serveur sans
 * toucher à l'interface.
 */
export interface TreasureService {
  getProgress(): TreasureProgress;
  subscribe(listener: () => void): () => void;
  start(): void;
  /** Active un indice caché (jeton porté par l'élément trouvé). */
  discoverHint(stepId: string, token: string): Promise<AttemptResult>;
  /** Propose une réponse à une énigme. */
  submitAnswer(stepId: string, answer: string): Promise<AttemptResult>;
  isComplete(): boolean;
  /** Code final formaté, ou null si incomplet / incohérent. */
  getFinalCode(): Promise<string | null>;
  reset(): void;
}

interface Persisted {
  v: 1;
  startedAt: number | null;
  records: StepRecord[];
  completedAt: number | null;
}

const steps = treasure.steps;

function build(state: Persisted | null, ready: boolean): TreasureProgress {
  const records = state?.records ?? [];
  return {
    ready,
    started: !!state?.startedAt,
    startedAt: state?.startedAt ?? null,
    records,
    current: records.length,
    currentStep: steps[records.length] ?? null,
    completedAt: state?.completedAt ?? null,
  };
}

/** État rendu côté serveur et pendant l'hydratation. */
export const SERVER_PROGRESS = build(null, false);

export function formatCode(code: string, groups = treasure.codeGroups) {
  const parts: string[] = [];
  let i = 0;
  for (const size of groups) {
    parts.push(code.slice(i, i + size));
    i += size;
  }
  if (i < code.length) parts.push(code.slice(i));
  return parts.filter(Boolean).join("-");
}

class LocalTreasureService implements TreasureService {
  private state: Persisted | null = null;
  private snapshot: TreasureProgress = SERVER_PROGRESS;
  private loaded = false;
  private listeners = new Set<() => void>();
  private pending = false;

  private load() {
    if (this.loaded || typeof window === "undefined") return;
    this.loaded = true;
    this.state = this.parse(readRaw());
    this.snapshot = build(this.state, true);
    // Synchronisation entre onglets
    window.addEventListener("storage", (e) => {
      if (e.key !== STORAGE_KEY) return;
      this.state = this.parse(e.newValue);
      this.emit();
    });
    void this.verify();
  }

  private parse(raw: string | null): Persisted | null {
    if (!raw) return null;
    try {
      const data = JSON.parse(raw) as Persisted;
      return data?.v === 1 && Array.isArray(data.records) ? data : null;
    } catch {
      return null;
    }
  }

  /** Revalide la chaîne enregistrée ; tronque à la première étape invalide. */
  private async verify() {
    const state = this.state;
    if (!state) return;
    const valid: StepRecord[] = [];
    for (const [i, record] of state.records.entries()) {
      const step = steps[i];
      if (!step || record.id !== step.id) break;
      if ((await checkHash(record.key)) !== step.check) break;
      valid.push({
        ...record,
        fragment: decryptFragment(step.fragment, record.key),
      });
    }
    // L'état a changé entre-temps (étape jouée) : ne rien écraser
    if (this.state !== state) return;
    if (valid.length !== state.records.length) {
      this.state = {
        ...state,
        records: valid,
        completedAt: valid.length === steps.length ? state.completedAt : null,
      };
      this.persist();
    }
  }

  private persist() {
    if (this.state) writeRaw(JSON.stringify(this.state));
    else clearRaw();
    this.emit();
  }

  private emit() {
    this.snapshot = build(this.state, true);
    this.listeners.forEach((l) => l());
  }

  getProgress = () => {
    this.load();
    return this.snapshot;
  };

  subscribe = (listener: () => void) => {
    this.load();
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  start = () => {
    this.load();
    if (this.state?.startedAt) return;
    this.state = {
      v: 1,
      startedAt: Date.now(),
      records: [],
      completedAt: null,
    };
    this.persist();
  };

  private async attempt(
    stepId: string,
    secret: string,
  ): Promise<AttemptResult> {
    this.load();
    const state = this.state;
    if (!state?.startedAt) return { ok: false, reason: "not-started" };
    const index = steps.findIndex((s) => s.id === stepId);
    if (index === -1) return { ok: false, reason: "unknown" };
    if (index !== state.records.length || this.pending) {
      return { ok: false, reason: "locked" };
    }

    this.pending = true;
    try {
      const step = steps[index];
      const previous = state.records.at(-1)?.key ?? CHAIN_SEED;
      const key = await nextChainKey(previous, secret);
      if ((await checkHash(key)) !== step.check) {
        return { ok: false, reason: "wrong" };
      }
      const fragment = decryptFragment(step.fragment, key);
      const complete = index === steps.length - 1;
      this.state = {
        ...state,
        records: [
          ...state.records,
          { id: step.id, key, fragment, at: Date.now() },
        ],
        // TODO(mode B — backend) : à la complétion, envoyer ici la chaîne de
        // clés au serveur, qui revalide chaque étape, horodate officiellement
        // la fin et enregistre le premier finisseur. Brancher une
        // ApiTreasureService implémentant TreasureService (voir plus bas).
        completedAt: complete ? Date.now() : null,
      };
      this.persist();
      return { ok: true, step, fragment, complete };
    } finally {
      this.pending = false;
    }
  }

  discoverHint = (stepId: string, token: string) => this.attempt(stepId, token);

  submitAnswer = (stepId: string, answer: string) =>
    this.attempt(stepId, normalizeAnswer(answer));

  isComplete = () => this.getProgress().records.length === steps.length;

  getFinalCode = async () => {
    if (!this.isComplete()) return null;
    const code = this.getProgress()
      .records.map((r) => r.fragment)
      .join("");
    // Garde-fou : le code assemblé doit correspondre au hash de la config
    return (await finalCodeHash(code)) === treasure.finalCodeHash
      ? formatCode(code)
      : null;
  };

  reset = () => {
    this.load();
    this.state = null;
    this.persist();
  };
}

/**
 * Point d'accès unique au jeu.
 * TODO(mode B — backend) : remplacer par `new ApiTreasureService(...)`
 * (même interface : validation côté serveur, enregistrement du premier
 * finisseur) ; aucun composant n'a besoin de changer.
 */
export const treasureService: TreasureService = new LocalTreasureService();
