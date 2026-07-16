import { useState } from "react";
import type { Disease } from "../types/api";

interface DiseaseThumbnailProps {
  disease: Disease;
  size?: "sm" | "lg";
}

export function DiseaseThumbnail({ disease, size = "sm" }: DiseaseThumbnailProps) {
  const [failed, setFailed] = useState(false);
  const initial = disease.name.trim().charAt(0).toUpperCase() || "?";
  const sizeClass = size === "lg" ? "disease-thumb-lg" : "";

  if (!disease.image || failed) {
    return (
      <div className={`disease-thumb disease-thumb-fallback ${sizeClass}`} aria-hidden="true">
        {initial}
      </div>
    );
  }

  return (
    <img
      className={`disease-thumb ${sizeClass}`}
      src={disease.image}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
