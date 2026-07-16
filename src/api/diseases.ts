import { apiFetch } from "./client";
import type { Disease } from "../types/api";

/**
 * WICHTIGER HINWEIS ZUM BACKEND (Stand des analysierten Repos):
 * `DiseaseListView` filtert aktuell NICHT nach `owner` — sie liefert alle
 * Krankheiten aller Nutzer:innen zurück (`Disease.objects.all()`), und
 * `DiseaseSerializer` gibt das `owner`-Feld auch gar nicht erst mit aus.
 * Für eine echte "meine bisherigen Krankheiten"-Ansicht braucht es serverseitig
 * entweder:
 *   a) einen Query-Filter, z. B. `filterset_fields` um `"owner"` erweitern und
 *      hier `?owner=<id>` anhängen, oder
 *   b) einen eigenen Endpunkt wie `/api/diseases/mine/`.
 * Bis dahin zeigt dieses Frontend bewusst die volle Liste (chronologisch,
 * neueste zuerst) — s. README der Übergabe für den genauen Patch-Vorschlag.
 */
export function listDiseases() {
  return apiFetch<Disease[]>("/diseases/");
}

export function getDisease(diseaseId: string) {
  return apiFetch<Disease>(`/diseases/${encodeURIComponent(diseaseId)}/`);
}

/**
 * Erzeugt eine neue Krankheit aus einem Freitext-Prompt (Symptom, Verdacht
 * oder Krankheitsname). Das Backend ruft dafür Gemini auf, um zuerst die
 * Krankheit zu identifizieren und dann den vollständigen DURST-Datensatz
 * sowie ein 5-Fragen-Quiz zu generieren — das kann spürbar dauern (mehrere
 * Sekunden), daher immer mit sichtbarem Ladezustand aufrufen.
 */
export function generateDiseaseFromPrompt(prompt: string) {
  return apiFetch<Disease>("/generate_disease/", {
    method: "POST",
    body: { prompt },
  });
}
