import { GlossaryTerm } from "../types";

export const HSE_GLOSSARY_DATA: GlossaryTerm[] = [
  // ==========================================
  // CHAPTER 1: WHY WE SHOULD MANAGE HEALTH & SAFETY
  // ==========================================
  {
    id: "sfarp",
    term: "So Far As Is Reasonably Practicable (SFARP)",
    acronym: "SFARP / SFAIRP",
    chapter: 1,
    category: "Legal & Duties",
    summary:
      "A qualified legal duty requiring the employer to balance the quantum of risk against the sacrifice (time, money, physical effort) needed to avert it.",
    fullDefinition:
      "Under common law (Edwards v National Coal Board, 1949) and statutory standards like HASWA 1974 s.2, SFARP places the burden of proof on the employer. The employer must implement preventative control measures unless the sacrifice (cost, time, and trouble) is grossly disproportionate to the magnitude of the risk averted.",
    keyFormulaOrBreakdown:
      "Risk Quantum vs. Sacrifice (Time + Trouble + Cost). Presumption is always weighted heavily in favour of health and safety.",
    practicalHseExample:
      "Fitting interlocking interlocks onto a high-speed packaging conveyor costs £3,500 and takes 4 hours, averting severe hand amputations. The sacrifice is NOT grossly disproportionate, so the employer is legally obligated to install it.",
    examinerDistinction:
      "Do NOT say 'if it's too expensive the employer doesn't have to do it'. The legal hurdle requires gross disproportion, not mere economic inconvenience.",
    relatedTermIds: ["strict-liability", "negligence", "duty-of-care"],
  },
  {
    id: "strict-liability",
    term: "Strict Liability (Absolute Duty)",
    acronym: "Absolute Duty",
    chapter: 1,
    category: "Legal & Duties",
    summary:
      "An unconditional statutory duty where compliance is mandatory regardless of cost, difficulty, or absence of fault.",
    fullDefinition:
      "An absolute legal requirement typically denoted in statutory legislation by the words 'shall' or 'must' without qualifying phrases such as 'so far as is reasonably practicable'. An offence occurs automatically once the prohibited state of affairs exists, irrespective of whether the employer acted diligently or had wrongful intent.",
    keyFormulaOrBreakdown:
      "Strict Liability = Offence committed on occurrence of fact. No balancing test; financial or operational defenses are inadmissible.",
    practicalHseExample:
      "Statutory regulations requiring thorough statutory examination of passenger lifts or pressure vessels every 6 or 14 months are absolute. Postponing because the engineering contractor is busy or expensive is a criminal violation.",
    examinerDistinction:
      "Never confuse with qualified duties. If a regulation states 'all dangerous machinery parts shall be securely fenced', cost arguments cannot be raised.",
    relatedTermIds: ["sfarp", "duty-of-care"],
  },
  {
    id: "duty-of-care",
    term: "Employer's Common Law Duty of Care",
    acronym: "Duty of Care",
    chapter: 1,
    category: "Legal & Duties",
    summary:
      "The legal obligation of an employer to take reasonable care to protect workers from foreseeable harm across 5 core aspects.",
    fullDefinition:
      "Established under Wilsons & Clyde Coal Co v English (1938). The employer owes a personal, non-delegable duty of care to each employee comprising: (1) Safe place of work with safe access/egress; (2) Safe plant, machinery, and equipment; (3) Safe systems of work; (4) Safe and competent fellow employees; and (5) Adequate training, instruction, and supervision.",
    keyFormulaOrBreakdown:
      "The 5 Pillars: Safe Place • Safe Plant • Safe Systems • Safe Colleagues • Safe Training & Supervision.",
    practicalHseExample:
      "Hiring a qualified forklift operator but failing to provide site-specific induction or refresher training breaches the duty to provide adequate supervision and competent staff if an impact occurs.",
    examinerDistinction:
      "The duty is non-delegable. An employer cannot escape liability in civil court by claiming they hired a safety consultant or subcontractor to manage it.",
    relatedTermIds: ["negligence", "vicarious-liability", "competence"],
  },
  {
    id: "negligence",
    term: "Tort of Negligence",
    chapter: 1,
    category: "Legal & Duties",
    summary:
      "A civil wrong consisting of a breach of legal duty of care which causes reasonably foreseeable injury, illness, or loss.",
    fullDefinition:
      "To succeed in a civil compensation claim for negligence, the claimant (injured worker) must satisfy three sequential legal tests on the balance of probabilities: (1) A duty of care was owed by the defendant; (2) That duty was breached by falling below the standard of a reasonable employer; and (3) The breach directly caused the damage/injury (causation), and the harm was reasonably foreseeable.",
    keyFormulaOrBreakdown:
      "Duty of Care + Breach of Standard + Causation of Foreseeable Damage = Actionable Negligence.",
    practicalHseExample:
      "A warehouse operative slips on an uncleaned oil leak reported 48 hours earlier. The employer owed a duty, breached it by ignoring the spill, and directly caused the employee's fractured wrist.",
    examinerDistinction:
      "Remember criminal law punishes the wrongdoing and deters future breaches (fines/imprisonment), whereas civil negligence aims to restore the victim financially via compensatory damages.",
    relatedTermIds: ["duty-of-care", "vicarious-liability"],
  },
  {
    id: "vicarious-liability",
    term: "Vicarious Liability",
    chapter: 1,
    category: "Legal & Duties",
    summary:
      "The legal doctrine holding an employer responsible for the negligent acts or omissions of their employees committed in the course of employment.",
    fullDefinition:
      "Under civil law, an employer is held strictly answerable for the torts of their employees provided the worker was acting within the course and scope of their employment, even if the worker was acting contrary to instructions or in an unauthorized manner.",
    keyFormulaOrBreakdown:
      "Employment Relationship + Tortious Act Committed During Course of Work = Employer Liable.",
    practicalHseExample:
      "A warehouse driver playfully spins a forklift to impress a colleague and strikes a pedestrian worker. The employer is vicariously liable to pay compensation because driving the truck occurred within the course of employment.",
    examinerDistinction:
      "Does not apply if the employee was on a 'frolic of their own' completely unconnected to their contractual work tasks.",
    relatedTermIds: ["negligence", "duty-of-care"],
  },
  {
    id: "iceberg-cost-ratio",
    term: "The Iceberg Cost Model (Insured vs. Uninsured Costs)",
    acronym: "10:1 to 36:1 Ratio",
    chapter: 1,
    category: "Legal & Duties",
    summary:
      "Economic model proving that hidden, uninsured incident losses drastically outweigh direct insured compensation payouts.",
    fullDefinition:
      "Empirical research published by the UK Health and Safety Executive (HSG96 'The Costs of Accidents at Work') demonstrates that for every £1 of insured direct costs (medical bills, compensation claims, building repairs), an organization incurs between £8 and £36 in uninsured indirect costs (downtime, sick pay, overtime, investigation time, replacement hiring, uninsurable court fines, and client loss).",
    keyFormulaOrBreakdown:
      "Insured Direct Costs (Tip: 1x) vs. Uninsured Indirect Losses (Underwater Mass: 8x to 36x). Standard benchmark multiplier = 10x.",
    practicalHseExample:
      "A worker cuts their arm on a bandsaw: Insured ambulance/treatment cost is £1,200. Uninsured losses total £14,500 due to 2 days of line stoppage, 40 hours of management investigation, statutory sick pay, and rush delivery penalties.",
    examinerDistinction:
      "Criminal fines imposed by courts can NEVER be recovered through insurance by law. Fines are 100% uninsured direct financial penalties.",
    relatedTermIds: ["direct-indirect-costs", "afr"],
  },
  {
    id: "direct-indirect-costs",
    term: "Direct vs. Indirect Incident Costs",
    chapter: 1,
    category: "Legal & Duties",
    summary:
      "The classification of incident expenses into immediate measurable damages versus secondary operational consequences.",
    fullDefinition:
      "Direct costs are immediate, quantifiable expenses resulting directly from the incident (e.g., first aid supplies, damaged raw materials, statutory compensation payouts). Indirect costs are secondary operational consequences (e.g., lost production time, incident investigation hours, loss of morale, staff turnover, adverse press, and client contract cancellations).",
    keyFormulaOrBreakdown:
      "Direct Costs = Tangible immediate outlay. Indirect Costs = Systemic operational disruption and loss of goodwill.",
    practicalHseExample:
      "Direct: Replacing a smashed £400 safety screen. Indirect: 6 technicians standing idle for 3 hours (£1,800), plus HSE inspector inspection fees and client audit delays.",
    examinerDistinction:
      "Do not conflate direct/indirect with insured/uninsured. Some direct costs (like insurance deductibles or product spoilage) are uninsured.",
    relatedTermIds: ["iceberg-cost-ratio"],
  },
  {
    id: "ilo-c155-r164",
    term: "ILO Convention C155 & Recommendation R164",
    acronym: "ILO C155 / R164",
    chapter: 1,
    category: "Legal & Duties",
    summary:
      "International labor standards setting national frameworks and workplace employer/worker safety obligations.",
    fullDefinition:
      "The International Labour Organization (ILO) Occupational Safety and Health Convention, 1981 (No. 155) and its accompanying Recommendation (No. 164) establish global benchmarks. Key employer duties: provide safe workplaces, plant, and systems without risk to health. Key worker rights: right to be informed, right to adequate training, and the right to remove oneself from imminent, serious danger without undue penalty.",
    keyFormulaOrBreakdown:
      "C155 Article 16: Employer duties to ensure workplace, machinery, and processes are safe. Article 19: Worker right to halt work in imminent danger.",
    practicalHseExample:
      "Scaffolding workers in heavy 60mph winds refuse to work at height due to severe structural swaying. Under ILO C155 Art. 19, the employer cannot dismiss or penalize them.",
    examinerDistinction:
      "ILO Conventions must be ratified by member states to take effect in domestic statute, whereas Recommendations provide non-binding practical guidance.",
    relatedTermIds: ["duty-of-care", "sfarp"],
  },
  {
    id: "contractor-management",
    term: "Contractor Management Cycle",
    chapter: 1,
    category: "Legal & Duties",
    summary:
      "The 4-stage due-diligence framework to ensure third-party contractors execute work safely on client premises.",
    fullDefinition:
      "A systematic process consisting of: (1) Selection / Pre-qualification (assessing safety policy, insurance, past accident records, qualifications, risk assessments); (2) Planning (sharing site hazard information, joint risk assessments, PTW requirements); (3) Site Induction & Access Control (rules, emergency exits, PPE); and (4) Ongoing Monitoring & Review (auditing work, permit hand-backs, contractor appraisal).",
    keyFormulaOrBreakdown:
      "1. Select & Verify Competence → 2. Plan & Agree Method Statements → 3. Induct & Authorize → 4. Monitor & Review Performance.",
    practicalHseExample:
      "Before hiring a roofing contractor, a factory requests their CHAS/SafeContractor accreditation, public liability insurance, working-at-height method statement, and checks their AFR for the past 3 years.",
    examinerDistinction:
      "Clients cannot abdicate responsibility by pointing to contractor status. If a client knowingly permits dangerous practices on their property, both face prosecution.",
    relatedTermIds: ["competence", "permit-to-work"],
  },
  {
    id: "enforcement-notices",
    term: "Enforcement Notices (Improvement vs. Prohibition)",
    chapter: 1,
    category: "Legal & Duties",
    summary:
      "Statutory statutory powers served by safety inspectors to mandate remediation of legal contraventions or stop imminent danger.",
    fullDefinition:
      "Improvement Notice: Served when an inspector believes statutory law has been or is being breached; specifies the legal contravention and mandates remedy within a minimum of 21 days (suspended if appealed). Prohibition Notice: Served when there is risk of serious personal injury; halts the activity immediately or within a stated time (remains in force even if appealed).",
    keyFormulaOrBreakdown:
      "Improvement Notice = Legal contravention + Remedy deadline (min 21 days) + Suspended on appeal. Prohibition Notice = Serious imminent injury risk + Immediate cessation + NOT suspended on appeal.",
    practicalHseExample:
      "Improvement: Mandating an engineering company conduct noise assessments within 30 days. Prohibition: Immediate stop on workers using a mobile scaffold without guardrails next to an open 4-meter drop.",
    examinerDistinction:
      "A Prohibition Notice does NOT require an actual legal breach to have occurred—only the presence of a risk of serious personal injury.",
    relatedTermIds: ["strict-liability", "sfarp"],
  },

  // ==========================================
  // CHAPTER 2: HOW HEALTH & SAFETY MANAGEMENT SYSTEMS WORK
  // ==========================================
  {
    id: "pdca-cycle",
    term: "Plan-Do-Check-Act (PDCA) Cycle",
    acronym: "PDCA / Deming Cycle",
    chapter: 2,
    category: "Management Systems",
    summary:
      "The iterative four-stage management framework driving continuous improvement in occupational health and safety.",
    fullDefinition:
      "Adopted by UK HSE HSG65 and ISO 45001. PLAN: Formulate safety policy, allocate resources, identify hazards, set SMART objectives. DO: Implement arrangements, communicate, train, execute risk profiles and control measures. CHECK: Active monitoring (inspections) and reactive monitoring (incident investigation, audits). ACT: Management review, identify gaps, implement corrective actions for continual improvement.",
    keyFormulaOrBreakdown:
      "Plan (Policy & Targets) → Do (Organise & Implement) → Check (Monitor & Audit) → Act (Review & Continual Improvement).",
    practicalHseExample:
      "A manufacturing plant notices rising slip incidents. Plan: Target 50% slip reduction. Do: Install anti-slip coatings and clean-as-you-go policy. Check: Review floor audits and slip rate monthly. Act: Modify shoe specification at annual review.",
    examinerDistinction:
      "PDCA is not a linear one-off checklist; it is an endless cycle of feedback and continual improvement.",
    relatedTermIds: ["iso-45001", "hs-policy", "smart-objectives"],
  },
  {
    id: "iso-45001",
    term: "ISO 45001 Occupational Health and Safety Management System",
    acronym: "ISO 45001",
    chapter: 2,
    category: "Management Systems",
    summary:
      "The international standard specifying requirements for an occupational health and safety management system using Annex SL.",
    fullDefinition:
      "Published in 2018 (replacing OHSAS 18001), ISO 45001 employs the high-level Annex SL structure (10 clauses). Emphasizes organizational context, worker participation/consultation, leadership commitment, risk and opportunity management, and proactive procurement/contractor controls.",
    keyFormulaOrBreakdown:
      "Core Clauses: 4 Context • 5 Leadership & Worker Participation • 6 Planning • 7 Support • 8 Operation • 9 Performance Evaluation • 10 Improvement.",
    practicalHseExample:
      "An oil & gas operator achieving ISO 45001 certification must demonstrate that senior board directors personally sign off risk appetite and that non-managerial workers are formally consulted in risk assessments.",
    examinerDistinction:
      "Unlike ILO-OSH 2001 (which is voluntary governmental guidance), ISO 45001 can be formally certified and accredited by external certification bodies.",
    relatedTermIds: ["pdca-cycle", "hs-policy"],
  },
  {
    id: "hs-policy",
    term: "Health and Safety Policy (Three Core Sections)",
    chapter: 2,
    category: "Management Systems",
    summary:
      "The foundational organizational document split into Statement of Intent, Organisation, and Arrangements.",
    fullDefinition:
      "Under HASWA 1974 s.2(3), employers with 5+ workers must keep a written safety policy comprising: (1) General Statement of Intent: Top-level commitment, aims, SMART targets, signed and dated by the CEO/Managing Director; (2) Organisation Section: Allocation of responsibilities, lines of accountability, delegation chain from board to floor; (3) Arrangements Section: Operational procedures and control measures for specific hazards (fire, first aid, manual handling, permit systems, emergency procedures).",
    keyFormulaOrBreakdown:
      "1. Statement of Intent (WHAT we aim to do & Who signs) • 2. Organisation (WHO does what) • 3. Arrangements (HOW we control specific hazards).",
    practicalHseExample:
      "If workers don't know who the designated fire marshals or first aiders are, the failure lies in the Organisation section. If there are no procedures for safe chemical decanting, the Arrangements section is deficient.",
    examinerDistinction:
      "The Statement of Intent must be signed and dated by the most senior executive (Managing Director/CEO). If unsigned or undated, it lacks legal authoritativeness.",
    relatedTermIds: ["pdca-cycle", "smart-objectives"],
  },
  {
    id: "smart-objectives",
    term: "SMART Health and Safety Objectives",
    acronym: "S.M.A.R.T.",
    chapter: 2,
    category: "Management Systems",
    summary:
      "A criterion framework ensuring organizational safety targets are actionable, quantifiable, and time-bound.",
    fullDefinition:
      "Objectives set within the Statement of Intent and management planning must satisfy: Specific (unambiguous focus), Measurable (quantifiable metric or rate), Achievable (realistic with available resources), Relevant (targets high-priority organizational risks), and Time-bound (clear deadline for completion).",
    keyFormulaOrBreakdown:
      "S = Specific • M = Measurable • A = Achievable • R = Relevant • T = Time-bound.",
    practicalHseExample:
      "POOR: 'Improve chemical safety.' SMART: 'Train 100% of paint-shop technicians in updated COSHH solvent procedures and replace solvent degreaser with water-based alternative by 30 June 2027.'",
    examinerDistinction:
      "Stating 'zero accidents' is often criticized by examiners as unachievable and demotivating because it drives under-reporting of minor incidents.",
    relatedTermIds: ["hs-policy", "active-reactive-monitoring"],
  },
  {
    id: "competence",
    term: "Competence (The K.A.T.E. Model)",
    acronym: "K.A.T.E.",
    chapter: 2,
    category: "Management Systems",
    summary:
      "The combination of Knowledge, Ability, Training, and Experience needed to execute a task safely without supervision.",
    fullDefinition:
      "Under health and safety jurisprudence, competence is not merely possessing a paper qualification. It requires the synthesis of: (1) Knowledge of hazards and regulations; (2) Ability (physical and mental capacity); (3) Training (formal instruction); and (4) Experience (practical exposure to varying workplace conditions, with awareness of one's own limitations).",
    keyFormulaOrBreakdown:
      "Competence = Knowledge + Ability + Training + Experience (K.A.T.E.) + Knowing When to Seek Help.",
    practicalHseExample:
      "A technician holding a certificate who has never operated a crane in high winds lacks practical experience; placing them on an offshore lift alone without supervision breaches safety competence standards.",
    examinerDistinction:
      "Never equate training alone with competence. A newly trained employee is not yet competent until they demonstrate practical ability and gain supervised experience.",
    relatedTermIds: ["duty-of-care", "human-factors"],
  },
  {
    id: "consultation-vs-communication",
    term: "Consultation vs. Communication / Informing",
    chapter: 2,
    category: "Management Systems",
    summary:
      "The crucial distinction between a two-way dialogue influencing decisions versus a one-way dissemination of instructions.",
    fullDefinition:
      "Communication is a one-way flow of information (e.g., noticeboards, safety memos, signs). Consultation is a two-way dialogue where the employer listens to workers' views, gives them timely information, and takes their opinions into account BEFORE decisions are finalized regarding equipment purchases, risk assessments, or policy revisions.",
    keyFormulaOrBreakdown:
      "Communication = 1-way (Telling). Consultation = 2-way (Listening, exchanging views, and influencing outcomes).",
    practicalHseExample:
      "Sending an email announcing a new mandatory shoe brand is communication. Involving safety representatives in wear-trials and choosing based on floor feedback is consultation.",
    examinerDistinction:
      "Consultation does NOT require agreement/consensus; the employer retains ultimate decision authority, but worker input must genuinely be considered beforehand.",
    relatedTermIds: ["safety-culture", "hs-policy"],
  },

  // ==========================================
  // CHAPTER 3: MANAGING RISK - PEOPLE & PROCESSES
  // ==========================================
  {
    id: "hazard-vs-risk",
    term: "Hazard vs. Risk",
    chapter: 3,
    category: "Risk Assessment & Controls",
    summary:
      "Hazard is the intrinsic potential to cause harm; Risk is the combination of the likelihood of harm occurring and the severity of its consequences.",
    fullDefinition:
      "HAZARD: Anything with the intrinsic potential to cause harm (e.g., electricity, wet floor, toxic chlorine gas, rotating spindle). RISK: The combination of the likelihood that the hazard will cause harm under specific conditions of exposure, multiplied by the severity of the consequence.",
    keyFormulaOrBreakdown:
      "Risk = Likelihood of Occurrence &times; Severity of Harm. (Risk = L &times; S).",
    practicalHseExample:
      "A concentrated 98% sulfuric acid bottle in a locked, double-bunded fireproof cabinet has high hazard, but very low risk due to minimal exposure. Spilled across a busy walkway, both hazard and risk are severe.",
    examinerDistinction:
      "The most common exam mistake is confusing these terms: a hazard is the object/substance itself; risk is the probabilistic outcome of exposure.",
    relatedTermIds: ["risk-assessment-5-steps", "hierarchy-of-control"],
  },
  {
    id: "risk-assessment-5-steps",
    term: "Five Steps of Risk Assessment (HSE INDG163)",
    chapter: 3,
    category: "Risk Assessment & Controls",
    summary:
      "The standard UK HSE five-stage systematic process for evaluating and controlling workplace hazards.",
    fullDefinition:
      "Stage 1: Identify the hazards (physical walkarounds, safety data sheets, accident records). Stage 2: Decide who might be harmed and how (workers, cleaners, visitors, young workers, expectant mothers). Stage 3: Evaluate the risks and decide on control measures (apply the hierarchy of control). Stage 4: Record your significant findings (mandatory for 5+ employees). Stage 5: Review your assessment and update if significant changes occur (new plant, incident, change of process).",
    keyFormulaOrBreakdown:
      "1. Identify Hazards → 2. Who & How → 3. Evaluate & Control → 4. Record Findings → 5. Review & Revise.",
    practicalHseExample:
      "In a commercial bakery: 1. Flour dust (hazard); 2. Bakers and cleaners at risk of occupational asthma; 3. Install LEV hood on mixers; 4. Document in risk register; 5. Re-evaluate when installing larger 200kg dough mixers.",
    examinerDistinction:
      "For Stage 4, recording is a statutory requirement for employers with 5 or more employees, but the duty to assess applies to ALL employers regardless of size.",
    relatedTermIds: ["hazard-vs-risk", "hierarchy-of-control"],
  },
  {
    id: "hierarchy-of-control",
    term: "Hierarchy of Risk Control (The E.R.I.C.P.D. Framework)",
    acronym: "ERICPD / Elimination First",
    chapter: 3,
    category: "Risk Assessment & Controls",
    summary:
      "The priority order of hazard prevention measures from the most effective inherent redesign to the least effective human-dependent PPE.",
    fullDefinition:
      "Standard hierarchy: (1) ELIMINATION (physically remove hazard); (2) REDUCTION / SUBSTITUTION (replace with safer alternative); (3) ISOLATION / ENGINEERING CONTROLS (physical barriers, machine guards, LEV); (4) CONTROL / ADMINISTRATIVE CONTROLS (safe systems of work, rotation, training, signs); (5) PERSONAL PROTECTIVE EQUIPMENT (PPE - last line of defence).",
    keyFormulaOrBreakdown:
      "E = Eliminate • R = Reduce/Substitute • I = Isolate/Engineering • C = Control/Admin • P = PPE (Last Resort).",
    practicalHseExample:
      "Degreasing parts: Eliminate solvent by using ultrasonic water bath (best). Substitute with low-toxicity citrus cleaner. Isolate in an enclosed cabinet. Administer 20-min job rotation. Issue nitrile gloves (worst as sole control).",
    examinerDistinction:
      "PPE only protects the wearer, does not remove the hazard from the environment, and relies on human compliance and perfect fit.",
    relatedTermIds: ["hazard-vs-risk", "safe-system-of-work"],
  },
  {
    id: "safety-culture",
    term: "Safety Culture vs. Safety Climate",
    chapter: 3,
    category: "Human Factors & Culture",
    summary:
      "Safety Culture is the enduring shared attitudes, values, and beliefs of an organization; Climate is the temporary snapshot mood.",
    fullDefinition:
      "SAFETY CULTURE (HSC definition): 'The product of individual and group values, attitudes, perceptions, competencies, and patterns of behaviour that determine the commitment to, and the style and proficiency of, an organisation's health and safety management.' SAFETY CLIMATE: The tangible, short-term manifestation or 'snapshot' perception of culture at a specific moment in time (e.g., measured via climate questionnaires).",
    keyFormulaOrBreakdown:
      "Culture = Deeply rooted organizational DNA ('how we do things around here when no one is watching'). Climate = Temporary mood snapshot.",
    practicalHseExample:
      "If a manager tells technicians to bypass machine guards to hit end-of-month quotas, the organization suffers from a poor, production-biased safety culture.",
    examinerDistinction:
      "Indicators of poor culture: high accident rates, high staff turnover, rampant absenteeism, lack of PPE compliance, poor reporting of near misses, and management absence from shop floor.",
    relatedTermIds: ["human-factors", "active-reactive-monitoring"],
  },
  {
    id: "human-factors",
    term: "Human Factors (The Three Domains)",
    chapter: 3,
    category: "Human Factors & Culture",
    summary:
      "Environmental, organizational, job, and individual characteristics that influence human behavior and task safety at work.",
    fullDefinition:
      "Under UK HSE HSG48, human performance is shaped by three interrelated domains: (1) The Organisational Factors (leadership culture, communication, workload, safety policy resources); (2) The Job Factors (task ergonomics, visual display clarity, shift patterns, noise, fatigue); (3) The Individual Factors (competence, risk perception, age, attitude, personality, health, physical strength).",
    keyFormulaOrBreakdown:
      "Organisational (Culture & Workload) + Job (Ergonomics & Task Design) + Individual (Attitude & Competence) = Human Performance.",
    practicalHseExample:
      "A technician presses the wrong shutdown button: Job factor = identical buttons mounted 2cm apart with no colour coding; Individual = worker fatigued at hour 11 of 12-hour shift; Organisation = understaffing forcing mandatory overtime.",
    examinerDistinction:
      "Never blame an incident solely on 'worker carelessness'. Always analyze the organizational and job ergonomic factors that created the trap.",
    relatedTermIds: ["human-failures", "safety-culture"],
  },
  {
    id: "human-failures",
    term: "Human Failures (Errors vs. Violations)",
    chapter: 3,
    category: "Human Factors & Culture",
    summary:
      "Classification of human failures into unintended errors (slips, lapses, mistakes) versus deliberate violations.",
    fullDefinition:
      "ERRORS (Unintentional): (a) Skill-based Slips (action not as planned, e.g. turning switch right instead of left); (b) Lapses (memory failure, forgetting a step); (c) Mistakes (rule-based or knowledge-based: doing the wrong thing believing it is right). VIOLATIONS (Deliberate): (a) Routine (standard shortcut accepted by all); (b) Situational (cutting corners due to time pressure or missing tools); (c) Exceptional (rare crisis improvisation).",
    keyFormulaOrBreakdown:
      "Failures = Unintentional Errors (Slips, Lapses, Mistakes) vs. Deliberate Violations (Routine, Situational, Exceptional).",
    practicalHseExample:
      "Slip: Pulling the green lever instead of blue. Mistake: Applying water to an electrical fire because you thought it was Class A. Routine Violation: Technicians disabling door interlock because it's faster and management turns a blind eye.",
    examinerDistinction:
      "Mistakes happen in the mind (bad plan executed correctly); Slips happen in execution (good plan executed clumsily).",
    relatedTermIds: ["human-factors", "safety-culture"],
  },
  {
    id: "safe-system-of-work",
    term: "Safe System of Work (SSOW / SREDIM)",
    acronym: "SSOW / S.R.E.D.I.M.",
    chapter: 3,
    category: "Risk Assessment & Controls",
    summary:
      "A formal procedure resulting from systematic hazard assessment to ensure work is carried out with minimal risk.",
    fullDefinition:
      "A documented step-by-step method designed to eliminate hazards or minimize risk for complex or hazardous activities. Developed using the SREDIM methodology: Select task to be examined; Record the steps of the operation; Examine the hazards critically; Develop the safest method; Implement the system with training; Maintain and monitor compliance.",
    keyFormulaOrBreakdown:
      "S.R.E.D.I.M. = Select → Record → Examine → Develop → Implement → Maintain.",
    practicalHseExample:
      "Developing an SSOW for changing glass panels on an atrium ceiling: identifies harness anchor points, exclusion zones underneath, lifting equipment method, and weather wind-speed limits.",
    examinerDistinction:
      "An SSOW is useless if kept as a binder in an office. Workers must be inducted, trained, provided with copies, and supervised to ensure adherence.",
    relatedTermIds: ["permit-to-work", "hierarchy-of-control"],
  },
  {
    id: "permit-to-work",
    term: "Permit-to-Work (PTW) System",
    acronym: "PTW",
    chapter: 3,
    category: "Risk Assessment & Controls",
    summary:
      "A specialized formal written authorization system used to strictly control high-hazard non-routine activities.",
    fullDefinition:
      "A formal safety document regulating work with high intrinsic danger (confined spaces, hot work, high-voltage electrical, radiation, complex machinery maintenance). Core sections: (1) Issue & Hazard Identification; (2) Isolation & Precautions (LOTO, atmospheric testing); (3) Acceptance by Lead Performer; (4) Hand-Back / Extension; (5) Cancellation & System De-isolation.",
    keyFormulaOrBreakdown:
      "PTW = Issue (Precautions Verified) → Acceptance (Contractor Signs) → Handback (Work Complete) → Cancellation (Plant Re-energized).",
    practicalHseExample:
      "Entering a chemical fermentation tank: PTW requires pipe blanking, 24V explosion-proof lighting, continuous atmospheric oxygen/toxic gas monitoring, rescue winch tripod, and designated standby attendant.",
    examinerDistinction:
      "A permit does not make work safe by itself; it is a communication and verification tool ensuring rigorous precautions are physically in place before work starts.",
    relatedTermIds: ["confined-space", "safe-system-of-work"],
  },
  {
    id: "confined-space",
    term: "Confined Space",
    chapter: 3,
    category: "Risk Assessment & Controls",
    summary:
      "Any place of substantially enclosed nature with a foreseeable specified risk of serious injury from fire, explosion, gas, drowning, or asphyxiation.",
    fullDefinition:
      "Under Confined Spaces Regulations 1997, defined by two criteria: (1) Substantially enclosed nature (vessels, tanks, silos, sewers, pits, ductwork); and (2) Presence of one of the 5 Specified Risks: serious injury from fire/explosion; loss of consciousness from increased body temperature; loss of consciousness/asphyxiation from gas, fume, vapor or lack of oxygen; drowning from liquid ingress; or asphyxiation from a free-flowing solid (grain, sand).",
    keyFormulaOrBreakdown:
      "Enclosed Nature + At least 1 of the 5 Specified Risks (Fire, Toxic/Asphyxiation, Heat, Drowning, Free-flowing solid engulfment).",
    practicalHseExample:
      "A 3-meter deep trench with idling excavator exhaust blowing into it is legally a confined space because toxic carbon monoxide and carbon dioxide pool at the trench bottom.",
    examinerDistinction:
      "The golden rule of confined space work is: AVOID ENTRY IF POSSIBLE (e.g. use remote cameras or clean from outside with high-pressure nozzles).",
    relatedTermIds: ["permit-to-work", "hierarchy-of-control"],
  },
  {
    id: "coshh-wel",
    term: "COSHH & Workplace Exposure Limits (WEL)",
    acronym: "COSHH / WEL (TWA & STEL)",
    chapter: 3,
    category: "Risk Assessment & Controls",
    summary:
      "Statutory frameworks controlling hazardous substances and airborne concentration limits over 8-hour and 15-minute intervals.",
    fullDefinition:
      "Control of Substances Hazardous to Health Regulations. Sets Workplace Exposure Limits (WEL) listed in EH40. Defined as: (1) Long-Term Exposure Limit (8-hour Time-Weighted Average - TWA) to protect against chronic effects; (2) Short-Term Exposure Limit (15-minute STEL) to prevent acute irritation or narcosis.",
    keyFormulaOrBreakdown:
      "WEL 8-hr TWA (Chronic Health Protection) vs. 15-min STEL (Acute Irritation/Toxic Spikes Prevention).",
    practicalHseExample:
      "Toluene solvent: 8-hr TWA is 50 ppm, 15-min STEL is 100 ppm. Even if the 8-hour average is low (20 ppm), exposing a worker to 150 ppm for 10 minutes during vessel cleanout breaches statutory law.",
    examinerDistinction:
      "Hazardous substances enter the body via 4 routes: Inhalation (most common industrial route), Ingestion, Absorption through skin/eyes, and Injection.",
    relatedTermIds: ["hierarchy-of-control", "risk-assessment-5-steps"],
  },

  // ==========================================
  // CHAPTER 4: MONITORING, MEASURING & INCIDENT INVESTIGATION
  // ==========================================
  {
    id: "active-reactive-monitoring",
    term: "Active vs. Reactive Monitoring (Leading vs. Lagging)",
    acronym: "Leading vs. Lagging",
    chapter: 4,
    category: "Monitoring & Metrics",
    summary:
      "Active monitoring inspects conditions before accidents occur; Reactive monitoring analyzes failures after harm has been done.",
    fullDefinition:
      "ACTIVE (Leading / Proactive): Measuring safety performance before incidents occur to verify standards are maintained (e.g., safety tours, equipment inspections, training completion, noise sampling, emergency drills). REACTIVE (Lagging): Measuring historical performance by analyzing failures, injuries, ill-health, property damage, near misses, and enforcement actions.",
    keyFormulaOrBreakdown:
      "Active = Looking forward (Preventative standard verification). Reactive = Looking backward (Failure investigation & learning).",
    practicalHseExample:
      "Active: Checking guarding interlocks weekly and conducting fire drills. Reactive: Calculating the annual Lost-Time Injury rate and investigating a severed finger.",
    examinerDistinction:
      "Relying solely on reactive indicators gives a false sense of security; an absence of accidents does not mean hazards are adequately controlled.",
    relatedTermIds: ["safety-audit", "afr", "air"],
  },
  {
    id: "safety-audit",
    term: "Safety Audit vs. Safety Inspection",
    chapter: 4,
    category: "Monitoring & Metrics",
    summary:
      "An audit critically examines the entire management system against formal standards; an inspection checks physical workplace conditions.",
    fullDefinition:
      "AUDIT: A structured, comprehensive, independent critical examination of the entire health and safety management system. Collects evidence across 3 sources (Interviews, Documents, Workplace observation) to assess whether policies and arrangements exist, are implemented, and are effective. INSPECTION: A routine, localized physical check of physical conditions, premises, equipment, and work behaviors against known physical standards (The 4 Ps: Plant, Premises, People, Procedures).",
    keyFormulaOrBreakdown:
      "Audit = Broad systemic examination (Interviews + Paperwork + Observation). Inspection = Localized physical walkaround check of the 4 Ps.",
    practicalHseExample:
      "Inspection: Walking around the carpentry bay noting missing push-sticks and unemptied dust bins. Audit: Reviewing training records, examining risk assessment revision dates, and interviewing the factory director on resource allocation.",
    examinerDistinction:
      "Auditors must possess independence; an external auditor or internal team from a different branch provides objectivity without operational bias.",
    relatedTermIds: ["active-reactive-monitoring", "pdca-cycle"],
  },
  {
    id: "afr",
    term: "Accident Frequency Rate (AFR)",
    acronym: "AFR",
    chapter: 4,
    category: "Monitoring & Metrics",
    summary:
      "A standardized lagging safety performance metric expressing the number of lost-time injuries relative to person-hours worked.",
    fullDefinition:
      "AFR calculates the proportion of reportable/lost-time injuries normalized per 100,000 hours worked (UK HSE standard) or per 1,000,000 hours worked (OSHA and international standard). Eliminates headcount distortion and allows equitable comparison between companies of different sizes.",
    keyFormulaOrBreakdown:
      "AFR = (Number of Lost-Time Injuries &times; Multiplier) &divide; Total Person-Hours Worked. Multiplier is 100,000 (UK) or 1,000,000 (OSHA).",
    practicalHseExample:
      "A plant logs 3 lost-time injuries with 1,200,000 hours worked: UK AFR = (3 &times; 100,000) / 1,200,000 = 0.25 per 100k hrs. OSHA AFR = (3 &times; 1,000,000) / 1,200,000 = 2.50 per 1M hrs. Both represent identical physical reality (1 injury every 400,000 hours).",
    examinerDistinction:
      "Always state the multiplier units in your answer: write '0.25 per 100,000 hours worked', never leave a raw dimensionless number.",
    relatedTermIds: ["air", "asr", "active-reactive-monitoring"],
  },
  {
    id: "air",
    term: "Accident Incidence Rate (AIR)",
    acronym: "AIR",
    chapter: 4,
    category: "Monitoring & Metrics",
    summary:
      "A workforce-normalized metric expressing the number of injuries per 1,000 employees over a given annual period.",
    fullDefinition:
      "AIR compares the incidence of injuries to the average headcount of the workforce. Useful when precise person-hour records are unavailable or when communicating workforce risk percentages to management.",
    keyFormulaOrBreakdown:
      "AIR = (Number of Reportable Injuries in Period &times; 1,000) &divide; Average Number of Employees in Period.",
    practicalHseExample:
      "A distribution center employs 250 workers and records 4 reportable injuries this year: AIR = (4 &times; 1,000) / 250 = 16.0 per 1,000 employees (equivalent to 1.6% of the workforce injured per year).",
    examinerDistinction:
      "AIR does not account for differences in overtime or part-time working hours; AFR is statistically superior because it uses actual hours of exposure.",
    relatedTermIds: ["afr", "asr"],
  },
  {
    id: "asr",
    term: "Accident Severity Rate (ASR)",
    acronym: "ASR",
    chapter: 4,
    category: "Monitoring & Metrics",
    summary:
      "A metric reflecting the gravity of workplace injuries by measuring lost workdays per 1,000 hours worked.",
    fullDefinition:
      "ASR measures the duration of incapacity resulting from workplace injuries. A high AFR with low ASR indicates frequent minor injuries; a low AFR with high ASR indicates infrequent catastrophic or disabling injuries.",
    keyFormulaOrBreakdown:
      "ASR = (Total Working Days Lost &times; 1,000) &divide; Total Person-Hours Worked.",
    practicalHseExample:
      "A foundry records 45 lost workdays across 500,000 hours worked: ASR = (45 &times; 1,000) / 500,000 = 0.09 days lost per 1,000 hours. Mean duration = 45 days / 3 injuries = 15 days per incident.",
    examinerDistinction:
      "Severity rates reveal whether safety controls are failing on minor hazards (cuts/bruises) or life-altering hazards (falls from height, structural crushing).",
    relatedTermIds: ["afr", "air"],
  },
  {
    id: "heinrich-triangle",
    term: "Accident Triangle (Heinrich & Bird Ratio)",
    acronym: "Bird's 1:10:30:600",
    chapter: 4,
    category: "Incident Investigation",
    summary:
      "Empirical ratio proving that major fatal accidents are preceded by hundreds of near misses and minor property incidents.",
    fullDefinition:
      "Frank E. Bird's expanded study (1969) of 1.75 million workplace accidents established that for every 1 serious/fatal injury, there are 10 minor injuries, 30 property damage incidents, and 600 near-miss incidents. Demonstrates that investigating near misses and unsafe conditions prevents major catastrophes.",
    keyFormulaOrBreakdown:
      "Bird's Ratio: 1 Major Injury : 10 Minor Injuries : 30 Property Damage Incidents : 600 Near Misses.",
    practicalHseExample:
      "A warehouse has 30 incidents of pallets falling from racking without hitting anyone (near misses). If management ignores these, statistical probability dictates a fatal crushing incident is imminent.",
    examinerDistinction:
      "Do not suggest near misses *cause* fatal accidents; rather, they share identical root causes. Eliminating bottom-of-the-pyramid hazards removes top-tier fatal events.",
    relatedTermIds: ["near-miss", "incident-causes"],
  },
  {
    id: "near-miss",
    term: "Near Miss vs. Dangerous Occurrence",
    chapter: 4,
    category: "Incident Investigation",
    summary:
      "A near miss is an unplanned event causing no harm; a dangerous occurrence is a legally defined high-risk statutory event.",
    fullDefinition:
      "NEAR MISS: An unplanned, unforeseen event that had the potential to cause injury, ill-health, or damage, but did not result in injury on this occasion. DANGEROUS OCCURRENCE: A specific, legally defined high-consequence failure listed under statutory reporting regulations (e.g. RIDDOR Schedule 2) that must be reported to the enforcement authority immediately, whether or not anyone was injured (e.g., scaffolding collapse, crane collapse, pipeline explosion).",
    keyFormulaOrBreakdown:
      "Near Miss = Unplanned event with zero harm. Dangerous Occurrence = High-potential statutory event legally reportable to the enforcement authority.",
    practicalHseExample:
      "A brick falls from scaffold onto an empty grass patch (Near Miss). A 15-meter mobile crane topples over on site without injuring the operator (Dangerous Occurrence - statutory report required under RIDDOR).",
    examinerDistinction:
      "Encouraging near-miss reporting without fear of blame (just culture) is the single most effective way to eliminate fatal accidents before they occur.",
    relatedTermIds: ["heinrich-triangle", "riddor"],
  },
  {
    id: "incident-causes",
    term: "Immediate, Underlying, and Root Causes",
    chapter: 4,
    category: "Incident Investigation",
    summary:
      "The three causal layers of workplace incidents: unsafe acts/conditions, systemic management failures, and organizational defects.",
    fullDefinition:
      "IMMEDIATE CAUSES: The obvious circumstances immediately preceding the incident: Unsafe Acts (e.g. not wearing harness) or Unsafe Conditions (e.g. unguarded blade). UNDERLYING CAUSES (Systemic): Less obvious failures that allowed the unsafe act/condition to occur (e.g. lack of training, inadequate maintenance, rushed deadlines). ROOT CAUSES (Management): Fundamental organizational defects in the safety management system (e.g. poor leadership commitment, no budget allocated for machinery, absent policy review).",
    keyFormulaOrBreakdown:
      "Immediate (What happened: Unsafe act/condition) → Underlying (Why it happened: Training/maintenance failure) → Root (System failure: Management oversight/policy defect).",
    practicalHseExample:
      "Worker slips on oil: Immediate cause = oil slick on concrete floor. Underlying cause = gearbox leaking for 3 weeks and no drip tray installed. Root cause = plant maintenance budget cut and no routine inspection schedule enforced.",
    examinerDistinction:
      "If an investigation stops at immediate causes ('worker wasn't looking'), the same incident will recur. Only addressing root causes achieves permanent prevention.",
    relatedTermIds: ["heinrich-triangle", "pdca-cycle"],
  },
  {
    id: "riddor",
    term: "RIDDOR Statutory Reporting Framework",
    acronym: "RIDDOR",
    chapter: 4,
    category: "Incident Investigation",
    summary:
      "Statutory duty on employers to notify and report specified workplace deaths, major injuries, and dangerous occurrences.",
    fullDefinition:
      "Reporting of Injuries, Diseases and Dangerous Occurrences Regulations. Imposes duties on 'responsible persons' to report: (1) Fatalities; (2) Specified Injuries (fractures except fingers/toes, amputations, loss of sight, serious burns); (3) Over-7-day incapacitation injuries (report within 15 days); (4) Occupational Diseases (carpal tunnel, occupational asthma, HAVS); and (5) Dangerous Occurrences.",
    keyFormulaOrBreakdown:
      "Reportable Categories: Fatalities • Specified Injuries • Over-7-Day Incapacitation • Occupational Diseases • Dangerous Occurrences.",
    practicalHseExample:
      "A carpenter fractures their arm falling off an access platform: This is a Specified Injury requiring immediate phone notification to the HSE and formal online F2508 form submission within 10 days.",
    examinerDistinction:
      "Over-3-day injuries must be recorded internally in the accident book; Over-7-day injuries must be formally reported to the statutory enforcement authority.",
    relatedTermIds: ["near-miss", "incident-causes"],
  },
];
