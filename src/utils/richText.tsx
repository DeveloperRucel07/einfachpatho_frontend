import type { ReactNode } from "react";

/**
 * Die KI-generierten DURST-Texte aus dem Backend enthalten gelegentlich
 * Markdown-Bold-Syntax (z. B. "**Notruf (112):** Bei akuter Atemnot…").
 * Da React Strings immer als reinen Text rendert, kämen die Sternchen sonst
 * 1:1 auf dem Bildschirm an. Diese Funktion wandelt `**Text**`-Abschnitte in
 * echte <strong>-Elemente um — bewusst nur dieses eine Markdown-Feature,
 * kein vollständiger Markdown-Parser, kein HTML-Rendering von KI-Text.
 *
 * Verwendung: {formatBoldText(durst.definition)} statt {durst.definition}
 */
export function formatBoldText(text: string | null | undefined): ReactNode {
  if (!text || !text.includes("**")) return text ?? "";

  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, i) => {
    const match = /^\*\*([^*]+)\*\*$/.exec(part);
    return match ? <strong key={i}>{match[1]}</strong> : part;
  });
}

/**
 * Entfernt die **-Marker ersatzlos, statt sie in <strong> umzuwandeln.
 * Für Kontexte, in denen Text zusätzlich gekürzt wird (z. B. die
 * Kartenvorschau) — dort würde ein durch die Kürzung abgeschnittenes
 * Sternchen-Paar sonst als hängendes "**" sichtbar bleiben.
 */
export function stripBoldMarkers(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1");
}
