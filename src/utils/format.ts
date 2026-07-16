const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 1000 * 60 * 60 * 24 * 365],
  ["month", 1000 * 60 * 60 * 24 * 30],
  ["week", 1000 * 60 * 60 * 24 * 7],
  ["day", 1000 * 60 * 60 * 24],
  ["hour", 1000 * 60 * 60],
  ["minute", 1000 * 60],
];

const rtf = new Intl.RelativeTimeFormat("de", { numeric: "auto" });

/** Formatiert einen ISO-Zeitstempel als "vor 2 Tagen" (deutsch, relativ). */
export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const diffMs = date.getTime() - Date.now();

  for (const [unit, ms] of RELATIVE_UNITS) {
    const value = diffMs / ms;
    if (Math.abs(value) >= 1) {
      return rtf.format(Math.round(value), unit);
    }
  }
  return "gerade eben";
}

/** Kürzt einen Text auf `max` Zeichen, bricht am letzten Wortende. */
export function truncate(text: string, max: number): string {
  if (!text || text.length <= max) return text ?? "";
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max)}…`;
}
