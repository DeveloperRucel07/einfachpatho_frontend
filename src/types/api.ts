/**
 * Diese Typen spiegeln 1:1 die Serializer aus dem Django-Backend
 * (EinfachPatho_Backend/pathology_app/api/serializers.py und
 * auth_app/api/serializers.py), damit Frontend und Backend nicht auseinanderlaufen.
 */

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface UrsacheKeyword {
  id: number;
  keyword: string;
}

export interface RiskFactor {
  id: number;
  text: string;
}

export interface Symptom {
  id: number;
  text: string;
}

export interface ImmediateAction {
  id: number;
  text: string;
}

export interface DurstData {
  id: number;
  definition: string;
  ursachen: string;
  ursache_keywords: UrsacheKeyword[];
  risk_factors: RiskFactor[];
  symptoms: Symptom[];
  red_flags: string;
  immediate_actions: ImmediateAction[];
  diagnostic_gold_standard: string;
  guideline_link: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: number;
  title: string;
  questions: QuizQuestion[];
  created_at: string;
  updated_at: string;
}

export interface Source {
  id: number;
  source_name: string;
  link: string;
}

export interface Disease {
  id: number;
  disease_id: string;
  name: string;
  image: string | null;
  category: string;
  durst_data: DurstData | null;
  quizzes: Quiz[];
  sources: Source[];
  created_at: string;
  updated_at: string;
}

export interface ApiErrorBody {
  detail?: string;
  error?: string;
  [field: string]: unknown;
}
