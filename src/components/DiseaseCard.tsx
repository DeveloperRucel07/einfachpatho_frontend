import { Link } from "react-router-dom";
import type { Disease } from "../types/api";
import { formatRelativeDate, truncate } from "../utils/format";
import { stripBoldMarkers } from "../utils/richText";
import { DiseaseThumbnail } from "./DiseaseThumbnail";

export function DiseaseCard({ disease }: { disease: Disease }) {
  const hasRedFlags = Boolean(disease.durst_data?.red_flags);
  const definitionPreview = disease.durst_data?.definition
    ? truncate(stripBoldMarkers(disease.durst_data.definition), 150)
    : "Keine Definition hinterlegt.";

  return (
    <li className="card disease-card">
      <Link to={`/diseases/${encodeURIComponent(disease.disease_id)}`} className="disease-card-header">
        <DiseaseThumbnail disease={disease} />

        <div className="disease-card-main">
          <div className="disease-card-title-row">
            <h3 className="disease-card-name">{disease.name}</h3>
            <span className="disease-card-date">{formatRelativeDate(disease.created_at)}</span>
          </div>

          <div className="disease-card-badges">
            <span className="badge">{disease.category}</span>
            {hasRedFlags && <span className="badge badge-flag">⚑ Warnsignale</span>}
          </div>

          <p className="disease-card-preview">{definitionPreview}</p>
        </div>

        <span className="disease-card-chevron" aria-hidden="true">
          →
        </span>
      </Link>
    </li>
  );
}
