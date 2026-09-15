import React, { useState } from "react";
import { NEBOSH_QUESTIONS } from "../data/neboshContent";
import { QuizQuestion } from "../types";
import {
  FileText,
  Send,
  Loader2,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Clock,
  Target,
  Quote,
  Plus,
  Highlighter,
  SlidersHorizontal,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useReaderSettings } from "../context/ReaderContext";

interface EvaluationResult {
  marksAwarded: number;
  pointScore: number;
  evidenceScore: number;
  explanationScore: number;
  verdict: "Distinction" | "Credit" | "Pass" | "Referral";
  strengths: string[];
  areasForImprovement: string[];
  modelPEEExample: string;
  detailedFeedback: string;
}

// Key scenario evidence facts catalog for interactive student discovery
const SCENARIO_KEY_FACTS: Record<
  string,
  Array<{ phrase: string; category: "injury" | "hazard" | "management" | "lapse"; label: string }>
> = {
  q1_obe_1: [
    { phrase: "reversing delivery vehicle in the yard", category: "hazard", label: "Transport Hazard" },
    {
      phrase: "fractured leg requiring hospital treatment and a 2-month absence",
      category: "injury",
      label: "Major Lost-Time Injury",
    },
    { phrase: "damaged the perimeter roller shutter door", category: "hazard", label: "Direct Property Damage" },
    { phrase: "manager is reluctant to investigate", category: "management", label: "Leadership Deficit" },
    {
      phrase: "'accidents happen, insurance covers it, and we are too busy hitting production quotas'",
      category: "management",
      label: "Uninsured Iceberg Misconception",
    },
  ],
  q2_obe_1: [
    { phrase: "created 8 years ago by a former director", category: "lapse", label: "Outdated Policy" },
    { phrase: "uploaded to an obscure intranet folder", category: "lapse", label: "Inaccessible Arrangement" },
    { phrase: "never mentioned during induction", category: "lapse", label: "Induction Omission" },
    { phrase: "94% of employees have never seen it", category: "lapse", label: "Worker Disconnect (94%)" },
    { phrase: "'accidents are rare'", category: "management", label: "Complacent Mindset" },
  ],
  q3_obe_1: [
    { phrase: "4-storey commercial office", category: "hazard", label: "Multi-Storey Premises" },
    { phrase: "has not been practiced for over two years", category: "lapse", label: "2-Year Drill Gap" },
    {
      phrase: "'interrupts client calls, causes panic among staff, and everyone knows where the stairs are anyway'",
      category: "management",
      label: "Facilities Resistance",
    },
  ],
  q4_obe_1: [
    { phrase: "15-tonne refuse truck into a parked car in the depot yard", category: "hazard", label: "Vehicle Collision" },
    { phrase: "smashing the tailgate", category: "injury", label: "Property Impact" },
    { phrase: "minimal 5-minute review", category: "management", label: "Superficial Check" },
    { phrase: "'the driver was careless'", category: "management", label: "Blame Culture" },
    { phrase: "threatened disciplinary dismissal", category: "management", label: "Punitive Approach" },
    { phrase: "yard lighting was broken for 3 weeks", category: "lapse", label: "Broken Lighting (3 Wks)" },
    { phrase: "mirrors were cracked", category: "hazard", label: "Defective Plant (Mirrors)" },
    { phrase: "reversing camera had failed two weeks prior", category: "hazard", label: "Defective Plant (Camera)" },
  ],
};

