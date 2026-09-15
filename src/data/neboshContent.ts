import { ElementInfo, QuizQuestion, Badge } from "../types";

export const NEBOSH_ELEMENTS: ElementInfo[] = [
  {
    id: 1,
    title: "Chapter 1: Why We Should Manage Workplace Health and Safety",
    shortTitle: "Why Manage H&S",
    description: "Moral, financial, and legal justifications, ILO standards (C155 & R164), and contractor management.",
    topics: [
      "Moral, Financial & Legal Pillars",
      "ILO Statistics & Global Burden",
      "ILO Conventions C155 & R164",
      "Direct vs. Indirect & Insured vs. Uninsured Costs (Iceberg)",
      "Employer & Worker Duties and Rights",
      "Contractor Management (Select, Plan, Monitor)",
      "Shared Workspaces & Co-operation"
    ],
    color: "from-rose-500 to-red-600",
  },
  {
    id: 2,
    title: "Chapter 2: How Health and Safety Management Systems Work",
    shortTitle: "H&S Systems & Policy",
    description: "Plan-Do-Check-Act cycle, ILO-OSH 2001, ISO 45001, and the three-part Health & Safety Policy.",
    topics: [
      "Plan-Do-Check-Act (PDCA) Cycle",
      "ILO-OSH 2001 vs. ISO 45001 Frameworks",
      "Health & Safety Policy: General Statement of Intent",
      "Organisation Section: Roles & Responsibilities",
      "Arrangements Section: General & Specific Controls",
      "SMART Safety Objectives & Benchmarking",
      "Circumstances Requiring Policy Reviews"
    ],
    color: "from-sky-500 to-blue-600",
  },
  {
    id: 3,
    title: "Chapter 3: Managing Risk – Understanding People and Processes",
    shortTitle: "Managing Risk & People",
    description: "Safety culture, human factors, 5 steps of risk assessment, hierarchy of control, SSW, PTW, and emergency response.",
    topics: [
      "Health & Safety Culture & Indicators",
      "Human Factors: Organisational, Job, Individual",
      "5 Steps of Risk Assessment",
      "Risk Profiling & 5x5 Risk Matrix",
      "General Hierarchy of Risk Control",
      "Vulnerable Workers (Young, Expectant Mothers, Disabled, Lone)",
      "Safe Systems of Work (SREDIM) & Permits-to-Work (PTW)",
      "Emergency Procedures & First Aid (The 3 Ps)"
    ],
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: 4,
    title: "Chapter 4: Health and Safety Monitoring and Measuring",
    shortTitle: "Monitoring & Measuring",
    description: "Active vs. reactive monitoring, inspections (4 Ps), accident investigation (immediate & root causes), and auditing.",
    topics: [
      "Active vs. Reactive Monitoring (Leading vs. Lagging)",
      "Safety Inspections, Sampling & Tours (The 4 Ps)",
      "Lost-Time Accident Frequency Rate Formula",
      "Accident Investigation (Gather, Analyse, Control, Plan)",
      "Immediate Causes (Unsafe Acts/Conditions) vs Root Causes (5 Whys)",
      "RIDDOR & External Incident Reporting",
      "Health & Safety Auditing vs. Inspections",
      "Management Performance Reviews"
    ],
    color: "from-amber-500 to-orange-600",
  },
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: "first_quiz",
    title: "First Steps",
    description: "Completed your first HSE curriculum assessment",
    icon: "GraduationCap",
    unlockedAt: new Date().toISOString(),
  },
  {
    id: "pee_pro",
    title: "P.E.E. Strategist",
    description: "Successfully scored 8+ marks in a Practical Scenario task using Point-Evidence-Explanation",
    icon: "Target",
  },
  {
    id: "risk_master",
    title: "Risk Evaluator",
    description: "Mastered the 5 steps of risk assessment and Hierarchy of Control in Chapter 3",
    icon: "ShieldAlert",
  },
  {
    id: "iceberg_ace",
    title: "Cost Detective",
    description: "Discovered all 10:1 hidden uninsured accident losses in Chapter 1",
    icon: "DollarSign",
  },
  {
    id: "streak_7",
    title: "7-Day Study Streak",
    description: "Maintained a consistent daily revision habit for 7 consecutive days",
    icon: "Flame",
  },
  {
    id: "audit_inspector",
    title: "Certified Auditor",
    description: "Completed the Chapter 4 Audit vs. Inspection Challenge with 100% accuracy",
    icon: "FileCheck",
  },
  {
    id: "badge_flashcard_srs",
    title: "SRS Memory Master",
    description: "Practiced 10+ legal definitions and terminology cards with spaced-repetition recall",
    icon: "BrainCircuit",
  },
];

