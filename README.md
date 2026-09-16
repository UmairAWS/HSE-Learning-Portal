# HSE Learning Portal & NEBOSH IG1 Platform — Backend & Developer Documentation

Welcome to the **HSE Learning Portal**, an interactive educational application designed for Occupational Health, Safety & Environment (HSE) professionals and NEBOSH International General Certificate (IG1) candidates. 

This document serves as the developer documentation detailing the backend architecture, API endpoints, Gemini AI integration, Progressive Web App (PWA) installation features, and offline operational modes.

---

## 1. Architectural Overview

The application utilizes a full-stack design combining an Express backend server with a Vite + React 19 single-page application (SPA):

- **Development Mode (`npm run dev`)**:
  - The server boots via `tsx server.ts`.
  - Express mounts Vite as internal middleware (`createViteServer({ server: { middlewareMode: true }, appType: "spa" })`), providing instant code compilation and development serving on port `3000`.
- **Production Mode (`npm run build` & `npm run start`)**:
  - `vite build` produces optimized static client assets in `dist/`.
  - `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs` compiles the backend TypeScript server into a self-contained CommonJS artifact.
  - Express serves the compiled static files from `dist/` and acts as fallback handler for SPA client routing (`GET *`).

```
┌────────────────────────────────────────────────────────┐
│                   Client Browser / PWA                 │
│  - React 19 + Tailwind CSS                             │
│  - Service Worker (Workbox precache & offline mode)    │
│  - Local Storage state persistence                     │
└───────────────────────────▲────────────────────────────┘
                            │ HTTP / JSON
┌───────────────────────────▼────────────────────────────┐
│              Express Backend (server.ts)               │
│  - REST API routes (/api/*)                            │
│  - In-memory cloud sync store (syncStore)              │
│  - NEBOSH P.E.E. rubric evaluator                      │
│  - Dual-model Gemini AI pipeline                       │
└───────────────────────────▲────────────────────────────┘
                            │ Server-to-Server
┌───────────────────────────▼────────────────────────────┐
│           Google Gemini API (@google/genai)            │
│  - Primary: gemini-3.8-flash                           │
│  - Fallback: gemini-3.6-flash                          │
└────────────────────────────────────────────────────────┘
```

---

## 2. Environment Variables

All sensitive credentials and environment configurations are managed exclusively server-side.

| Variable | Required | Description |
| :--- | :---: | :--- |
| `GEMINI_API_KEY` | Optional | Google Gemini API key used by the P.E.E. evaluator and AI Tutor. If omitted or quota is exceeded, the server automatically degrades gracefully to rule-based heuristic engines. |
| `PORT` | Optional | Port on which Express binds (defaults to `3000`). |
| `NODE_ENV` | Optional | Set to `production` when deployed; defaults to development. |
| `DISABLE_HMR` | Optional | Managed by the AI Studio environment to disable live hot reloading during automated coding turns. |

### Configuration File (`.env`)
```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

---

## 3. Backend REST API Endpoints

All API endpoints are defined in `server.ts` before the Vite middleware or static file handlers.

### 3.1 Health Check
Verifies server uptime and timestamp.

- **Route**: `GET /api/health`
- **Response**:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-09-15T13:30:00.000Z"
  }
  ```

---

### 3.2 Cloud Sync Endpoints

Enables students to back up their study progress, exam scores, flashcard masteries, and custom notes using a portable 6-character sync code.

#### Save Progress
- **Route**: `POST /api/sync/save`
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "syncCode": "NEB-784",
    "data": {
      "name": "Alex Mercer",
      "xp": 820,
      "level": 2,
      "streakDays": 8,
      "completedQuestionIds": ["q_el1_1", "q_el3_1"],
      "attempts": []
    }
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Progress saved to cloud sync"
  }
  ```
- **Error Response** (`400 Bad Request`):
  ```json
  {
    "error": "syncCode and data are required"
  }
  ```

#### Load Progress
- **Route**: `GET /api/sync/load/:code`
- **Example**: `GET /api/sync/load/NEB-784`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": { ... },
    "updatedAt": "2026-09-15T13:28:10.000Z"
  }
  ```
- **Error Response** (`404 Not Found`):
  ```json
  {
    "error": "Sync code not found or expired"
  }
  ```

---

### 3.3 AI Open-Book Exam (OBE) Evaluator

