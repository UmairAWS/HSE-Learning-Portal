import { Flashcard } from "../types";

export const NEBOSH_FLASHCARDS: Flashcard[] = [
  // ==================== ELEMENT 1: WHY WE SHOULD MANAGE HEALTH AND SAFETY ====================
  {
    id: "fc_sfarp",
    elementId: 1,
    topic: "Legal Duties & Standards",
    category: "legal-definition",
    term: "So Far As Is Reasonably Practicable (SFARP)",
    acronym: "SFARP",
    definition:
      "A qualified legal duty requiring the duty-holder to balance the quantum of risk against the sacrifice (in time, money, and physical difficulty/trouble) required to avert that risk. If the sacrifice is grossly disproportionate to the risk, the measure is not required.",
    legalContext:
      "Established in Common Law precedent: Edwards v National Coal Board (1949); foundational standard in UK HASWA 1974 s.2 and Commonwealth jurisdictions.",
    keyElements: [
      "Quantum of risk must be objectively evaluated",
      "Sacrifice involves time, money, and trouble",
      "Presumption is in favour of safety — measures must be taken unless sacrifice is grossly disproportionate",
      "Financial inability of an employer alone does not justify non-compliance",
    ],
    obeApplicationTip:
      "In practical scenario tasks asking 'Why the employer must install machine interlocks', argue that the risk of severe amputation clearly outweighs the modest cost and inconvenience of fitting guards.",
    examinerWarning:
      "Do NOT say 'if it's too expensive the employer doesn't have to do it'. The legal test requires gross disproportion between sacrifice and risk.",
  },
  {
    id: "fc_strict_liability",
    elementId: 1,
    topic: "Legal Duties & Standards",
    category: "legal-definition",
    term: "Strict Liability (Absolute Duty)",
    definition:
      "A legal duty where an offense is committed as soon as the proscribed state of affairs occurs, irrespective of fault, intention, ignorance, or lack of negligence. Defenses based on reasonable care or economic cost are inadmissible.",
    legalContext:
      "Commonly indicated in statutory regulations by imperative words like 'shall' or 'must' without qualifying phrases like 'so far as is reasonably practicable'.",
    keyElements: [
      "Absolute compliance required by law",
      "No cost-benefit balancing allowed",
      "Absence of blameworthy state of mind (mens rea) is irrelevant",
    ],
    obeApplicationTip:
      "Look for regulatory requirements in scenarios such as statutory thorough examinations of pressure vessels or passenger lifts where compliance is unconditional.",
    examinerWarning:
      "Do not confuse with qualified duties (SFARP) which allow practical balancing tests.",
  },
  {
    id: "fc_negligence",
    elementId: 1,
    topic: "Civil Law & Compensation",
    category: "legal-definition",
    term: "Tort of Negligence",
    definition:
      "A civil wrong involving a breach of a legal duty of care owed by one party to another that results directly in actionable damage, physical injury, psychiatric trauma, or financial loss.",
    legalContext:
      "Civil law action seeking damages (compensation) rather than punitive fines; rooted in Donoghue v Stevenson (1932) 'Neighbour Principle'.",
    keyElements: [
      "Element 1: A legal duty of care was owed to the claimant",
      "Element 2: The defendant breached that duty (failed to act as a reasonable person)",
      "Element 3: The claimant suffered actionable harm caused directly by the breach (causation & not too remote)",
    ],
    obeApplicationTip:
      "When scenarios involve an injured employee suing their employer for compensation, systematically verify all three tests: duty of care, breach, and resultant harm.",
    examinerWarning:
      "Do not confuse criminal prosecution (punishment/fines by the state) with civil negligence claims (financial compensation for the injured victim).",
  },
  {
    id: "fc_vicarious_liability",
    elementId: 1,
    topic: "Civil Law & Compensation",
    category: "legal-definition",
    term: "Vicarious Liability",
    definition:
      "A legal doctrine holding an employer strictly liable in civil law for the negligent acts or omissions committed by their employees, provided those acts occurred within the course and scope of their employment.",
    legalContext:
      "Allows injured third parties or colleagues to claim compensation from the employer's compulsory Employers' Liability Insurance.",
    keyElements: [
      "Worker must be an employee under a contract of service",
      "Employee must have committed a tort (negligence)",
      "Tort must have been committed in the course of employment (not on a 'frolic of their own')",
    ],
    obeApplicationTip:
      "If a forklift driver injures a contractor while speeding to finish a shift, the warehouse company is vicariously liable because driving was part of authorized work duties.",
  },
  {
    id: "fc_iceberg",
    elementId: 1,
    topic: "Financial Justifications",
    category: "core-terminology",
    term: "The Iceberg Theory of Accident Costs",
    definition:
      "A financial model illustrating that direct insured costs of an accident (first aid, medical treatment, statutory compensation) represent only the small visible tip (~1:8 to 1:36 or 1:10), while the vast majority of costs are indirect and uninsurable (lost production, sick pay, overtime, investigation time, fines, client losses).",
    legalContext:
      "Pioneered by Frank Bird / UK HSE Research Study; fundamental to proving the business case for health & safety.",
    keyElements: [
      "Insured direct costs: property damage, medical treatment, worker compensation",
      "Uninsured indirect costs: downtime, retraining, accident investigation, sick pay",
      "Uninsurable costs: criminal fines, court costs, brand damage, lost contracts",
    ],
    obeApplicationTip:
      "When asked to outline financial arguments to convince a reluctant finance director, cite at least 6 distinct uninsured indirect costs present in the scenario.",
    examinerWarning:
      "Criminal fines can NEVER be covered by insurance policies in the UK and most international jurisdictions; citing insured fines will lose marks.",
  },
  {
    id: "fc_c155",
    elementId: 1,
    topic: "International Standards",
    category: "ilo-standards",
    term: "ILO Convention C155 (Article 16)",
    acronym: "C155",
    definition:
      "The primary International Labour Organization treaty establishing baseline standards for national safety policies and setting out the core obligations of employers to ensure workplaces, machinery, equipment, and chemical substances are safe and without risk to health.",
    legalContext:
      "ILO Occupational Safety and Health Convention, 1981 (No. 155), ratified globally as benchmark international safety law.",
    keyElements: [
      "Workplaces and machinery must be safe and without risk to health",
      "Chemical, physical, and biological substances must be safe with adequate protective measures",
      "Provision of adequate protective clothing and equipment without cost to the worker",
      "Measures to deal with emergencies and industrial accidents",
    ],
    obeApplicationTip:
      "Cite C155 Article 16 when justifying why the employer is legally obligated to provide personal protective equipment free of charge or repair dangerous plant.",
  },
  {
    id: "fc_r164",
    elementId: 1,
    topic: "International Standards",
    category: "ilo-standards",
    term: "ILO Recommendation R164",
    acronym: "R164",
    definition:
      "A supplementary international normative instrument providing practical operational guidelines to accompany Convention C155, detailing specific employer arrangements (supervision, training, work organisation) and worker consultation rights.",
    legalContext:
      "ILO Occupational Safety and Health Recommendation, 1981 (No. 164).",
    keyElements: [
      "Employers must provide suitable instruction, training, and supervision",
      "Safety reps must have access to information and consultation before changes",
      "Workers have the right to remove themselves from imminent and serious danger without penalty (Art. 19/20)",
    ],
    obeApplicationTip:
      "Use R164 to support arguments around worker refusal of unsafe work when faced with imminent life threats in a practical scenario assessment.",
  },
  {
    id: "fc_contractor_vetting",
    elementId: 1,
    topic: "Contractor Management",
    category: "management-framework",
    term: "Contractor Selection & Due Diligence",
    definition:
      "The systematic 5-phase procedure (Selecting, Planning, Coordinating, Monitoring, Reviewing) used by a client organization to verify that third-party contractors possess the necessary health and safety competence, resources, and systems prior to engagement.",
    keyElements: [
      "Verification of H&S policy and risk assessment samples",
      "Checking qualifications, trade accreditations, and training records",
      "Reviewing past enforcement action, prosecutions, and accident records",
      "Checking insurance certificates (Public Liability, Employer Liability)",
      "Requesting client references and sample method statements",
    ],
    obeApplicationTip:
      "In scenarios where a rogue contractor causes an explosion or roof fall, identify client failures in vetting insurance, method statements, and on-site supervision.",
  },

  // ==================== ELEMENT 2: HOW H&S MANAGEMENT SYSTEMS WORK ====================
  {
    id: "fc_pdca",
    elementId: 2,
    topic: "Management Systems",
    category: "management-framework",
    term: "Plan-Do-Check-Act (PDCA Cycle)",
    acronym: "PDCA",
    definition:
      "An iterative four-stage management framework adapted from the Deming cycle, forming the core operational architecture of modern health & safety management systems (ISO 45001 and ILO-OSH 2001) to achieve continual improvement.",
    keyElements: [
      "Plan: Formulate safety policy, establish SMART objectives, identify hazards, allocate resources",
      "Do: Implement hazard controls, train workers, communicate, establish emergency procedures",
      "Check: Measure performance (active inspections + reactive incident data), audit systems",
      "Act: Senior management reviews findings, takes corrective action, adjusts policy",
    ],
    obeApplicationTip:
      "When asked to suggest how an organization can systematically improve after an audit failure, map your recommendations cleanly across Plan, Do, Check, and Act.",
  },
  {
    id: "fc_policy_sections",
    elementId: 2,
    topic: "Health & Safety Policy",
    category: "management-framework",
    term: "Three-Part Health & Safety Policy",
    definition:
      "The three mandatory operational sections forming an organization's written health and safety policy document: (1) General Statement of Intent, (2) Organisation Section, and (3) Arrangements Section.",
    keyElements: [
      "1. General Statement of Intent: Top management commitment, safety aims, SMART targets, signed & dated by CEO/MD",
      "2. Organisation: Roles, responsibilities, chain of command, safety committee, lines of accountability",
      "3. Arrangements: Practical operational procedures for specific hazards (fire, manual handling, first aid, permit to work)",
    ],
    obeApplicationTip:
      "Scenarios often feature an unsigned policy, lack of named responsible persons, or missing arrangements for hazardous contractor work.",
    examinerWarning:
      "An unsigned or out-of-date statement of intent indicates weak management commitment and poor safety culture.",
  },
  {
    id: "fc_smart_objectives",
    elementId: 2,
    topic: "Safety Objectives",
    category: "management-framework",
    term: "SMART Safety Objectives",
    acronym: "SMART",
    definition:
      "A criterion-based framework used by safety leaders to establish clear, actionable health and safety targets that can be effectively measured and monitored over a defined timeframe.",
    keyElements: [
      "Specific: Exactly what will be achieved (e.g. deliver IOSH training to 100% of line supervisors)",
      "Measurable: Quantifiable metric or percentage tracking progress",
      "Achievable: Realistic given available budget, staffing, and time",
      "Relevant: Directly addressing major organizational risks or audit weaknesses",
      "Time-bound: Specified target completion deadline (e.g. by Q3 2026)",
    ],
    obeApplicationTip:
      "Do NOT write vague targets like 'improve safety awareness'. Write: 'Achieve 100% completion of manual handling refresher training for all 45 warehouse staff by December 31st'.",
  },
  {
    id: "fc_iso45001",
    elementId: 2,
    topic: "International Standards",
    category: "ilo-standards",
    term: "ISO 45001 Standard",
    acronym: "ISO 45001",
    definition:
      "The international standard for Occupational Health and Safety Management Systems (OHSMS). Built on the Annex SL High-Level Structure (HLS), it emphasizes top leadership accountability, worker participation, context of the organization, and risk/opportunity management.",
    keyElements: [
      "Top leadership commitment cannot be delegated to safety managers",
      "Formal worker consultation and participation (Clause 5.4)",
      "Risk-based thinking covering both operational risks and organizational opportunities",
      "Compatible with ISO 9001 (Quality) and ISO 14001 (Environmental)",
    ],
    obeApplicationTip:
      "Contrast ISO 45001 with ILO-OSH 2001 by highlighting ISO 45001's focus on external context, commercial suppliers, and broader business opportunities.",
  },
  {
    id: "fc_policy_review_triggers",
    elementId: 2,
    topic: "Policy Governance",
    category: "management-framework",
    term: "Policy Review Triggers",
    definition:
      "Specific organizational, regulatory, or operational occurrences that legally or practically mandate an immediate reassessment and updating of the health and safety policy before the routine annual review.",
    keyElements: [
      "Significant changes in key management personnel (new CEO / Managing Director)",
      "Major organizational restructuring, takeover, or corporate merger",
      "Substantial changes in work processes, machinery, premises, or technology",
      "Introduction of new legislation, statutory regulations, or authoritative guidance",
      "Following a serious accident, fatal event, or dangerous occurrence",
      "Adverse findings from internal/external audits or enforcement notice issuance",
    ],
    obeApplicationTip:
      "When scenario notes that the company introduced a new automated robotic packing line 2 years ago without updating paperwork, cite this trigger!",
  },

  // ==================== ELEMENT 3: MANAGING RISK (PEOPLE & PROCESSES) ====================
  {
    id: "fc_hazard",
    elementId: 3,
    topic: "Risk Assessment",
    category: "core-terminology",
    term: "Hazard",
    definition:
      "Anything with the inherent potential to cause harm, injury, ill-health, damage to property, loss of production, or environmental degradation.",
    keyElements: [
      "Physical hazards: noise, vibration, slips/trips, unguarded moving parts, electricity",
      "Chemical hazards: toxic solvents, silica dust, lead, corrosive acids",
      "Biological hazards: Legionella, blood-borne viruses, fungal spores",
      "Ergonomic hazards: awkward postures, repetitive strain, heavy manual handling",
      "Psychosocial hazards: workplace bullying, excessive workloads, lone working stress",
    ],
    obeApplicationTip:
      "In hazard identification questions, specify both the source and the potential harm (e.g. 'spilled hydraulic oil on the walkway presenting a slip hazard').",
    examinerWarning:
      "Do not confuse hazard with risk! A bottle of acid on a locked high shelf remains a hazard, but the risk is very low.",
  },
  {
    id: "fc_risk",
    elementId: 3,
    topic: "Risk Assessment",
    category: "core-terminology",
    term: "Risk",
    definition:
      "The combination of the likelihood that a hazardous event will occur and the severity of harm (injury or damage) that could result from that event (Risk = Likelihood × Severity).",
    keyElements: [
      "Likelihood: probability or frequency of exposure to the hazard",
      "Severity: worst-case credible consequence of harm (minor scratch vs fatality)",
      "Existing controls determine the residual risk level",
    ],
    obeApplicationTip:
      "Always evaluate risk by considering how often people are exposed and what controls are currently working versus absent.",
  },
  {
    id: "fc_risk_profiling",
    elementId: 3,
    topic: "Risk Assessment",
    category: "management-framework",
    term: "Risk Profiling",
    definition:
      "A structured assessment that examines the nature and distribution of all risks faced by an organization, identifying what could cause serious harm, the likelihood of disruption, the effectiveness of existing controls, and the prioritization of safety resources.",
    keyElements: [
      "Examines health, safety, and business continuity threats across the enterprise",
      "Establishes a baseline for informed resource allocation and strategic planning",
      "Endorsed and reviewed by the executive board",
    ],
    obeApplicationTip:
      "Highlight risk profiling when an organization needs to balance limited capex budgets across multiple hazardous site operations.",
  },
  {
    id: "fc_hierarchy_of_control",
    elementId: 3,
    topic: "Risk Control",
    category: "core-terminology",
    term: "Hierarchy of Risk Control",
    acronym: "ERICPD",
    definition:
      "A systematic priority order of hazard control measures ranked by reliability and effectiveness. Controls higher up the hierarchy act on the hazard itself, whereas controls lower down depend on human behavior and vulnerability.",
    keyElements: [
      "1. Elimination: Completely remove the hazard (e.g. eliminate work at height)",
      "2. Substitution: Replace with a less hazardous substance or process (e.g. water-based paint instead of solvent-based)",
      "3. Engineering Controls: Physical barriers (interlocks, local exhaust ventilation (LEV), acoustic enclosures)",
      "4. Administrative Controls: Safe systems of work, job rotation, signage, training, permits-to-work",
      "5. PPE: Personal protective equipment (hard hats, ear defenders) — last line of defense",
    ],
    obeApplicationTip:
      "Always structure control solutions from top to bottom. Giving workers PPE before examining engineering or substitution options is heavily penalized by health and safety examiners.",
    examinerWarning:
      "PPE only protects the wearer, does not remove the hazard, and fails completely if worn incorrectly.",
  },
  {
    id: "fc_sredim",
    elementId: 3,
    topic: "Safe Systems of Work",
    category: "management-framework",
    term: "Safe System of Work (SSW / SREDIM)",
    acronym: "SREDIM",
    definition:
      "A formal written work procedure which results from a systematic examination of a task to identify all hazards and specify methods of working that eliminate or control risks. Developed using the 6-stage SREDIM methodology.",
    keyElements: [
      "Select: Choose the hazardous or critical task to examine",
      "Record: Document every operational step and activity of the task",
      "Examine: Critically evaluate the hazards, human factors, and potential failures",
      "Develop: Formulate the safest, most practical working method",
      "Implement: Train the workforce, issue documentation, and verify comprehension",
      "Maintain: Periodically monitor, inspect, and update the procedure",
    ],
    obeApplicationTip:
      "Cite SREDIM when the scenario asks how the safety officer should develop a new procedure for servicing an automated packaging line.",
  },
  {
    id: "fc_ptw",
    elementId: 3,
    topic: "Safe Systems of Work",
    category: "core-terminology",
    term: "Permit-to-Work (PTW)",
    acronym: "PTW",
    definition:
      "A formal written authorization system used to control high-risk, non-routine, or complex work activities. It ensures all hazards are identified, precautions verified, isolations documented, and the workplace confirmed safe before work begins and after completion.",
    keyElements: [
      "Essential sections: Issue, Receipt, Clearance/Hand-back, Cancellation",
      "Common applications: Hot work, Confined space entry, High-voltage electrical work, Work on pressurized chemical lines",
      "Requires designated Authorized Issuer, Competent Performer, and Hand-back Sign-off",
    ],
    obeApplicationTip:
      "Look for scenarios where welding was done near flammable cardboard without a hot work permit or 60-minute fire watch post-completion.",
  },
  {
    id: "fc_safety_culture",
    elementId: 3,
    topic: "Safety Culture",
    category: "core-terminology",
    term: "Health and Safety Culture",
    definition:
      "The shared attitudes, values, beliefs, competencies, and patterns of behavior that determine the commitment to, and the style and proficiency of, an organization's health and safety management.",
    keyElements: [
      "Tangible indicators: Accident/near-miss reporting rates, housekeeping quality, PPE compliance",
      "Intangible indicators: Management visibility on shop floor, open trust, fear of reprisal",
      "Positive culture: High reporting, safety prioritized over production, continuous learning",
      "Negative culture: Blame mindset, under-reporting, corner-cutting, production prioritized at all costs",
    ],
    obeApplicationTip:
      "In scenario questions asking 'Evaluate the safety culture of company X', systematically extract negative indicators (e.g. broken interlocks ignored) and positive indicators.",
  },
  {
    id: "fc_human_factors",
    elementId: 3,
    topic: "Human Reliability",
    category: "core-terminology",
    term: "Human Factors (The Three Pillars)",
    definition:
      "Environmental, organizational, and job factors, and human and individual characteristics which influence behavior at work in a way which can affect health and safety.",
    keyElements: [
      "1. Organisational Factors: Leadership commitment, communication, shift patterns, workload culture, resources",
      "2. Job Factors: Task complexity, ergonomics, display design, noise, vibration, clear procedures",
      "3. Individual Factors: Competence, physical capability, risk perception, attitude, fatigue, stress",
    ],
    obeApplicationTip:
      "When analyzing why an operator made a catastrophic mistake, divide your answer into Organisational, Job, and Individual factors.",
  },
  {
    id: "fc_3ps_first_aid",
    elementId: 3,
    topic: "Emergency Response",
    category: "core-terminology",
    term: "The 3 Ps of First Aid",
    acronym: "3 Ps",
    definition:
      "The three fundamental operational priorities governing initial workplace first-aid intervention before professional emergency paramedic services arrive on scene.",
    keyElements: [
      "1. Preserve Life: Ensure rescuer safety, open airway, support breathing, control catastrophic bleeding",
      "2. Prevent Deterioration: Treat for shock, immobilize fractures, dress burn wounds, position casualty safely",
      "3. Promote Recovery: Reassure casualty, relieve pain, seek rapid professional medical transfer",
    ],
    obeApplicationTip:
      "Cite the 3 Ps when assessing why an untrained supervisor moving an unconscious fallen worker worsened a spinal injury.",
  },

  // ==================== ELEMENT 4: HEALTH AND SAFETY MONITORING & MEASURING ====================
  {
    id: "fc_active_monitoring",
    elementId: 4,
    topic: "Performance Monitoring",
    category: "core-terminology",
    term: "Active (Leading) Monitoring",
    definition:
      "Proactive monitoring activities designed to check that health and safety standards, management controls, and preventive systems are operating correctly before an accident, ill-health incident, or damage occurs.",
    keyElements: [
      "Routine safety inspections (checking premises, plant, people, procedures)",
      "Safety tours (brief walkabouts by senior executives)",
      "Safety sampling (targeted random checks of specific activities)",
      "Environmental monitoring (noise dosimeter readings, dust sampling)",
      "Health surveillance programs (audiometry, lung function spirometry)",
    ],
    obeApplicationTip:
      "Active monitoring measures safety effort and compliance; in scenarios, recommend regular weekly manager walkabouts and pre-use equipment checks.",
    examinerWarning:
      "Accident rates and lost time frequency are NOT active monitoring; they are reactive.",
  },
  {
    id: "fc_reactive_monitoring",
    elementId: 4,
    topic: "Performance Monitoring",
    category: "core-terminology",
    term: "Reactive (Lagging) Monitoring",
    definition:
      "Measurement techniques that evaluate past safety performance by analyzing incidents that have already occurred to identify system failures, trends, and corrective actions.",
    keyElements: [
      "Accident and injury statistics (fatalities, lost-time injuries)",
      "Near-miss and dangerous occurrence log books",
      "Ill-health absence and occupational disease reports",
      "Enforcement actions (improvement/prohibition notices received)",
      "Insurance claim costs and civil litigation compensation payouts",
    ],
    obeApplicationTip:
      "Always recommend combining reactive metrics with active leading indicators for a balanced safety dashboard.",
  },
  {
    id: "fc_4ps_inspections",
    elementId: 4,
    topic: "Inspections",
    category: "management-framework",
    term: "The 4 Ps of Workplace Inspections",
    acronym: "4 Ps",
    definition:
      "A systematic physical inspection checklist taxonomy used by safety inspectors to ensure all workplace dimensions are comprehensively scrutinized.",
    keyElements: [
      "Premises: Access/egress, flooring, lighting, heating, ventilation, structural integrity, fire exits",
      "Plant: Machinery guarding, emergency stop buttons, statutory inspection tags, vehicle condition",
      "People: Observed behaviors, PPE compliance, ergonomics, correct use of tools, valid certifications",
      "Procedures: Safe systems of work, method statements, permit-to-work availability, spill kits",
    ],
    obeApplicationTip:
      "When tasked with designing a warehouse inspection checklist, create separate heading sections for Premises, Plant, People, and Procedures.",
  },
  {
    id: "fc_ltifr",
    elementId: 4,
    topic: "Quantitative Metrics",
    category: "core-terminology",
    term: "Lost Time Injury Frequency Rate (LTIFR)",
    acronym: "LTIFR",
    definition:
      "An internationally recognized quantitative formula that standardizes accident rates to allow fair benchmarking between different sized companies or historical periods.",
    keyElements: [
      "Formula: (Total Lost Time Injuries × 1,000,000) ÷ Total Hours Worked",
      "Lost Time Injury: Any work-related injury that renders worker unable to perform normal duties for at least 1 day/shift",
      "Standard base factor: 1,000,000 hours represents ~500 full-time workers over a year",
    ],
    obeApplicationTip:
      "Show working step-by-step if an exam task asks you to calculate whether safety improved between Year 1 and Year 2.",
  },
  {
    id: "fc_immediate_vs_root_causes",
    elementId: 4,
    topic: "Accident Investigation",
    category: "core-terminology",
    term: "Immediate vs. Root Causes",
    definition:
      "The critical distinction in incident investigation between obvious trigger events (immediate causes) and systemic underlying organizational deficiencies (root causes).",
    keyElements: [
      "Immediate Causes: The observable unsafe acts (operator overriding safety sensor) or unsafe conditions (oil slick on floor)",
      "Root Causes: Latent management failures (inadequate preventive maintenance, production pressure, poor training, lack of supervision)",
      "Investigative tool: The '5 Whys' root cause technique to drill past symptoms",
    ],
    obeApplicationTip:
      "If you only identify unsafe acts (e.g. 'worker was careless'), you will lose marks. HSE assessment standards require identifying the systemic failure in supervision, training, or maintenance.",
  },
  {
    id: "fc_audit",
    elementId: 4,
    topic: "Auditing & Assurance",
    category: "core-terminology",
    term: "Health and Safety Audit",
    definition:
      "A structured, independent, and documented process for gathering evidence to objectively determine the extent to which an organization's health and safety management system complies with specified audit criteria.",
    keyElements: [
      "Three verification pillars: Interviewing personnel, Examining documents/records, Observing physical conditions",
      "Independence: Must be conducted by competent auditors independent of the area being audited",
      "Difference from inspection: Audits evaluate the entire management system; inspections check physical conditions on a single day",
    ],
    obeApplicationTip:
      "Always remember the three evidence types: Paperwork (records), People (interviews), and Practice (physical observations).",
  },
  {
    id: "fc_enforcement_notices",
    elementId: 4,
    topic: "Enforcement & Legal Compliance",
    category: "enforcement",
    term: "Improvement Notice vs. Prohibition Notice",
    definition:
      "Statutory enforcement sanctions served by health and safety inspectors upon duty-holders when legal breaches or imminent safety hazards are identified.",
    keyElements: [
      "Improvement Notice: Issued when a breach of safety law has occurred or is likely to continue; duty-holder is given a specified timeframe (minimum 21 days) to remedy the breach while work continues",
      "Prohibition Notice: Issued when an activity involves or will involve risk of serious personal injury; the prohibited activity must CEASE IMMEDIATELY until remedial action is completed. Does NOT require an existing legal breach",
      "Appeals: Appealing an Improvement Notice suspends its effect; appealing a Prohibition Notice does NOT suspend the ban unless an employment tribunal directs otherwise",
    ],
    obeApplicationTip:
      "If the scenario features workers exposed to imminent fatal fall risks from an unguarded roof, the inspector will issue an immediate Prohibition Notice.",
  },
  {
    id: "fc_riddor",
    elementId: 4,
    topic: "Enforcement & Legal Compliance",
    category: "enforcement",
    term: "Statutory Reporting of Incidents (RIDDOR Criteria)",
    acronym: "RIDDOR",
    definition:
      "Legal requirements mandating employers and responsible persons to officially notify and report specified workplace deaths, serious injuries, occupational diseases, and dangerous occurrences to the relevant national enforcement authority.",
    keyElements: [
      "Fatalities: All work-related deaths (immediate notification required)",
      "Specified Injuries: Fractures (other than fingers/toes), amputations, crush injuries causing internal organ damage, serious burns (>10% body or eyes)",
      "Over-7-Day Incapacitation: Worker incapacitated from routine work for >7 consecutive days",
      "Dangerous Occurrences: Specified high-potential incidents (scaffold collapse, crane overturn, explosion)",
      "Occupational Diseases: Carpal tunnel, occupational dermatitis, severe vibration white finger",
    ],
    obeApplicationTip:
      "Identify failure to notify authorities within statutory time limits (e.g. 10 to 15 days) as an aggravated legal breach in scenario evaluations.",
  },
  {
    id: "fc_management_review",
    elementId: 4,
    topic: "Continual Improvement",
    category: "management-framework",
    term: "Management Performance Review",
    definition:
      "A formal evaluation conducted by senior executive leadership at planned intervals to review the organization's OHSMS, ensuring its continuing suitability, adequacy, and effectiveness (the 'Act' stage of PDCA).",
    keyElements: [
      "Inputs: Internal audit findings, incident investigations, status of previous actions, resource adequacy, external changes",
      "Outputs: Decisions on resource allocation, changes to policy statement of intent, updated SMART objectives, revised risk assessments",
    ],
    obeApplicationTip:
      "Management review closes the loop in the PDCA cycle by translating monitoring data into executive budget and policy updates.",
  },
];
