import { useCallback, useEffect, useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { NewDiseaseForm } from "../components/NewDiseaseForm";
import { DiseaseList } from "../components/DiseaseList";
import { GeneratingOverlay } from "../components/GeneratingOverlay";
import { listDiseases, generateDiseaseFromPrompt } from "../api/diseases";
import { ApiError } from "../api/client";
import type { Disease } from "../types/api";
import "../styles/dashboard.css";
import "../styles/loading-overlay.css";

export function DashboardPage() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Erzeugt bei Erfolg einen neuen Wert, damit <NewDiseaseForm key={...}>
  // remountet und sein Eingabefeld zurücksetzt — bei einem Fehler bleibt der
  // eingegebene Text dagegen erhalten, damit nichts verloren geht.
  const [successCount, setSuccessCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const loadDiseases = useCallback(() => {
    setIsLoading(true);
    setError(null);
    listDiseases()
      .then(setDiseases)
      .catch((err) => {
        setError(
          err instanceof ApiError ? err.message : "Krankheiten konnten nicht geladen werden."
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    loadDiseases();
  }, [loadDiseases]);

  async function handleGenerate(prompt: string) {
    setGenerateError(null);
    setIsGenerating(true);
    try {
      const disease = await generateDiseaseFromPrompt(prompt);
      setDiseases((prev) => [disease, ...prev.filter((d) => d.disease_id !== disease.disease_id)]);
      setSuccessCount((c) => c + 1);
    } catch (err) {
      setGenerateError(
        err instanceof ApiError ? err.message : "Erstellung fehlgeschlagen. Bitte versuch es erneut."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="container dashboard-main">
        <NewDiseaseForm
          key={successCount}
          onSubmit={handleGenerate}
          isGenerating={isGenerating}
          error={generateError}
        />

        <section className="dashboard-history" aria-labelledby="history-heading">
          <h2 id="history-heading" className="dashboard-history-heading">
            Bisherige Krankheiten
          </h2>
          <DiseaseList diseases={diseases} isLoading={isLoading} error={error} onRetry={loadDiseases} />
        </section>
      </main>

      {isGenerating && <GeneratingOverlay />}
    </div>
  );
}
