import React, { useState } from "react";
import { NEBOSH_QUESTIONS, NEBOSH_ELEMENTS } from "../data/neboshContent";
import { QuizQuestion, ElementId } from "../types";
import { CheckCircle, XCircle, Bookmark, BookmarkCheck, ArrowRight, RotateCcw, Award, BrainCircuit } from "lucide-react";
import confetti from "canvas-confetti";

interface QuizViewProps {
  onQuestionCompleted: (questionId: string, isCorrect: boolean, elementId: ElementId) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (questionId: string) => void;
  onNavigateToFlashcards?: () => void;
}

export default function QuizView({
  onQuestionCompleted,
  bookmarkedIds,
  onToggleBookmark,
  onNavigateToFlashcards,
}: QuizViewProps) {
  const [selectedElementFilter, setSelectedElementFilter] = useState<ElementId | 0>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Filter only multiple choice questions for this fast quiz mode
  const filteredQuestions = NEBOSH_QUESTIONS.filter(
    (q) =>
      q.type === "multiple-choice" &&
      (selectedElementFilter === 0 || q.elementId === selectedElementFilter)
  );

  const currentQuestion: QuizQuestion | undefined = filteredQuestions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);

    const isCorrect = idx === currentQuestion?.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
    }

    if (currentQuestion) {
      onQuestionCompleted(currentQuestion.id, isCorrect, currentQuestion.elementId);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
      if (score + (selectedOption === currentQuestion?.correctIndex ? 1 : 0) >= filteredQuestions.length * 0.7) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Element Filter Pills - Wrap so all chapters are accessible on any screen without horizontal scroll */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-1">
        <button
          onClick={() => {
            setSelectedElementFilter(0);
            restartQuiz();
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition select-none active:scale-95 ${
            selectedElementFilter === 0
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300"
          }`}
        >
          All Chapters ({NEBOSH_QUESTIONS.filter((q) => q.type === "multiple-choice").length})
        </button>
        {NEBOSH_ELEMENTS.map((el) => (
          <button
            key={el.id}
            onClick={() => {
              setSelectedElementFilter(el.id);
              restartQuiz();
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition select-none active:scale-95 ${
              selectedElementFilter === el.id
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300"
            }`}
          >
            Chapter {el.id}
          </button>
        ))}
      </div>

      {!quizFinished && currentQuestion ? (
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-3.5 sm:p-6 md:p-7 shadow-sm space-y-3.5 sm:space-y-5">
          {/* Header Bar */}
          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                Chapter {currentQuestion.elementId}
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {currentQuestion.subtopic}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-medium">
                Question {currentIndex + 1} of {filteredQuestions.length}
              </span>
              <button
                onClick={() => onToggleBookmark(currentQuestion.id)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-amber-500 transition"
                title="Bookmark for review"
              >
                {bookmarkedIds.includes(currentQuestion.id) ? (
                  <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Text */}
          <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options?.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctIndex;

              let optionStyle =
                "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-800 dark:text-slate-200";

              if (showExplanation) {
                if (isCorrect) {
                  optionStyle =
                    "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500";
                } else if (isSelected) {
                  optionStyle =
                    "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 ring-1 ring-rose-500";
                } else {
                  optionStyle = "opacity-50 border-slate-200 dark:border-slate-800 text-slate-400";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showExplanation}
                  className={`w-full p-4 rounded-xl border text-left text-xs md:text-sm font-medium transition flex items-start gap-3.5 ${optionStyle}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-snug">{option}</span>
                  {showExplanation && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  )}
                  {showExplanation && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                  Examiner&apos;s Rational &amp; Syllabus Context:
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentQuestion.explanation}
              </p>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200 dark:border-slate-800">
                Official Syllabus Citation: {currentQuestion.reference}
              </div>
            </div>
          )}

          {/* Action Footer */}
          {showExplanation && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="py-2.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs md:text-sm flex items-center gap-2 transition shadow-md"
              >
                {currentIndex + 1 < filteredQuestions.length ? "Next Question" : "Finish Assessment"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Complete Card */
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-8 text-center max-w-md mx-auto space-y-5 shadow-lg">
          <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Assessment Completed!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Here is how you performed against HSE competency standards:
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
              {Math.round((score / (filteredQuestions.length || 1)) * 100)}%
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
              {score} of {filteredQuestions.length} Questions Correct
            </div>
            <div className="text-[11px] font-bold mt-2">
              {(score / (filteredQuestions.length || 1)) >= 0.45 ? (
                <span className="text-emerald-500">✅ HSE Pass Standard Met (Benchmark &ge;45%)</span>
              ) : (
                <span className="text-rose-500">❌ Further Review Advised (Benchmark is 45%). Review weak areas below!</span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              onClick={restartQuiz}
              className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition w-full"
            >
              <RotateCcw className="w-4 h-4" />
              Restart Assessment
            </button>
            {onNavigateToFlashcards && (
              <button
                onClick={onNavigateToFlashcards}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition w-full"
              >
                <BrainCircuit className="w-4 h-4" />
                Practice Terminology Flashcards
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
