import { Link } from "react-router-dom";
import type { Disease } from "../types/api";
import { formatBoldText } from "../utils/richText";

const DURST_SECTIONS = [
  { letter: "D", id: "definition", label: "Definition" },
  { letter: "U", id: "ursachen", label: "Ursachen" },
  { letter: "R", id: "risiko", label: "Risikofaktoren" },
  { letter: "S", id: "symptome", label: "Symptome" },
  { letter: "T", id: "therapie", label: "Therapie" },
] as const;

export function DiseaseDetail({ disease }: { disease: Disease }) {
  const durst = disease.durst_data;
  const sectionId = (key: string) => `${key}-${disease.disease_id}`;
  const questionCount = disease.quizzes.flatMap((q) => q.questions).length;

  if (!durst) {
    return (
      <div className="disease-detail">
        <p className="disease-detail-empty">
          Für diese Krankheit liegt noch kein vollständiger DURST-Datensatz vor.
        </p>
      </div>
    );
  }

  return (
    <div className="disease-detail">
      <nav className="durst-rail" aria-label="DURST-Schema Sprungmarken">
        {DURST_SECTIONS.map((s) => (
          <a key={s.id} href={`#${sectionId(s.id)}`} className="durst-rail-letter" title={s.label}>
            {s.letter}
          </a>
        ))}
      </nav>

      <div className="durst-sections">
        <section id={sectionId("definition")} className="durst-section">
          <h4 className="durst-section-title">
            <span className="durst-letter">D</span>efinition
          </h4>
          <p>{formatBoldText(durst.definition)}</p>
        </section>

        <section id={sectionId("ursachen")} className="durst-section">
          <h4 className="durst-section-title">
            <span className="durst-letter">U</span>rsachen
          </h4>
          <p>{formatBoldText(durst.ursachen)}</p>
          {durst.ursache_keywords.length > 0 && (
            <div className="keyword-row">
              {durst.ursache_keywords.map((k) => (
                <span key={k.id} className="badge">
                  {k.keyword}
                </span>
              ))}
            </div>
          )}
        </section>

        <section id={sectionId("risiko")} className="durst-section">
          <h4 className="durst-section-title">
            <span className="durst-letter">R</span>isikofaktoren
          </h4>
          <ul className="plain-list">
            {durst.risk_factors.map((r) => (
              <li key={r.id}>{formatBoldText(r.text)}</li>
            ))}
          </ul>
        </section>

        <section id={sectionId("symptome")} className="durst-section">
          <h4 className="durst-section-title">
            <span className="durst-letter">S</span>ymptome
          </h4>
          <ul className="plain-list">
            {durst.symptoms.map((s) => (
              <li key={s.id}>{formatBoldText(s.text)}</li>
            ))}
          </ul>
          {durst.red_flags && (
            <div className="red-flag-callout">
              <span className="badge badge-flag">⚑ Warnsignale</span>
              <p>{formatBoldText(durst.red_flags)}</p>
            </div>
          )}
        </section>

        <section id={sectionId("therapie")} className="durst-section">
          <h4 className="durst-section-title">
            <span className="durst-letter">T</span>herapie &amp; Sofortmaßnahmen
          </h4>
          <ul className="plain-list">
            {durst.immediate_actions.map((a) => (
              <li key={a.id}>{formatBoldText(a.text)}</li>
            ))}
          </ul>
          {durst.diagnostic_gold_standard && (
            <p className="gold-standard">
              <strong>Diagnostischer Goldstandard:</strong>{" "}
              {formatBoldText(durst.diagnostic_gold_standard)}
            </p>
          )}
          {durst.guideline_link && (
            <a
              className="guideline-link"
              href={durst.guideline_link}
              target="_blank"
              rel="noreferrer"
            >
              Leitlinie ansehen ↗
            </a>
          )}
        </section>
      </div>

      {questionCount > 0 && (
        <section className="quiz-section">
          <Link
            to={`/diseases/${encodeURIComponent(disease.disease_id)}/quiz`}
            className="btn btn-primary quiz-toggle"
          >
            Quiz starten ({questionCount} {questionCount === 1 ? "Frage" : "Fragen"})
          </Link>
        </section>
      )}

      {disease.sources.length > 0 && (
        <section className="sources-section">
          <h4 className="sources-title">Quellen</h4>
          <ul className="plain-list sources-list">
            {disease.sources.map((s) => (
              <li key={s.id}>
                <a href={s.link} target="_blank" rel="noreferrer">
                  {s.source_name} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
