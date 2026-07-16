import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { BackLink } from "../components/BackLink";
import { QuizBlock } from "../components/QuizBlock";
import { getDisease } from "../api/diseases";
import { ApiError } from "../api/client";
import type { Disease } from "../types/api";
import "../styles/dashboard.css";
import "../styles/disease-page.css";

export function QuizPage() {
  const { diseaseId } = useParams<{ diseaseId: string }>();
  const [disease, setDisease] = useState<Disease | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!diseaseId) return;
    setIsLoading(true);
    setError(null);
    getDisease(diseaseId)
      .then(setDisease)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Quiz konnte nicht geladen werden.");
      })
      .finally(() => setIsLoading(false));
  }, [diseaseId]);

  useEffect(() => {
    load();
  }, [load]);

  const backTo = diseaseId ? `/diseases/${encodeURIComponent(diseaseId)}` : "/dashboard";
  const questions = disease?.quizzes.flatMap((q) => q.questions) ?? [];

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="container dashboard-main">
        <BackLink to={backTo}>Zurück zur Krankheit</BackLink>

        {isLoading && (
          <div className="card disease-page-hero" aria-hidden="true">
            <div className="skeleton" style={{ width: "60%", height: 22 }} />
          </div>
        )}

        {!isLoading && error && (
          <div className="card empty-state">
            <p className="form-error-banner">{error}</p>
            <button className="btn btn-ghost" onClick={load}>
              Erneut versuchen
            </button>
          </div>
        )}

        {!isLoading && disease && (
          <div className="card quiz-page-card">
            <h1 className="disease-page-title quiz-page-title">Quiz: {disease.name}</h1>
            {questions.length > 0 ? (
              <QuizBlock questions={questions} />
            ) : (
              <p className="empty-state-body">Für diese Krankheit liegt noch kein Quiz vor.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
