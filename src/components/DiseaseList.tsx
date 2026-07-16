import type { Disease } from "../types/api";
import { DiseaseCard } from "./DiseaseCard";

function DiseaseCardSkeleton() {
  return (
    <li className="card disease-card disease-card-skeleton" aria-hidden="true">
      <div className="skeleton" style={{ width: 48, height: 48, borderRadius: "var(--radius-sm)" }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="skeleton" style={{ width: "40%", height: 16 }} />
        <div className="skeleton" style={{ width: "70%", height: 12 }} />
        <div className="skeleton" style={{ width: "90%", height: 12 }} />
      </div>
    </li>
  );
}

interface DiseaseListProps {
  diseases: Disease[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function DiseaseList({ diseases, isLoading, error, onRetry }: DiseaseListProps) {
  if (isLoading) {
    return (
      <ul className="disease-list">
        <DiseaseCardSkeleton />
        <DiseaseCardSkeleton />
        <DiseaseCardSkeleton />
      </ul>
    );
  }

  if (error) {
    return (
      <div className="card empty-state">
        <p className="form-error-banner">{error}</p>
        <button className="btn btn-ghost" onClick={onRetry}>
          Erneut versuchen
        </button>
      </div>
    );
  }

  if (diseases.length === 0) {
    return (
      <div className="card empty-state">
        <p className="empty-state-title">Noch keine Krankheiten erfasst</p>
        <p className="empty-state-body">
          Trag oben ein Symptom oder einen Krankheitsnamen ein — die erste Krankheit erscheint dann
          hier in deiner Übersicht.
        </p>
      </div>
    );
  }

  return (
    <ul className="disease-list">
      {diseases.map((disease) => (
        <DiseaseCard key={disease.disease_id} disease={disease} />
      ))}
    </ul>
  );
}