export const NEBOSH_QUESTIONS: QuizQuestion[] = [
  // --- ELEMENT 1: WHY MANAGE H&S ---
  {
    id: "q1_1",
    elementId: 1,
    subtopic: "Moral, Financial & Legal Pillars",
    type: "multiple-choice",
    question: "According to the UK Health and Safety Executive (HSE), what is the estimated ratio between hidden uninsured accident costs and insured direct costs?",
    options: [
      "1 to 1 (Insured costs roughly equal uninsured costs)",
      "Roughly 10 to 1 (Uninsured losses are 8 to 36 times greater)",
      "1 to 10 (Insured costs are 10 times higher)",
      "50 to 1 (Insured costs are negligible)"
    ],
    correctIndex: 1,
    explanation: "The HSE estimates that hidden uninsured losses (sick pay, downtime, recruitment, investigation, lost product, and uninsurable criminal court fines) average roughly 10 times greater than insured costs (ranging from 8 to 36 times). This is known as the 'uninsured loss iceberg'.",
    reference: "HSE Chapter 1 Curriculum Guide, p. 1-5; 'The Uninsured Loss Iceberg'"
  },
  {
    id: "q1_2",
    elementId: 1,
    subtopic: "Consequences of Non-Compliance",
    type: "multiple-choice",
    question: "Which of the following losses resulting from a serious workplace health and safety breach CANNOT be legally covered by an insurance policy?",
    options: [
      "Employer liability compensation payout to an injured worker",
      "Building and machinery repair costs following a fire",
      "Criminal fines imposed by a court of law against the company or director",
      "Civil legal defence fees"
    ],
    correctIndex: 2,
    explanation: "Criminal fines cannot be insured against by law in any jurisdiction because insurance would negate the punitive deterrent effect of criminal prosecution.",
    reference: "HSE Chapter 1 Curriculum Guide, p. 1-5"
  },
  {
    id: "q1_3",
    elementId: 1,
    subtopic: "ILO Standards & Conventions",
    type: "multiple-choice",
    question: "Under Article 19 of ILO Convention C155, what critical emergency right is granted to all individual workers?",
    options: [
      "The right to choose their own working hours",
      "The right to refuse to wear uncomfortable PPE",
      "The right to leave a workplace that presents an imminent, serious danger to their life without being penalized",
      "The right to appoint their own external safety inspector"
    ],
    correctIndex: 2,
    explanation: "Article 19 of ILO C155 guarantees workers the right to remove themselves from a work situation which they have reasonable justification to believe presents an imminent and serious danger to their life or health, without being penalized.",
    reference: "HSE Chapter 1 Curriculum Guide, p. 1-9; 'ILO Responsibilities & Rights'"
  },
  {
    id: "q1_4",
    elementId: 1,
    subtopic: "Contractor Management",
    type: "multiple-choice",
    question: "What are the three essential, sequential stages that a client must follow when managing contractors?",
    options: [
      "Hiring, Supervising, Disciplining",
      "Selection, Planning & Co-ordination, Monitoring & Managing",
      "Tendering, Paying, Auditing",
      "Induction, Risk Assessment, Certification"
    ],
    correctIndex: 1,
    explanation: "Good health and safety practice splits contractor management into 3 key stages: (1) Selection (checking safety competence, accident history, qualifications), (2) Planning & Co-ordination (exchanging hazard info, reviewing method statements), and (3) Monitoring & Managing (site inductions, sign-in, PTW, routine inspections).",
    reference: "HSE Chapter 1 Curriculum Guide, p. 1-16; 'Managing Contractors'"
  },
  {
    id: "q1_obe_1",
    elementId: 1,
    subtopic: "Financial Business Case (Practical Scenario)",
    type: "obe-scenario",
    commandWord: "Explain",
    marks: 10,
    question: "Based on the scenario, prepare briefing notes explaining the financial arguments (direct and indirect costs) to convince the new manager why this incident must be properly investigated.",
    scenario: "You have been appointed as the competent health and safety adviser. A worker employed by a newly appointed manager was struck by a reversing delivery vehicle in the yard, suffering a fractured leg requiring hospital treatment and a 2-month absence. The vehicle also damaged the perimeter roller shutter door. The manager is reluctant to investigate, arguing that 'accidents happen, insurance covers it, and we are too busy hitting production quotas'.",
    explanation: "In a practical scenario assessment, you must classify costs into Direct (measurable, immediate) and Indirect (hidden, consequential), linking each point directly to the reversing vehicle, injured worker, and damaged roller shutter.",
    reference: "HSE Chapter 1 Assessment Skills Guide, p. 1-24 & 1-25",
    modelAnswer: "Direct Costs:\n1. First aid and hospital emergency transport costs for the worker with the fractured leg.\n2. Sick pay for the worker during their 2-month recuperation period.\n3. Physical repair costs for the damaged vehicle bumper and the perimeter roller shutter door.\n4. Overtime payments to existing warehouse staff to cover the absent worker's shifts.\n5. Civil compensation claims submitted by the injured worker for pain and loss of earnings.\n\nIndirect Costs:\n6. Time spent by managers and supervisors conducting incident investigations and drafting reports.\n7. Severe loss of morale and heightened anxiety among remaining warehouse staff who witnessed the collision.\n8. Cost and time required to recruit and train temporary replacement personnel.\n9. Disruption to delivery schedules and customer order delays while the damaged bay door was inoperative.\n10. Risk of enforcement notice and criminal fines from the authorities, which cannot be recovered by insurance.",
    peeChecklist: {
      point: "State whether the cost is direct (immediate, measurable) or indirect (hidden consequential).",
      evidence: "Cite facts from the scenario (reversing delivery vehicle, fractured leg, 2-month absence, broken roller shutter door).",
      explanation: "Explain why this cost impacts the company's financial bottom line and cannot be brushed off by insurance."
    }
  },

  // --- ELEMENT 2: H&S MANAGEMENT SYSTEMS & POLICY ---
  {
    id: "q2_1",
    elementId: 2,
    subtopic: "Policy Structure",
    type: "multiple-choice",
    question: "What are the three fundamental sections of an effective Health and Safety Policy?",
    options: [
      "Introduction, Body, and Conclusion",
      "General Statement of Intent, Organisation Section, and Arrangements Section",
      "Policy, Risk Assessment, and Disciplinary Procedures",
      "Strategic Vision, Operational Tactics, and Financial Allocation"
    ],
    correctIndex: 1,
    explanation: "A standard H&S policy is composed of: (1) General Statement of Intent (overall philosophy, signed by CEO/MD), (2) Organisation Section (chain of command, roles, responsibilities), and (3) Arrangements Section (practical details of how risks like fire, first aid, DSE, chemicals are managed).",
    reference: "HSE Chapter 2 Curriculum Guide, p. 2-9; 'Policy Core Structure'"
  },
  {
    id: "q2_2",
    elementId: 2,
    subtopic: "SMART Safety Objectives",
    type: "multiple-choice",
    question: "Which of the following represents a properly formulated 'SMART' health and safety objective?",
    options: [
      "'Improve safety culture across the factory as much as possible'",
      "'Encourage all workers to wear PPE at all times'",
      "'Review all 48 workplace risk assessments within a 12-month period'",
      "'Eliminate every accident in the organisation forever'"
    ],
    correctIndex: 2,
    explanation: "SMART stands for Specific, Measurable, Achievable, Reasonable, and Time-bound. 'Review all 48 workplace risk assessments within a 12-month period' has an exact metric (48), a measurable outcome, an achievable target, and a clear deadline (12 months).",
    reference: "HSE Chapter 2 Curriculum Guide, p. 2-10 & 2-11"
  },
  {
    id: "q2_3",
    elementId: 2,
    subtopic: "Policy Review Triggers",
    type: "multiple-choice",
    question: "Which of the following events would NOT automatically trigger a formal review of an organisation's Health and Safety Policy?",
    options: [
      "The appointment of a new Chief Executive Officer (CEO)",
      "A routine minor employee dispute over car parking spaces",
      "The introduction of new hazardous machinery or chemical processes",
      "Enforcement action or Improvement Notice issued by a safety inspector"
    ],
    correctIndex: 1,
    explanation: "Policy review triggers include: organizational changes (new CEO/MD), technological changes, legal changes, major accidents/audits, enforcement action, or passage of time (annually). Minor parking disputes do not trigger a policy review.",
    reference: "HSE Chapter 2 Curriculum Guide, p. 2-14"
  },
  {
    id: "q2_obe_1",
    elementId: 2,
    subtopic: "Policy Communication & Safety Targets (Practical Scenario)",
    type: "obe-scenario",
    commandWord: "Outline",
    marks: 10,
    question: "Based on the scenario, outline reasons why the Managing Director must establish quantifiable safety targets and ensure the H&S policy is brought to the attention of all workers.",
    scenario: "You review your company's H&S documentation and find that the policy was created 8 years ago by a former director, uploaded to an obscure intranet folder, and never mentioned during induction. A worker survey reveals that 94% of employees have never seen it. The Managing Director asks: 'Why do we need specific targets and why make a fuss about everyone reading the policy if accidents are rare?'",
    explanation: "Use the P.E.E. technique. Highlight ILO Recommendation R164 Art. 14, leadership commitment, benchmarking, and employee engagement.",
    reference: "HSE Chapter 2 Assessment Skills Guide, p. 2-17 & 2-18",
    modelAnswer: "1. Legal Requirement (ILO R164): Under ILO Recommendation R164, employers must bring the written policy and arrangements to the attention of every worker in a language they readily understand; keeping it buried on the intranet violates this standard.\n2. Demonstrates Visible Leadership: When the MD signs and communicates quantifiable targets, it signals top-level commitment to safety rather than mere lip service.\n3. Drives Continual Improvement: Targets (e.g. reducing lost-time accidents by 15%) provide a measurable benchmark to monitor whether safety systems are actually succeeding.\n4. Promotes Worker Ownership: Involving employees in working towards safety milestones motivates safe behavior and prevents complacency.\n5. Enables Resource Prioritisation: Setting targets allows management to identify deficient areas and allocate funding and training where risk is highest.",
    peeChecklist: {
      point: "Identify the principle (ILO R164 compliance, visible leadership, SMART benchmarking).",
      evidence: "Cite the 8-year-old policy and the 94% of workers unaware on the intranet.",
      explanation: "Explain how quantifiable targets prevent accidents and foster a proactive culture."
    }
  },

  // --- CHAPTER 3: MANAGING RISK ---
  {
    id: "q3_1",
    elementId: 3,
    subtopic: "Hierarchy of Control",
    type: "multiple-choice",
    question: "According to ISO 45001 and ILO-OSH 2001, what is the correct order of the General Hierarchy of Risk Control (from most effective to least effective)?",
    options: [
      "PPE -> Administrative controls -> Engineering controls -> Substitution -> Elimination",
      "Elimination -> Substitution -> Engineering controls -> Administrative controls -> PPE",
      "Engineering controls -> Elimination -> Substitution -> PPE -> Administrative controls",
      "Administrative controls -> Engineering controls -> Substitution -> Elimination -> PPE"
    ],
    correctIndex: 1,
    explanation: "The hierarchy is: 1. Elimination (completely remove hazard), 2. Substitution (replace with less hazardous), 3. Engineering controls (enclosures, guards, LEV), 4. Administrative controls (SSW, permits, training, job rotation), 5. PPE (personal protective equipment, safe person last resort).",
    reference: "HSE Chapter 3 Curriculum Guide, p. 3-34; 'Hierarchy of Control'"
  },
  {
    id: "q3_2",
    elementId: 3,
    subtopic: "Risk Assessment Steps",
    type: "multiple-choice",
    question: "What are the 5 standard steps of a general workplace risk assessment?",
    options: [
      "1. Inspect, 2. Punish, 3. Calculate cost, 4. Notify HSE, 5. Settle claims",
      "1. Identify hazards, 2. Decide who might be harmed and how, 3. Evaluate risks & decide precautions, 4. Record significant findings & implement, 5. Review & update",
      "1. Check policy, 2. Interview witnesses, 3. Test equipment, 4. Issue PPE, 5. File records",
      "1. Select task, 2. Plan method, 3. Execute, 4. Check, 5. Act"
    ],
    correctIndex: 1,
    explanation: "The widely recognized 5 steps (GB HSE / ISO 45001) are: Step 1: Identify hazards; Step 2: Identify who might be harmed and how; Step 3: Evaluate risk and decide on precautions; Step 4: Record findings and implement; Step 5: Review and update.",
    reference: "HSE Chapter 3 Curriculum Guide, p. 3-28"
  },
  {
    id: "q3_3",
    elementId: 3,
    subtopic: "Permits-to-Work (PTW)",
    type: "multiple-choice",
    question: "Which four key operational sections must be present on a standard Permit-to-Work (PTW) document?",
    options: [
      "Proposal, Budget, Execution, Invoicing",
      "Issue, Receipt, Clearance / Return to Service, Cancellation",
      "Hazard identification, Severity calculation, PPE list, Signature",
      "Safety briefing, Tool inspection, Daily log, Supervisor audit"
    ],
    correctIndex: 1,
    explanation: "A standard permit sequence requires: (1) Issue (authorising manager specifies work, hazards, precautions, duration), (2) Receipt (competent workers confirm understanding), (3) Clearance (workers state area safe and work complete), and (4) Cancellation (manager verifies isolations removed and accepts handback).",
    reference: "HSE Chapter 3 Curriculum Guide, p. 3-54 & 3-55"
  },
  {
    id: "q3_4",
    elementId: 3,
    subtopic: "First Aid Principles",
    type: "multiple-choice",
    question: "What are the 'Three Ps' that define the fundamental objectives of workplace first aiders?",
    options: [
      "People, Premises, and Procedures",
      "Preserve life, Prevent deterioration, and Promote recovery",
      "Plan, Perform, and Protect",
      "Provide bandages, Phone emergency, and Pacify casualty"
    ],
    correctIndex: 1,
    explanation: "The primary role of a first aider is summarized as the Three Ps: Preserve life, Prevent deterioration (stop conditions from getting worse), and Promote recovery (aid healing until medical professionals arrive).",
    reference: "HSE Chapter 3 Curriculum Guide, p. 3-62"
  },
  {
    id: "q3_obe_1",
    elementId: 3,
    subtopic: "Emergency Preparedness & Fire Drills (Practical Scenario)",
    type: "obe-scenario",
    commandWord: "Discuss",
    marks: 10,
    question: "Based on the scenario, prepare an email to the Facilities Manager discussing why emergency fire evacuation procedures must be regularly practiced.",
    scenario: "During an audit of a 4-storey commercial office, you notice that the fire evacuation plan has not been practiced for over two years. The Facilities Manager resists scheduling a drill, arguing: 'It interrupts client calls, causes panic among staff, and everyone knows where the stairs are anyway.'",
    explanation: "Use the P.E.E. technique to provide multiple distinct, scenario-linked arguments: testing alarm audibility, identifying blocked routes, testing vulnerable worker arrangements (PEEPs), familiarising staff so actions become automatic, and meeting legal/insurance duties.",
    reference: "HSE Chapter 3 Assessment Skills Guide, p. 3-69 & 3-70",
    modelAnswer: "1. Automatic Behaviour under Stress: Practicing drills transforms conscious procedures into automatic reactions, substantially reducing panic and hesitation during a genuine emergency.\n2. Verification of Alarm Audibility: Sounding the alarm tests whether sounders and strobes can be clearly heard across all 4 floors above background office equipment noise.\n3. Evacuation of Vulnerable Persons: A practice drill validates personal emergency evacuation plans (PEEPs) for pregnant employees or mobility-impaired visitors.\n4. Route Validation & Obstruction Detection: Drills reveal whether escape routes, fire doors, or exit stairs have become blocked by deliveries or locked.\n5. Role Practice for Fire Wardens: Appointed fire marshals need hands-on practice conducting floor sweeps and reporting roll calls at the designated assembly point.\n6. Legal & Insurer Compliance: ILO C155 and regional fire regulations mandate periodic testing; failure to practice can void fire insurance policies.",
    peeChecklist: {
      point: "State the specific rationale (e.g. panic reduction, testing alarm audibility, fire warden practice).",
      evidence: "Mention the 4-storey office, 2-year lapse, and employee resistance from the scenario.",
      explanation: "Explain how failing to drill leads to fatalities, regulatory fines, or insurance invalidation."
    }
  },

  // --- CHAPTER 4: MONITORING & MEASURING ---
  {
    id: "q4_1",
    elementId: 4,
    subtopic: "Active vs Reactive Monitoring",
    type: "multiple-choice",
    question: "Which of the following is classified as an ACTIVE (Leading) monitoring measure rather than a REACTIVE (Lagging) measure?",
    options: [
      "Lost-time accident frequency rate for the past quarter",
      "Analysis of worker sickness and absence statistics",
      "Weekly planned supervisor safety inspection of machine guards and PPE",
      "Total civil compensation claims paid out to injured personnel"
    ],
    correctIndex: 2,
    explanation: "Active monitoring (leading indicator) checks compliance and physical conditions BEFORE an incident occurs (e.g. weekly safety inspection). Reactive monitoring (lagging indicator) measures events that have already occurred (accidents, sickness, claims).",
    reference: "HSE Chapter 4 Curriculum Guide, p. 4-4 & 4-9"
  },
  {
    id: "q4_2",
    elementId: 4,
    subtopic: "General Workplace Inspections",
    type: "multiple-choice",
    question: "When conducting a general workplace safety inspection, what are 'The Four Ps' that inspectors typically examine?",
    options: [
      "Profits, Policies, Payroll, and Paperwork",
      "Plant, Premises, People, and Procedures",
      "Plan, Prepare, Prevent, and Protect",
      "Police, Paramedics, Practitioners, and Principals"
    ],
    correctIndex: 1,
    explanation: "Workplace inspections systematically examine 'The Four Ps': Plant (machinery, tools, vehicles), Premises (floors, lighting, environment), People (worker behavior, PPE use), and Procedures (SSW, permits, checklists).",
    reference: "HSE Chapter 4 Curriculum Guide, p. 4-5"
  },
  {
    id: "q4_3",
    elementId: 4,
    subtopic: "Auditing vs Inspections",
    type: "multiple-choice",
    question: "What is the primary conceptual difference between a Safety Inspection and a Health & Safety Audit?",
    options: [
      "Inspections are expensive while audits are completely free",
      "An inspection checks physical workplace conditions and hazards at an operational level; an audit systematically evaluates the effectiveness of the entire management system through paperwork, interviews, and observations",
      "Inspections are carried out by courts while audits are carried out by employees",
      "Audits only look at financial records whereas inspections only look at first aid boxes"
    ],
    correctIndex: 1,
    explanation: "An inspection is a straightforward operational check for uncontrolled hazards. An audit is a structured, systematic, critical evaluation of the total health & safety management system (examining policy, records, training, and strategic compliance).",
    reference: "HSE Chapter 4 Curriculum Guide, p. 4-26 & 4-38"
  },
  {
    id: "q4_obe_1",
    elementId: 4,
    subtopic: "Accident Investigation & Root Causes (Practical Scenario)",
    type: "obe-scenario",
    commandWord: "Explain",
    marks: 10,
    question: "Based on the scenario, explain the immediate and root causes of the reversing vehicle accident, and justify why a full investigation is essential rather than blaming the driver.",
    scenario: "You are the safety officer for a municipal council with 50 refuse collection workers. A driver reversed a 15-tonne refuse truck into a parked car in the depot yard, smashing the tailgate. The depot manager conducted a 'minimal 5-minute review', concluded 'the driver was careless', and threatened disciplinary dismissal. At the safety committee, worker reps claim the yard lighting was broken for 3 weeks, mirrors were cracked, and the reversing camera had failed two weeks prior.",
    explanation: "Distinguish between immediate causes (unsafe acts/conditions) and underlying/root causes (management system failures, lack of maintenance, no pre-use checks).",
    reference: "HSE Chapter 4 Assessment Skills Guide, p. 4-18 & Final Reminders p. 5-6",
    modelAnswer: "Immediate Causes:\n1. Unsafe Act: The driver reversed without utilizing a banksman / reversing assistant.\n2. Unsafe Condition: Defective reversing camera and cracked mirrors restricted driver visibility.\n3. Unsafe Condition: Poor yard illumination caused by broken overhead lighting for 3 weeks.\n\nRoot / Underlying Causes (Management System Failings):\n4. Inadequate Planned Preventive Maintenance (PPM): Vehicles were operating with reported camera and mirror defects without being repaired or tagged out.\n5. Deficient Workplace Inspection Regime: Management failed to identify or replace failed yard lighting over a 3-week span.\n6. Blame Culture: The manager's instinct to dismiss the driver fosters under-reporting of near misses.\n7. Lack of Safe System of Work (SSW): No mandatory traffic management segregation or reversing banksman policy.\n\nJustification for Reopening Investigation:\n8. Preventing Fatalities: While this event resulted in property damage, the next reversing vehicle could crush a pedestrian or fellow loader.\n9. Moral & Legal Duty: ILO C155 mandates safe plant and lighting; ignoring root causes exposes the council to criminal prosecution.",
    peeChecklist: {
      point: "Separate immediate causes (unsafe acts & conditions) from root management failures.",
      evidence: "Cite the refuse truck, broken yard lights (3 weeks), broken camera, cracked mirror, and manager's quick blame.",
      explanation: "Explain how failing to address root causes leads directly to catastrophic worker fatality."
    }
  }
];

// Modern descriptive aliases for standard HSE terminology
export const HSE_CHAPTERS = NEBOSH_ELEMENTS;
export const HSE_QUESTIONS = NEBOSH_QUESTIONS;
