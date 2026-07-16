import { useEffect, useState } from "react";

const STAGES = [
  { letter: "D", message: "Formuliert die Definition…" },
  { letter: "U", message: "Analysiert die Ursachen…" },
  { letter: "R", message: "Bewertet die Risikofaktoren…" },
  { letter: "S", message: "Sammelt Symptome & Warnsignale…" },
  { letter: "T", message: "Leitet Sofortmaßnahmen ab…" },
] as const;

const STAGE_DURATION_MS = 1800;

/**
 * Blockiert die gesamte Seite während der KI-Generierung einer neuen
 * Krankheit (POST /generate_disease/ kann bis zu ~30s dauern). Die
 * durchwandernden D-U-R-S-T-Buchstaben sind keine echte Fortschrittsanzeige
 * (das Backend liefert keine Zwischenstände) — sie greifen bewusst dasselbe
 * Schema wie die Detailansicht auf, statt eines generischen Spinners.
 */
export function GeneratingOverlay() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % STAGES.length);
    }, STAGE_DURATION_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="generating-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-busy="true"
      aria-label="Krankheit wird erstellt"
    >
      <div className="generating-card">
        <div className="generating-rail" aria-hidden="true">
          {STAGES.map((s, i) => (
            <span key={s.letter} className={`generating-letter ${i === activeIndex ? "is-active" : ""}`}>
              {s.letter}
            </span>
          ))}
        </div>

        <h2 className="generating-title">Krankheit wird erstellt</h2>
        <p className="generating-message" aria-live="polite">
          {STAGES[activeIndex].message}
        </p>
        <p className="generating-hint">Das kann bis zu 30 Sekunden dauern — bitte kurz warten.</p>
      </div>
    </div>
  );
}