Evaluates student open-text answers against NEBOSH Marking Principles and the **P.E.E.** technique (*Point*, *Evidence*, *Explanation*).

- **Route**: `POST /api/ai/evaluate-pee`
- **Request Body**:
  ```json
  {
    "question": "With reference to the scenario only, outline why the company should improve its health and safety management system.",
    "scenario": "Full scenario story text...",
    "answer": "Point: The employer failed in their moral and statutory duty under ILO C155. Evidence: Forklift trucks operated without audible warning devices or segregated pedestrian walkways. Explanation: This failure directly exposed warehouse operatives to fatal crushing risks and financial liabilities.",
    "maxMarks": 10
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "marksAwarded": 8.5,
    "pointScore": 3,
    "evidenceScore": 3,
    "explanationScore": 2.5,
    "verdict": "Distinction",
    "strengths": [
      "Identified statutory breach under ILO C155 Art. 16.",
      "Directly referenced lack of forklift audible alarms and pedestrian segregation."
    ],
    "areasForImprovement": [
      "Expand on uninsured financial consequences (10:1 iceberg ratio)."
    ],
    "modelPEEExample": "Point: The employer failed in their moral duty of care under ILO C155. Evidence: The scenario notes the forklift was reversing without an audible alarm. Explanation: This exposed warehouse workers to fatal crush risks.",
    "detailedFeedback": "Strong structure following the P.E.E. format with clear evidence citations."
  }
  ```

#### Evaluation Fallback Engine:
If `GEMINI_API_KEY` is not provided, the API service is unavailable, or the user is working offline, the system triggers the built-in rule-based evaluation heuristic:
1. Validates presence of **Point** keywords (`duty`, `law`, `moral`, `hazard`, `ilo`, `c155`, etc.).
2. Validates presence of **Evidence** keywords (`scenario`, `forklift`, `worker`, `floor`, `injury`, etc.).
3. Validates presence of **Explanation** keywords (`because`, `therefore`, `consequence`, `prevent`, `lead to`, etc.).
4. Analyzes word count thresholds (concise, target, comprehensive).
5. Awards proportional scores and actionable improvement suggestions.

---

### 3.4 AI Tutor & Study Cohort Chat

Interactive question answering with Dr. Phelpstead (Lead HSE Tutor and CMIOSH Chartered Safety Practitioner).

- **Route**: `POST /api/ai/chat`
- **Request Body**:
  ```json
  {
    "messages": [
      { "role": "user", "content": "What is the uninsured loss iceberg ratio?" }
    ],
    "userContext": { "element": 1, "weakTopics": ["Iceberg Ratio"] }
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "reply": "The Uninsured Loss Iceberg represents how hidden uninsured costs (sick pay, lost production, investigation time, criminal fines) outweigh insured direct costs by roughly 10:1 (up to 36x). Remember: criminal fines can NEVER be insured!"
  }
  ```

---

## 4. Progressive Web App (PWA) & Offline Architecture

The HSE Learning Portal is engineered to function as an installable Progressive Web App with 100% offline study support.

### 4.1 PWA Configuration (`vite-plugin-pwa`)
Configured in `vite.config.ts`:
- **Auto-Update Service Worker**: Service worker automatically registers, caches assets, and reloads gracefully when updates are deployed.
- **Web App Manifest**:
  - `id`: `/`
  - `name`: `HSE Learning Portal`
  - `short_name`: `HSE Portal` (<= 12 characters to prevent truncation on mobile home screens)
  - `display`: `standalone` (removes browser chrome for native app look & feel)
  - `start_url`: `/`
  - `theme_color`: `#0f172a`
  - `background_color`: `#0f172a`
- **Compliant Icons (`/public`)**:
  - `icon.svg`: Vector icon for high-DPI displays.
  - `pwa-192x192.png`: Chromium/Android standard launcher.
  - `pwa-512x512.png`: High-resolution splash screen.
  - `pwa-maskable-512x512.png`: Maskable icon with 15% safe-zone padding.
  - `apple-touch-icon.png`: 180x180 PNG required for iOS Safari home screen.
  - `favicon.ico`: 64x64 browser tab icon.

### 4.2 In-App Install Prompting
- **Chromium / Edge / Android**:
  - Captured via `beforeinstallprompt` in `usePWAInstall.ts`.
  - Triggers the native installation dialogue directly via `PWAInstallButton.tsx`.
