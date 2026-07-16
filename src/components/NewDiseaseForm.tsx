import { useState } from "react";
import type { FormEvent } from "react";

interface NewDiseaseFormProps {
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
  error: string | null;
}

const EXAMPLE_PROMPTS = ["tiefe Venenthrombose", "akuter Apoplex", "Pneumonie bei älteren Patienten"];

export function NewDiseaseForm({ onSubmit, isGenerating, error }: NewDiseaseFormProps) {
  const [prompt, setPrompt] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed || isGenerating) return;
    onSubmit(trimmed);
  }

  return (
    <section className="card new-disease-card" aria-labelledby="new-disease-heading">
      <h2 id="new-disease-heading" className="new-disease-heading">
        Neue Krankheit erfassen
      </h2>
      <p className="new-disease-subtitle">
        Gib ein Symptom, eine Verdachtsdiagnose oder einen Krankheitsnamen ein. Wir erstellen daraus
        automatisch einen vollständigen DURST-Datensatz mit Quiz.
      </p>

      <form onSubmit={handleSubmit} className="new-disease-form">
        {error && <div className="form-error-banner">{error}</div>}

        <div className="field">
          <label htmlFor="disease-prompt" className="visually-hidden">
            Symptom, Verdachtsdiagnose oder Krankheitsname
          </label>
          <textarea
            id="disease-prompt"
            className="textarea"
            placeholder={`z. B. „${EXAMPLE_PROMPTS[0]}“`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            rows={2}
            required
          />
        </div>

        <div className="new-disease-actions">
          <div className="new-disease-examples">
            {EXAMPLE_PROMPTS.map((example) => (
              <button
                type="button"
                key={example}
                className="chip"
                onClick={() => setPrompt(example)}
                disabled={isGenerating}
              >
                {example}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" type="submit" disabled={isGenerating || !prompt.trim()}>
            {isGenerating ? "Wird erstellt…" : "Krankheit erfassen"}
          </button>
        </div>
      </form>
    </section>
  );
}
