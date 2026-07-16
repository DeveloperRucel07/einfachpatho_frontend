import { useState } from "react";
import type { QuizQuestion } from "../types/api";
import { formatBoldText } from "../utils/richText";

const OPTION_LETTERS = ["A", "B", "C", "D", "E"];

interface QuizQuestionItemProps {
  question: QuizQuestion;
  index: number;
  selected: number | null;
  onSelect: (optionIndex: number) => void;
}

function QuizQuestionItem({ question, index, selected, onSelect }: QuizQuestionItemProps) {
  return (
    <li className="quiz-question">
      <p className="quiz-question-text">
        <span className="quiz-question-number">{index + 1}.</span> {formatBoldText(question.question)}
      </p>
      <div className="quiz-options">
        {question.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = i === question.correct_index;
          const showState = selected !== null;

          let stateClass = "";
          if (showState && isSelected && isCorrect) stateClass = "quiz-option-correct";
          else if (showState && isSelected && !isCorrect) stateClass = "quiz-option-wrong";
          else if (showState && isCorrect) stateClass = "quiz-option-correct-muted";

          return (
            <button
              type="button"
              key={i}
              className={`quiz-option ${stateClass}`}
              onClick={() => onSelect(i)}
              disabled={showState}
            >
              <span className="quiz-option-letter">{OPTION_LETTERS[i] ?? i + 1}</span>
              {formatBoldText(option)}
            </button>
          );
        })}
      </div>
      {selected !== null && question.explanation && (
        <p className="quiz-explanation">{formatBoldText(question.explanation)}</p>
      )}
    </li>
  );
}

export function QuizBlock({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));

  if (questions.length === 0) return null;

  const answeredCount = answers.filter((a) => a !== null).length;
  const correctCount = questions.reduce(
    (sum, q, i) => sum + (answers[i] === q.correct_index ? 1 : 0),
    0
  );
  const isComplete = answeredCount === questions.length;

  function handleSelect(questionIndex: number, optionIndex: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });
  }

  function handleReset() {
    setAnswers(questions.map(() => null));
  }

  return (
    <div className="quiz-block">
      <div className="quiz-score-bar">
        <span className={`quiz-score-badge ${isComplete ? "is-complete" : ""}`}>
          {correctCount}/{questions.length} Punkte
        </span>
        {isComplete && (
          <button type="button" className="btn btn-ghost quiz-reset-btn" onClick={handleReset}>
            Nochmal versuchen
          </button>
        )}
      </div>

      <ol className="quiz-list">
        {questions.map((q, i) => (
          <QuizQuestionItem
            key={q.id ?? i}
            question={q}
            index={i}
            selected={answers[i]}
            onSelect={(optionIndex) => handleSelect(i, optionIndex)}
          />
        ))}
      </ol>
    </div>
  );
}