- **iOS Safari**:
  - Detects WebKit mobile environment.
  - Displays modal guidance: *Tap Share -> Add to Home Screen*.
- **Standalone Mode Detection**:
  - Automatically checks `window.matchMedia('(display-mode: standalone)')`.
  - Replaces "Install" buttons with an active "App Installed" badge.

### 4.3 Offline Capabilities
- **Precached Assets**: HTML, CSS, JavaScript bundles, Lexend/Plus Jakarta Sans web fonts, and SVG icons are cached by Workbox via the Service Worker.
- **Offline Flashcards & Spaced Repetition**: Flashcards and SM-2 interval calculations run client-side.
- **Offline Chapter Simulations**: All 4 interactive models (10:1 Cost Iceberg, Policy Builder, 5x5 Dynamic Risk Matrix, and 5 Whys Root Cause Chain) execute completely offline.
- **Offline Quiz Engine**: Full 40+ NEBOSH IG1 multiple-choice questions with answers and rationales stored locally.
- **Offline P.E.E. Grading**: If network connectivity drops, the client automatically executes local rubric heuristics so students can continue scenario practice uninterrupted.
- **Offline Indicator Banner**: `<OfflineIndicator />` alerts users when offline and confirms cached features remain active.

---

## 5. Development & Build Scripts

The following commands are defined in `package.json`:

```bash
# Start development server with Vite middleware on port 3000
npm run dev

# Compile client SPA and bundle backend to dist/server.cjs
npm run build

# Run production CommonJS server
npm run start

# Type check codebase
npm run lint

# Clean build artifacts
npm run clean
```

---

## 6. Directory Structure

```
├── .env.example              # Documented environment variables template
├── metadata.json             # AI Studio app metadata & permissions
├── package.json              # Dependencies and build scripts
├── server.ts                 # Express custom backend server & AI integration
├── tsconfig.json             # TypeScript compiler settings & PWA types
├── vite.config.ts            # Vite bundler, Tailwind v4, & VitePWA plugin
├── public/
│   ├── apple-touch-icon.png  # iOS Safari home screen icon (180x180)
│   ├── favicon.ico           # Browser tab favicon
│   ├── icon.svg              # HSE safety shield SVG logo
│   ├── pwa-192x192.png       # Android / Desktop PWA icon
│   ├── pwa-512x512.png       # High-res PWA icon
│   └── pwa-maskable-512x512.png # Maskable icon with safe zone
├── scripts/
│   └── generate-icons.js     # Programmatic icon generator
└── src/
    ├── App.tsx               # Main application container
    ├── main.tsx              # React DOM entry point
    ├── types.ts              # TypeScript domain types & interfaces
    ├── components/
    │   ├── Navbar.tsx        # Top navigation & PWA install trigger
    │   ├── MobileNav.tsx     # Mobile bottom bar
    │   ├── OfflineIndicator.tsx # Offline status banner
    │   ├── PWAInstallButton.tsx # 1-click install action
    │   ├── PWAInstallModal.tsx  # PWA & offline diagnostic hub
    │   ├── OBEExamSimulator.tsx # Case scenario P.E.E. grading lab
    │   ├── SimulationsHub.tsx   # 4 interactive chapter simulations
    │   ├── DashboardView.tsx    # Student mission control
    │   ├── FlashcardsView.tsx   # Spaced repetition engine
    │   ├── QuizView.tsx         # Rapid revision multiple choice
    │   ├── StudyGroupChat.tsx   # Live study room & AI tutor
    │   └── simulations/         # Interactive simulation subcomponents
    ├── context/
    │   └── ReaderContext.tsx    # Lexend reading optimizer state
    └── hooks/
        ├── useOnlineStatus.ts   # Network connectivity detector
        └── usePWAInstall.ts     # PWA beforeinstallprompt lifecycle hook
```

---

## 7. Security & Best Practices

- **Zero Client-Side Secrets**: All Gemini API calls are securely proxied through Express routes; API keys are never exposed to client bundles.
- **Sanitized Inputs**: All incoming JSON payloads are checked for size boundaries (`10mb`) and typed parameters.
- **Fail-Safe Fallbacks**: Quota limits or network outages never result in white screens; fallback heuristics take over automatically.