export default function OBEExamSimulator() {
  const obeQuestions = NEBOSH_QUESTIONS.filter((q) => q.type === "obe-scenario");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(obeQuestions[0]?.id || "");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [useGuidedPee, setUseGuidedPee] = useState<boolean>(true);

  // Reader Settings integration
  const { fontSize, lineSpacing, highlightKeyTerms, setHighlightKeyTerms } = useReaderSettings();

  // Guided PEE input fields
  const [guidedP, setGuidedP] = useState("");
  const [guidedE1, setGuidedE1] = useState("");
  const [guidedE2, setGuidedE2] = useState("");

  const question: QuizQuestion | undefined = obeQuestions.find((q) => q.id === selectedQuestionId);

  // Word counter
  const textToCount = useGuidedPee
    ? `${guidedP} ${guidedE1} ${guidedE2}`.trim()
    : userAnswer.trim();
  const wordCount = textToCount ? textToCount.split(/\s+/).length : 0;

  const handleApplyGuidedToText = () => {
    const combined = `Point:\n${guidedP}\n\nEvidence from Scenario:\n${guidedE1}\n\nExplanation & Impact:\n${guidedE2}`;
    setUserAnswer(combined);
    setUseGuidedPee(false);
  };

  const handleInsertFactToEvidence = (factText: string) => {
    if (useGuidedPee) {
      setGuidedE1((prev) => (prev ? `${prev}; ${factText}` : factText));
    } else {
      setUserAnswer((prev) => (prev ? `${prev} (Evidence: "${factText}")` : `Evidence from scenario: "${factText}"`));
    }
  };

  const handleSubmitEvaluation = async () => {
    const submissionText = useGuidedPee
      ? `Point: ${guidedP}\nEvidence: ${guidedE1}\nExplanation: ${guidedE2}`
      : userAnswer;

    if (!submissionText.trim()) return;

    setIsEvaluating(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai/evaluate-pee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question?.question,
          scenario: question?.scenario,
          answer: submissionText,
          maxMarks: question?.marks || 10,
        }),
      });

      const data = await res.json();
      setResult(data);

      if (data.marksAwarded >= 7) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error("Evaluation error:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Render scenario with optional student evidence highlighting
  const renderScenarioContent = () => {
    if (!question) return null;

    const facts = SCENARIO_KEY_FACTS[question.id] || [];

    if (!highlightKeyTerms || facts.length === 0) {
      return (
        <div className="study-prose text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
          <p className="italic bg-amber-500/5 dark:bg-amber-950/25 p-4 sm:p-5 rounded-xl border border-amber-500/20 text-slate-800 dark:text-slate-100 font-medium">
            &ldquo;{question.scenario}&rdquo;
          </p>
        </div>
      );
    }

    // Interactive highlighted scenario
    let renderedText: React.ReactNode = question.scenario;
    // We can highlight matches sequentially
    return (
      <div className="space-y-3">
        <div className="bg-amber-500/5 dark:bg-amber-950/25 p-4 sm:p-5 rounded-xl border border-amber-500/20 study-prose text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-relaxed font-medium">
          &ldquo;
          {facts.reduce<React.ReactNode[]>((acc, fact, index) => {
            // Simplified highlight match for educational evidence
            return acc;
          }, [])}
          {/* We render the text with key facts highlighted */}
          {(() => {
            const raw = question.scenario;
            // Split based on known phrases
            const sortedFacts = [...facts].sort((a, b) => b.phrase.length - a.phrase.length);
            
            // Build regex of phrases
            const escapedPhrases = sortedFacts.map((f) =>
              f.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            );
            const regex = new RegExp(`(${escapedPhrases.join("|")})`, "gi");
            const parts = raw.split(regex);

            return parts.map((part, i) => {
              const matchedFact = sortedFacts.find(
                (f) => f.phrase.toLowerCase() === part.toLowerCase()
              );

              if (matchedFact) {
                const categoryColors = {
                  injury: "bg-rose-500/20 text-rose-800 dark:text-rose-200 border-rose-500/40 hover:bg-rose-500/30",
                  hazard: "bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-500/40 hover:bg-amber-500/30",
                  management: "bg-indigo-500/20 text-indigo-900 dark:text-indigo-200 border-indigo-500/40 hover:bg-indigo-500/30",
                  lapse: "bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border-emerald-500/40 hover:bg-emerald-500/30",
                };

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleInsertFactToEvidence(part)}
                    className={`inline-flex items-baseline gap-1 mx-0.5 px-1.5 py-0.5 rounded-md border font-semibold text-left transition cursor-pointer shadow-2xs group ${
                      categoryColors[matchedFact.category]
                    }`}
                    title={`Evidence: ${matchedFact.label} (Click to insert into Evidence answer)`}
                  >
                    <span>{part}</span>
                    <Plus className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity self-center shrink-0" />
                  </button>
                );
              }

              return <span key={i}>{part}</span>;
            });
          })()}
          &rdquo;
        </div>

        {/* Highlight evidence helper chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Scenario Evidence Facts:
          </span>
          {facts.map((fact, idx) => (
            <button
              key={idx}
              onClick={() => handleInsertFactToEvidence(fact.phrase)}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition flex items-center gap-1"
              title="Click to insert into Evidence input"
            >
              <span>+ {fact.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Header Banner - Compact & Modern */}
      <div className="px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white border border-slate-700/60 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Case Scenario Simulator
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" /> Open Book Exam (OBE) Standard
            </span>
          </div>
          <h2 className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-white">
            Practical Scenario &amp; P.E.E. Assessment Engine
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            State the principle (<strong>Point</strong>), cite facts from the scenario (<strong>Evidence</strong>), and explain consequences (<strong>Explanation</strong>).
          </p>
        </div>

        {/* Quick Reader Switcher in banner */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setHighlightKeyTerms(!highlightKeyTerms)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
              highlightKeyTerms
                ? "bg-emerald-500 text-white border-emerald-400 shadow-sm"
                : "bg-white/10 text-slate-200 hover:bg-white/20 border-white/20"
            }`}
            title="Highlight key empirical evidence facts in scenario"
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span>{highlightKeyTerms ? "Facts Highlighted" : "Highlight Facts"}</span>
          </button>
        </div>
      </div>

      {/* Scenario Question Selector - Compact & Clean */}
      <div className="flex flex-wrap gap-1.5">
        {obeQuestions.map((q) => (
          <button
            key={q.id}
            onClick={() => {
              setSelectedQuestionId(q.id);
              setResult(null);
              setUserAnswer("");
              setGuidedP("");
              setGuidedE1("");
              setGuidedE2("");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 border ${
              selectedQuestionId === q.id
                ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                : "bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center text-[9px] font-bold">
              E{q.elementId}
            </span>
            <span>{q.subtopic}</span>
            <span className="text-[10px] opacity-75 font-normal">({q.marks} marks)</span>
          </button>
        ))}
      </div>

      {question && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Scenario & Command Word Guide */}
          <div className="lg:col-span-6 space-y-3.5">
            {/* Scenario Story Box with readable format */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-3">
              <div className="flex justify-between items-center pb-1 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Workplace Scenario Case Story
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Chapter {question.elementId}
                  </span>
                </div>
              </div>

              {/* Enhanced Readable Scenario Content */}
              {renderScenarioContent()}
            </div>

            {/* Exam Task & Command Word Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-2.5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Exam Task Question
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white mt-0.5 leading-snug">
                    {question.question}
                  </h3>
                </div>
                <span className="px-2 py-1 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold text-xs shrink-0">
                  {question.marks} Marks
                </span>
              </div>

              {/* Command Word Pill */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <div className="font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> Command Word: &quot;{question.commandWord}&quot;
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {question.commandWord === "Explain" &&
                    "Provide clear reasoning answering HOW and WHY something happened or is required. Simply listing bullet points will lose marks."}
                  {question.commandWord === "Outline" &&
                    "Give a structured summary of the key features or general principles without deep technical elaboration."}
                  {question.commandWord === "Discuss" &&
                    "Give a critical account looking at different facets (moral, legal, and operational perspectives)."}
                  {question.commandWord === "Identify" &&
                    "Select and name concisely with direct reference to the scenario."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Answer Input & Real-Time Feedback */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
              {/* Input Mode Selector */}
              <div className="flex justify-between items-center">
                <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                  <button
                    onClick={() => setUseGuidedPee(true)}
                    className={`px-3 py-1 rounded text-xs font-bold transition ${
                      useGuidedPee
                        ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                    }`}
                  >
                    Guided P.E.E. Scaffold
                  </button>
                  <button
                    onClick={() => setUseGuidedPee(false)}
                    className={`px-3 py-1 rounded text-xs font-bold transition ${
                      !useGuidedPee
                        ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                    }`}
                  >
                    Full Exam Essay
                  </button>
                </div>

                <div className="text-xs text-slate-500">
                  Words: <strong className="text-slate-800 dark:text-slate-200">{wordCount}</strong> / ~150-300
                </div>
              </div>

              {useGuidedPee ? (
                <div className="space-y-3 text-xs">
                  {/* Point */}
                  <div>
                    <label className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 mb-1">
                      <span className="w-4 h-4 rounded bg-rose-500 text-white flex items-center justify-center text-[10px]">P</span>
                      [P] Point (State the core safety principle, regulation, or legal breach):
                    </label>
                    <textarea
                      rows={2}
                      value={guidedP}
                      onChange={(e) => setGuidedP(e.target.value)}
                      placeholder="e.g. The employer breached their statutory duty of care under ILO C155 by failing to maintain safe plant..."
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>

                  {/* Evidence */}
                  <div>
                    <label className="font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 mb-1">
                      <span className="w-4 h-4 rounded bg-sky-500 text-white flex items-center justify-center text-[10px]">E</span>
                      [E] Evidence (Quote exact facts or actions from the scenario above):
                    </label>
                    <textarea
                      rows={2}
                      value={guidedE1}
                      onChange={(e) => setGuidedE1(e.target.value)}
                      placeholder="e.g. The scenario states the vehicle had broken lighting for 3 weeks and the reversing camera was inoperable..."
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1">
                      <span className="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px]">E</span>
                      [E] Explanation (Why does this matter? What is the impact on workers / business?):
                    </label>
                    <textarea
                      rows={3}
                      value={guidedE2}
                      onChange={(e) => setGuidedE2(e.target.value)}
                      placeholder="e.g. This restricted the driver's field of vision, meaning pedestrians were at fatal crush risk. An investigation is essential to address management's maintenance failure..."
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>

                  <button
                    onClick={handleApplyGuidedToText}
                    className="text-[11px] text-sky-500 hover:underline font-semibold"
                  >
                    Combine into freeform essay &rarr;
                  </button>
                </div>
              ) : (
                <div>
                  <textarea
                    rows={9}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Write your complete answer here. Use distinct numbered paragraphs, each structured with Point, Evidence, and Explanation..."
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs leading-relaxed font-sans placeholder:text-slate-400"
                  />
                </div>
              )}

              {/* Submit Evaluation Button */}
              <button
                onClick={handleSubmitEvaluation}
                disabled={isEvaluating || wordCount < 10}
                className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Assessing Against HSE Marking Rubric...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Submit Answer for P.E.E. Marking ({question.marks} Marks)
                  </>
                )}
              </button>
            </div>

            {/* Evaluation Results Card */}
            {result && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 shadow-lg space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      HSE Assessment Verdict
                    </span>
                    <div className="text-xl font-black text-slate-900 dark:text-white">
                      {result.verdict}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Marks Awarded
                    </span>
                    <div className="text-2xl font-black text-rose-500">
                      {result.marksAwarded} / {question.marks}
                    </div>
                  </div>
                </div>

                {/* Subscore Pills */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
                    <div className="text-[10px] font-semibold text-rose-700 dark:text-rose-300">Point Score</div>
                    <div className="font-bold text-slate-900 dark:text-white">{result.pointScore} / 3</div>
                  </div>
                  <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900">
                    <div className="text-[10px] font-semibold text-sky-700 dark:text-sky-300">Evidence Score</div>
                    <div className="font-bold text-slate-900 dark:text-white">{result.evidenceScore} / 3</div>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                    <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">Explanation Score</div>
                    <div className="font-bold text-slate-900 dark:text-white">{result.explanationScore} / 4</div>
                  </div>
                </div>

                {/* Strengths & Improvement */}
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Strengths:
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-300 pl-1 text-[11px]">
                      {result.strengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Areas for Improvement:
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-300 pl-1 text-[11px]">
                      {result.areasForImprovement.map((a, idx) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Model PEE comparison */}
                <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 space-y-1.5 text-xs">
                  <div className="font-bold text-amber-400 text-[11px] uppercase tracking-wide">
                    Examiner Model P.E.E. Anchor:
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans italic">
                    &quot;{result.modelPEEExample}&quot;
                  </p>
                </div>

                {/* Full Model Answer toggle */}
                <details className="text-xs text-slate-500 cursor-pointer pt-2">
                  <summary className="font-bold text-rose-500 hover:underline">
                    View Full Official Model Answer Outline
                  </summary>
                  <div className="mt-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 whitespace-pre-line text-[11px] text-slate-700 dark:text-slate-300 font-sans leading-relaxed border border-slate-200 dark:border-slate-800">
                    {question.modelAnswer}
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
