import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// In-memory sync store (maps 6-digit syncCode to user study profile & progress)
const syncStore = new Map<string, { updatedAt: string; data: any }>();

// Optional Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Model fallback list (gemini-3.8-flash per guidelines, gemini-3.6-flash as fallback)
const GEMINI_MODELS = ["gemini-3.8-flash", "gemini-3.6-flash"];

async function generateContentWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
  }
) {
  let lastError: any = null;
  for (const model of GEMINI_MODELS) {
    try {
      return await ai.models.generateContent({
        ...params,
        model,
      });
    } catch (err: any) {
      lastError = err;
      const isNotFound =
        err?.status === 404 ||
        err?.message?.includes("404") ||
        err?.message?.includes("not available") ||
        err?.message?.includes("not found");
      if (isNotFound) {
        console.warn(`Model ${model} unavailable, trying fallback...`);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Sync endpoints
app.post("/api/sync/save", (req, res) => {
  try {
    const { syncCode, data } = req.body;
    if (!syncCode || !data) {
      return res.status(400).json({ error: "syncCode and data are required" });
    }
    syncStore.set(syncCode.trim().toUpperCase(), {
      updatedAt: new Date().toISOString(),
      data,
    });
    return res.json({ success: true, message: "Progress saved to cloud sync" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to save sync" });
  }
});

app.get("/api/sync/load/:code", (req, res) => {
  try {
    const code = req.params.code.trim().toUpperCase();
    const entry = syncStore.get(code);
    if (!entry) {
      return res.status(404).json({ error: "Sync code not found or expired" });
    }
    return res.json({ success: true, data: entry.data, updatedAt: entry.updatedAt });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to retrieve sync" });
  }
});

// P.E.E. Evaluation Endpoint
app.post("/api/ai/evaluate-pee", async (req, res) => {
  const { question, scenario, answer, maxMarks = 10 } = req.body;
  
  if (!answer || !answer.trim()) {
    return res.status(400).json({ error: "Answer cannot be empty" });
  }

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are a certified NEBOSH IG1 Open-Book Exam (OBE) Examiner.
Evaluate the student's answer based on the NEBOSH Marking Principles and the P.E.E. Technique:
- P: Point (Clear statement of health & safety concept, legal duty, or hazard)
- E: Evidence (Direct quote or fact from the scenario)
- E: Explanation (Why the evidence supports the point, connection to ILO C155/R164 or practical impact)

Scenario:
"""${scenario || "Workplace safety scenario"}"""

Exam Question:
"""${question}"""

Student's Submitted Answer:
"""${answer}"""

Maximum Marks Available: ${maxMarks}

Return your response strictly in JSON format matching this schema:
{
  "marksAwarded": number (between 0 and ${maxMarks}),
  "pointScore": number,
  "evidenceScore": number,
  "explanationScore": number,
  "verdict": "Distinction" | "Credit" | "Pass" | "Referral",
  "strengths": ["string"],
  "areasForImprovement": ["string"],
  "modelPEEExample": "string (A model 1-2 sentence P.E.E. paragraph illustrating how to gain full marks)",
  "detailedFeedback": "string"
}`;

      const response = await generateContentWithFallback(ai, {
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    } catch (err) {
      console.error("Gemini PEE evaluation failed, falling back to heuristic evaluation:", err);
    }
  }

  // Fallback Rule-based NEBOSH Evaluator
  const words = answer.trim().split(/\s+/);
  const wordCount = words.length;
  const lower = answer.toLowerCase();

  const hasPoint = /point|duty|law|moral|financial|legal|hazard|risk|standard|employer|control|responsibility|c155|r164/i.test(lower);
  const hasEvidence = /evidence|scenario|worker|vehicle|driver|manager|states|indicated|floor|injury|accident/i.test(lower);
  const hasExplanation = /because|therefore|explanation|consequence|prevent|lead to|fine|prosecution|recurrence|reason/i.test(lower);

  let score = 0;
  if (wordCount >= 20) score += 2;
  if (wordCount >= 60) score += 2;
  if (hasPoint) score += 2;
  if (hasEvidence) score += 2;
  if (hasExplanation) score += 2;

  score = Math.min(score, maxMarks);
  const verdict = score >= 8 ? "Distinction" : score >= 6 ? "Credit" : score >= 4.5 ? "Pass" : "Referral";

  const strengths = [];
  const areasForImprovement = [];

  if (hasPoint) strengths.push("Identified key health and safety principles.");
  else areasForImprovement.push("Make your initial statement (Point) more explicit using clear safety terminology.");

  if (hasEvidence) strengths.push("Directly linked observations to evidence in the scenario.");
  else areasForImprovement.push("Quote specific facts or actions directly from the scenario (Evidence).");

  if (hasExplanation) strengths.push("Provided reasoning explaining the consequences and legal/moral implications.");
  else areasForImprovement.push("Elaborate on 'WHY' and 'HOW' this impacts the organisation (Explanation).");

  if (wordCount < 40) {
    areasForImprovement.push(`Your answer is concise (${wordCount} words). For a ${maxMarks}-mark question, aim for 80-150 words.`);
  }

  return res.json({
    marksAwarded: score,
    pointScore: hasPoint ? Math.round(maxMarks * 0.3) : 1,
    evidenceScore: hasEvidence ? Math.round(maxMarks * 0.3) : 1,
    explanationScore: hasExplanation ? Math.round(maxMarks * 0.4) : 1,
    verdict,
    strengths: strengths.length ? strengths : ["Attempted the scenario task."],
    areasForImprovement,
    modelPEEExample: "Point: The employer failed in their moral and legal duty of care under ILO C155 Art. 16. Evidence: The scenario notes the forklift was reversing without an audible alarm or banksman. Explanation: This failure directly exposed warehouse workers to fatal crush risks, risking criminal enforcement and severe compensation claims.",
    detailedFeedback: `You demonstrated understanding of the core concept. ${score >= 4.5 ? "Good application of the scenario facts." : "Focus on connecting the specific story details to NEBOSH regulations and the 3 pillars."}`,
  });
});

// Chat AI / Exam Tutor Endpoint
app.post("/api/ai/chat", async (req, res) => {
  const { messages, userContext } = req.body;
  const lastUserMsg = messages?.[messages.length - 1]?.content || "";

  const ai = getGeminiClient();

  if (ai) {
    try {
      const systemInstruction = `You are Dr. Phelpstead, an expert NEBOSH IG1 Lead Tutor & CMIOSH Chartered Safety Practitioner.
You help students prepare for the NEBOSH International General Certificate Unit IG1 (Management of Health & Safety).
You provide clear, encouraging, technically accurate answers referencing:
- Element 1: Moral, Financial (Iceberg 10:1), Legal reasons, ILO C155 & R164, Contractor management (Select, Plan, Monitor).
- Element 2: Health & Safety Management Systems (ILO-OSH 2001, ISO 45001, PDCA cycle, Policy parts: Intent, Organisation, Arrangements).
- Element 3: Culture, Human factors, 5 steps of Risk Assessment, Hierarchy of control (Elimination, Substitution, Engineering, Admin, PPE), SSW & PTW systems.
- Element 4: Active vs Reactive monitoring, Safety inspections/sampling/tours (4 Ps), Incident investigations (immediate vs root causes, 5 Whys), Auditing vs inspections.
- Open Book Exam (OBE) guidance: Command words (Identify, Outline, Discuss, Explain) and P.E.E. technique.
Keep answers concise, pedagogical, and easy to apply on mobile.`;

      const response = await generateContentWithFallback(ai, {
        contents: [
          { role: "user", parts: [{ text: `${systemInstruction}\n\nUser Context: ${JSON.stringify(userContext || {})}\n\nStudent says: "${lastUserMsg}"` }] }
        ],
        config: {
          temperature: 0.6,
        }
      });

      return res.json({ reply: response.text });
    } catch (err) {
      console.error("Gemini chat error:", err);
    }
  }

  // Smart fallback response
  const lower = lastUserMsg.toLowerCase();
  let reply = "That's an important topic in NEBOSH IG1! Remember to always link theoretical safety management back to practical workplace scenarios, using the P.E.E. (Point, Evidence, Explanation) method.";

  if (lower.includes("pee") || lower.includes("technique")) {
    reply = "The P.E.E. technique is vital for NEBOSH Open-Book Exams! 🎯\n• Point: State the clear H&S principle or regulation.\n• Evidence: Pull direct facts from the exam story.\n• Explanation: Explain WHY it matters and its legal/moral/financial impact. 1 mark = 1 solid P.E.E. point!";
  } else if (lower.includes("iceberg") || lower.includes("cost") || lower.includes("financial")) {
    reply = "The Uninsured Loss Iceberg represents how hidden uninsured costs (sick pay, lost production, investigation time, criminal fines) outweigh insured direct costs by roughly 10:1 (up to 36x). Remember: criminal fines can NEVER be insured!";
  } else if (lower.includes("hierarchy") || lower.includes("control")) {
    reply = "The General Hierarchy of Control follows 5 strict tiers:\n1. Elimination (remove the hazard)\n2. Substitution (replace with lower risk)\n3. Engineering controls (guards, extraction, enclosure)\n4. Administrative controls (SSW, permits, training, job rotation)\n5. PPE (last line of defence, safe person).";
  } else if (lower.includes("audit") || lower.includes("inspection")) {
    reply = "Great question! An Inspection checks physical conditions (The 4 Ps: Plant, Premises, People, Procedures) at an operational level. An Audit systematically examines the ENTIRE management system through paperwork, interviews, and observations to assess validity and compliance.";
  } else if (lower.includes("permit") || lower.includes("ptw")) {
    reply = "A Permit-to-Work (PTW) is a formal documented procedure for high-risk jobs (hot work, confined spaces, high voltage, work at height, machinery maintenance). Key sections: Issue, Receipt, Clearance, and Cancellation.";
  }

  return res.json({ reply });
});

// Vite Middleware for Development / Static in Production
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NEBOSH IG1 App Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
