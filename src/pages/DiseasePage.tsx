import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { BackLink } from "../components/BackLink";
import { DiseaseThumbnail } from "../components/DiseaseThumbnail";
import { DiseaseDetail } from "../components/DiseaseDetail";
import { getDisease } from "../api/diseases";
import { ApiError } from "../api/client";
import type { Disease } from "../types/api";
import { formatRelativeDate } from "../utils/format";
import "../styles/dashboard.css";
import "../styles/disease-page.css";

function DiseasePageSkeleton() {
  return (
    <div className="disease-page-hero card" aria-hidden="true">
      <div className="skeleton" style={{ width: 64, height: 64, borderRadius: "var(--radius-sm)" }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="skeleton" style={{ width: "50%", height: 22 }} />
        <div className="skeleton" style={{ width: "30%", height: 14 }} />
      </div>
    </div>
  );
}

export function DiseasePage() {
  const { diseaseId } = useParams<{ diseaseId: string }>();
  const [disease, setDisease] = useState<Disease | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(() => {
    if (!diseaseId) return;
    setIsLoading(true);
    setError(null);
    setNotFound(false);
    getDisease(diseaseId)
      .then(setDisease)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setError(err instanceof ApiError ? err.message : "Krankheit konnte nicht geladen werden.");
        }
      })
      .finally(() => setIsLoading(false));
  }, [diseaseId]);

  useEffect(() => {
    load();
  }, [load]);

  const hasRedFlags = Boolean(disease?.durst_data?.red_flags);

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="container dashboard-main">
        <BackLink to="/dashboard">Zurück zur Übersicht</BackLink>

        {isLoading && <DiseasePageSkeleton />}

        {!isLoading && notFound && (
          <div className="card empty-state">
            <p className="empty-state-title">Krankheit nicht gefunden</p>
            <p className="empty-state-body">
              Diese Krankheit existiert nicht (mehr) oder du hast keinen Zugriff darauf.
            </p>
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
          <>
            <div className="disease-page-hero card">
              <DiseaseThumbnail disease={disease} size="lg" />
              <div className="disease-page-hero-main">
                <div className="disease-card-title-row">
                  <h1 className="disease-page-title">{disease.name}</h1>
                  <span className="disease-card-date">{formatRelativeDate(disease.created_at)}</span>
                </div>
                <div className="disease-card-badges">
                  <span className="badge">{disease.category}</span>
                  {hasRedFlags && <span className="badge badge-flag">⚑ Warnsignale</span>}
                </div>
              </div>
            </div>

            <div className="card">
              <DiseaseDetail disease={disease} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
