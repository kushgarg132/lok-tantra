export interface SimStep {
  id: string;
  title: string;
  description: string;
  actor: string;
  article?: string;
  choices?: SimChoice[];
  outcome?: string;
  isDecision: boolean;
}

export interface SimChoice {
  id: string;
  label: string;
  consequence: string;
  nextStepId: string;
  isCorrect?: boolean;
}

export interface Simulation {
  id: string;
  title: string;
  description: string;
  topic: string;
  level: string;
  steps: SimStep[];
  startStepId: string;
  endMessage: string;
}

export const SIMULATIONS: Simulation[] = [
  {
    id: "bill-to-law",
    title: "Take a Bill Through Parliament",
    description: "You are a minister proposing an education reform bill. Guide it through every stage — from Cabinet approval to Presidential assent.",
    topic: "lawmaking",
    level: "beginner",
    startStepId: "draft",
    endMessage: "Congratulations! Your Education Reform Bill is now the Education Reform Act. It will be published in the Official Gazette and come into force on the date specified.",
    steps: [
      {
        id: "draft",
        title: "Step 1: Draft the Bill",
        description: "Your ministry has prepared a draft Education Reform Bill. Before introducing it in Parliament, you need Cabinet approval. The law ministry and other concerned ministries have been consulted.",
        actor: "Minister & Law Ministry",
        article: "Art. 77 — Conduct of Government Business",
        isDecision: true,
        choices: [
          { id: "cabinet", label: "Seek Cabinet approval first", consequence: "Correct procedure. Bills must have Cabinet approval before introduction in Parliament.", nextStepId: "cabinet-approval", isCorrect: true },
          { id: "skip", label: "Directly introduce in Lok Sabha without Cabinet nod", consequence: "This is incorrect procedure. Government bills require Cabinet approval. Your bill would be rejected or cause a political crisis.", nextStepId: "draft" },
        ],
      },
      {
        id: "cabinet-approval",
        title: "Step 2: Cabinet Approval",
        description: "The Cabinet (Council of Ministers) meets to discuss your bill. The Finance Minister raises concerns about the budget implications. The Home Ministry wants an opinion on federalism (education is in Concurrent List). After discussion, Cabinet approves the bill.",
        actor: "Cabinet (Council of Ministers)",
        article: "Art. 74, 77 — Cabinet decisions",
        isDecision: false,
        outcome: "Cabinet approves the bill. You can now introduce it in Parliament. Being an ordinary bill (not a Money Bill), you can introduce it in either House.",
      },
      {
        id: "house-choice",
        title: "Step 3: Which House First?",
        description: "Your Education Reform Bill contains some financial provisions (scholarships) but is not exclusively about taxes or government spending. Where do you introduce it first?",
        actor: "Minister",
        article: "Art. 107-110 — Types of bills",
        isDecision: true,
        choices: [
          { id: "ls", label: "Introduce in Lok Sabha (ordinary bill — your choice)", consequence: "Good choice. This is an ordinary bill, so you can introduce it in either House. Lok Sabha is more expedient for government bills since the government has majority there.", nextStepId: "ls-first-reading", isCorrect: true },
          { id: "rs", label: "Introduce in Rajya Sabha", consequence: "Also valid for an ordinary bill. You may face more debate in Rajya Sabha which often has more opposition presence.", nextStepId: "ls-first-reading", isCorrect: true },
        ],
      },
      {
        id: "ls-first-reading",
        title: "Step 4: First Reading in Lok Sabha",
        description: "You introduce the bill in Lok Sabha. The clerk reads out the title and brief purpose. No debate occurs. The bill is printed and circulated to all members. The Speaker announces the bill will be taken up for Second Reading.",
        actor: "Lok Sabha — Speaker, Minister",
        article: "Art. 107 — Introduction of Bills",
        isDecision: false,
        outcome: "First Reading complete. Bill now circulated to MPs. They will study it before the Second Reading debate.",
      },
      {
        id: "committee-choice",
        title: "Step 5: Committee Reference?",
        description: "The Speaker asks whether you want the bill referred to the Standing Committee on Education (which will examine it clause by clause over several weeks). Referring saves time from floor debate but delays the bill.",
        actor: "Speaker, Minister",
        article: "Art. 118 — Rules of Procedure",
        isDecision: true,
        choices: [
          { id: "committee", label: "Refer to Standing Committee on Education", consequence: "Excellent governance practice. The committee will examine the bill in detail, hear expert witnesses, and suggest improvements. Better law is the result, though it takes 3-6 months.", nextStepId: "committee-review", isCorrect: true },
          { id: "no-committee", label: "Take it up directly in the House", consequence: "Faster, but less thorough scrutiny. Critics may argue the bill was rushed through without expert examination.", nextStepId: "second-reading", isCorrect: false },
        ],
      },
      {
        id: "committee-review",
        title: "Step 6: Committee Examination",
        description: "The Standing Committee on Education meets over 4 months. They hear from teachers' unions, educationists, state education secretaries, and NGOs. They suggest 12 amendments — mostly technical improvements. The committee issues its report.",
        actor: "Parliamentary Standing Committee",
        article: "Art. 118 — Standing Committees",
        isDecision: false,
        outcome: "Committee Report submitted. 12 recommended amendments, mostly improving implementation clarity. The bill is stronger now. It returns to the House for Second Reading.",
      },
      {
        id: "second-reading",
        title: "Step 7: Second Reading Debate",
        description: "The bill comes up for Second Reading — the main debate stage. Opposition members raise issues about state autonomy (education is Concurrent List), funding adequacy, and right to education scope. The debate runs over 3 days.",
        actor: "Lok Sabha — All Members",
        article: "Art. 107 — Legislative procedure",
        isDecision: true,
        choices: [
          { id: "engage", label: "Engage with opposition concerns; accept some amendments", consequence: "Statesmanlike approach. Accepting reasonable amendments improves the law and may attract broader support. Coalition partners are satisfied.", nextStepId: "third-reading", isCorrect: true },
          { id: "ignore", label: "Use government's majority to steamroll — no amendments", consequence: "Politically expedient but short-sighted. Bill passes but states claim it violates federalism. Legal challenges filed. The bill's implementation becomes contested.", nextStepId: "third-reading", isCorrect: false },
        ],
      },
      {
        id: "third-reading",
        title: "Step 8: Third Reading & Vote",
        description: "After Second Reading debate concludes and amendments are voted on, the Third Reading takes place — the final vote on the bill as amended.",
        actor: "Lok Sabha — All Members",
        article: "Art. 100 — Voting",
        isDecision: false,
        outcome: "The bill passes Lok Sabha by 289 votes to 201. It now goes to Rajya Sabha.",
      },
      {
        id: "rajya-sabha",
        title: "Step 9: Rajya Sabha",
        description: "The bill is sent to Rajya Sabha. Being an ordinary bill, Rajya Sabha can amend it. The debate here focuses on the same federal issues — states' rights over education. After 2 days of debate, a vote is held.",
        actor: "Rajya Sabha — All Members",
        article: "Art. 107 — Rajya Sabha procedure",
        isDecision: false,
        outcome: "Rajya Sabha passes the bill with one additional amendment — requiring state consultation before any notification under the Act. Both Houses have now passed the bill.",
      },
      {
        id: "presidential-assent",
        title: "Step 10: Presidential Assent",
        description: "The bill is sent to the President for assent. The President reads it, consults the Attorney General on constitutional questions raised during debate. What happens next?",
        actor: "President of India",
        article: "Art. 111 — Presidential assent",
        isDecision: true,
        choices: [
          { id: "assent", label: "President signs — bill becomes Act", consequence: "Standard and expected. By constitutional convention, President assents to bills passed by Parliament. The President may return once for reconsideration but must assent the second time.", nextStepId: "complete", isCorrect: true },
          { id: "return", label: "President returns for reconsideration", consequence: "President can return once. Parliament can pass it again, possibly with modifications addressing concerns. President must then give assent.", nextStepId: "complete", isCorrect: true },
        ],
      },
      {
        id: "complete",
        title: "Act Published!",
        description: "The President signs the bill. It is published in the Official Gazette as the Education Reform Act. The Ministry of Education issues a gazette notification setting the commencement date.",
        actor: "President, Ministry",
        article: "Art. 111",
        isDecision: false,
        outcome: "The Education Reform Act is now law. Implementation begins.",
      },
    ],
  },
  {
    id: "rti-filing",
    title: "File an RTI Application",
    description: "A government scheme is being implemented in your village. Funds have been allocated but no work has happened. File an RTI to find out where the money went.",
    topic: "rti",
    level: "beginner",
    startStepId: "identify",
    endMessage: "You successfully used RTI to expose fund misappropriation. The information you obtained can be used to file a complaint with the district collector, approach a higher court, or publish in media to create accountability.",
    steps: [
      {
        id: "identify",
        title: "Step 1: Identify the Public Authority",
        description: "₹50 lakh was allocated for road construction in your village under PMGSY (Pradhan Mantri Gram Sadak Yojana). Work has not started despite 2 years. You want to file RTI. Which authority do you approach?",
        actor: "Citizen",
        isDecision: true,
        choices: [
          { id: "bdo", label: "Block Development Officer (BDO) / District collector's office — implementing agency", consequence: "Correct! The BDO/District office is the implementing agency for PMGSY at block level. They have records of fund releases, work orders, and contractor details.", nextStepId: "application", isCorrect: true },
          { id: "state", label: "State government secretariat", consequence: "You could, but it's better to start with the directly implementing agency (BDO/district) who has the ground-level records you need.", nextStepId: "application", isCorrect: false },
          { id: "centre", label: "Ministry of Rural Development, New Delhi", consequence: "For a village road, the central ministry has only aggregate data. The detailed records are with the state/district implementing agency.", nextStepId: "application", isCorrect: false },
        ],
      },
      {
        id: "application",
        title: "Step 2: Write Your RTI Application",
        description: "Under RTI Act, your application must be in writing (typed or handwritten) in English, Hindi, or the official language of the state. What specific information do you ask for?",
        actor: "Citizen",
        article: "RTI Act, Section 6",
        isDecision: true,
        choices: [
          { id: "specific", label: "Ask specifically: funds received, expenditure, work orders issued, contractor name, inspection reports for PMGSY road in [village name]", consequence: "Excellent! Specific requests get specific answers. Clear questions make it harder for PIO to dodge with vague responses.", nextStepId: "fee", isCorrect: true },
          { id: "vague", label: "Ask generally: 'All information about government schemes in my village'", consequence: "Too vague. PIO can reject or provide partial information. Always ask for specific documents and specific information.", nextStepId: "fee", isCorrect: false },
        ],
      },
      {
        id: "fee",
        title: "Step 3: Pay the Fee",
        description: "You need to pay the RTI application fee. For Central government bodies it's ₹10. State rates vary (₹10-₹50 in most states). BPL card holders pay nothing. How do you pay?",
        actor: "Citizen + PIO",
        article: "RTI Act, Section 7",
        isDecision: false,
        outcome: "You pay ₹10 by postal order / treasury challan / demand draft addressed to the Accounts Officer of the BDO's office. Attach it to your application. Keep a copy of everything.",
      },
      {
        id: "response",
        title: "Step 4: No Response in 30 Days",
        description: "You filed the RTI 32 days ago. No response has come from the PIO. This counts as a deemed refusal under RTI Act. What do you do?",
        actor: "Citizen",
        article: "RTI Act, Section 7(1), 19(1)",
        isDecision: true,
        choices: [
          { id: "first-appeal", label: "File First Appeal with the Appellate Authority (senior officer in same office) within 30 days of deemed refusal", consequence: "Correct procedure. The Appellate Authority must decide within 30 days (or 45 in special circumstances). No fee for first appeal.", nextStepId: "first-appeal-result", isCorrect: true },
          { id: "cic", label: "Directly approach Central Information Commission", consequence: "You must exhaust First Appeal before going to CIC (Second Appeal). Skipping First Appeal means CIC will send you back.", nextStepId: "first-appeal-result", isCorrect: false },
        ],
      },
      {
        id: "first-appeal-result",
        title: "Step 5: First Appeal Decision",
        description: "The Appellate Authority (Additional BDO) hears your appeal and orders the PIO to provide the information within 15 days. The PIO provides some documents — but the contractor payment vouchers are missing.",
        actor: "Appellate Authority + PIO",
        article: "RTI Act, Section 19",
        isDecision: false,
        outcome: "Partial information received. Fund release records show ₹30 lakh released to the contractor. But no inspection reports, no completion certificate, no photos of work. The road doesn't exist.",
      },
      {
        id: "second-appeal",
        title: "Step 6: Second Appeal to Information Commission",
        description: "You've established through RTI that ₹30 lakh was paid for a road that doesn't exist. You file a Second Appeal to the State Information Commission for the missing documents (payment vouchers, inspection reports). What do you ask for?",
        actor: "Citizen + State Information Commission",
        article: "RTI Act, Section 19(3), 20",
        isDecision: true,
        choices: [
          { id: "penalty-info", label: "Ask for the missing documents AND request Information Commissioner to impose penalty on PIO for non-disclosure", consequence: "Smart. IC can impose ₹250/day penalty on PIO up to ₹25,000. This creates accountability and incentivizes disclosure.", nextStepId: "information-obtained", isCorrect: true },
          { id: "only-info", label: "Just ask for the missing documents", consequence: "You'll get the documents (probably) but no consequence for the PIO who ignored you for months.", nextStepId: "information-obtained", isCorrect: false },
        ],
      },
      {
        id: "information-obtained",
        title: "Step 7: Information Obtained",
        description: "The State Information Commissioner orders disclosure of all documents and imposes ₹15,000 penalty on the PIO. The documents reveal: the contractor received payment, submitted false completion certificates, and the BDO signed off without inspection.",
        actor: "Information Commissioner",
        article: "RTI Act, Section 20",
        isDecision: false,
        outcome: "You now have documentary proof of fraud. The RTI documents show: government funds paid for non-existent work; false certificates submitted; BDO's signature on approval.",
      },
      {
        id: "next-steps",
        title: "Step 8: What Next?",
        description: "Armed with RTI documents proving fraud, you have multiple options for follow-up action.",
        actor: "Citizen",
        isDecision: true,
        choices: [
          { id: "collector", label: "File complaint with District Collector with RTI documents as evidence", consequence: "District Collector can order inquiry, FIR, and recovery proceedings. RTI documents are admissible evidence.", nextStepId: "complete", isCorrect: true },
          { id: "media", label: "Share with local journalists and RTI activists for media coverage", consequence: "Media pressure can accelerate action. RTI documents give journalists documented evidence to report accurately.", nextStepId: "complete", isCorrect: true },
          { id: "police", label: "File FIR with police for fraud under IPC/BNS", consequence: "RTI documents are strong evidence of criminal fraud — false certification of government works for obtaining payment.", nextStepId: "complete", isCorrect: true },
        ],
      },
      {
        id: "complete",
        title: "RTI Mission Accomplished",
        description: "Your RTI journey has exposed fraud and created accountability. The District Collector orders a departmental inquiry. The contractor is blacklisted. An FIR is filed. The road will now be built.",
        actor: "Government machinery",
        isDecision: false,
        outcome: "RTI successfully used to create accountability. The process took 4 months but the result: a missing ₹30 lakh traced, fraud exposed, and accountability enforced.",
      },
    ],
  },
  {
    id: "election-process",
    title: "Model Code of Conduct — What Can a Ruling Party Do?",
    description: "You are the Chief Minister of a state. Elections are announced. Navigate what you can and cannot do under the Model Code of Conduct.",
    topic: "elections",
    level: "intermediate",
    startStepId: "mcc-start",
    endMessage: "You've learned how the Model Code of Conduct restrains the ruling party during elections — preventing government machinery from being misused as an electoral tool. The ECI enforces these rules to ensure a level playing field.",
    steps: [
      {
        id: "mcc-start",
        title: "Election Announced — MCC in Force",
        description: "The Election Commission announces elections for your state. The Model Code of Conduct comes into force immediately. You are Chief Minister with an election to win. What do you do first?",
        actor: "Chief Minister",
        isDecision: true,
        choices: [
          { id: "review", label: "Review the MCC guidelines with your legal team to understand restrictions", consequence: "Prudent. MCC violations can lead to ECI show-cause notices, adverse media coverage, and public perception of unfair tactics.", nextStepId: "scheme-question", isCorrect: true },
          { id: "ignore", label: "Continue governing as before — you're still CM", consequence: "Dangerous. MCC restricts many CM activities immediately. Violations lead to ECI notices.", nextStepId: "scheme-question", isCorrect: false },
        ],
      },
      {
        id: "scheme-question",
        title: "Can You Announce New Schemes?",
        description: "Your party wants to announce a free laptop scheme for students. Can you announce it now that MCC is in force?",
        actor: "Chief Minister",
        article: "MCC — Government Announcements",
        isDecision: true,
        choices: [
          { id: "no", label: "No — MCC prohibits announcing new schemes during election period", consequence: "Correct! MCC prohibits governments from announcing new schemes, beneficiary lists, or freebies that could influence voters. This is one of the most important MCC provisions.", nextStepId: "transfer-question", isCorrect: true },
          { id: "yes", label: "Yes — you're still the government, you can announce schemes", consequence: "Wrong. ECI will issue a show-cause notice. The announcement may be stayed. It counts as misuse of government position for electoral advantage.", nextStepId: "transfer-question", isCorrect: false },
        ],
      },
      {
        id: "transfer-question",
        title: "Government Officer Transfers",
        description: "A District Collector has been posting honestly without favoring your party. You want to transfer them to a remote district during elections. Can you?",
        actor: "Chief Minister",
        article: "MCC — Government Officers",
        isDecision: true,
        choices: [
          { id: "no-transfer", label: "No — senior officers cannot be transferred without ECI approval during elections", consequence: "Correct! Under MCC, all transfers of senior officers (IAS, IPS, IFS) during election period require ECI's prior approval. This prevents ruling party from placing loyal officers at key election positions.", nextStepId: "vehicle-question", isCorrect: true },
          { id: "yes-transfer", label: "Transfer immediately — you have administrative authority", consequence: "ECI will reverse the transfer and issue a notice. Transfers of senior officials require ECI approval during election period.", nextStepId: "vehicle-question", isCorrect: false },
        ],
      },
      {
        id: "vehicle-question",
        title: "Government Vehicles for Campaigning",
        description: "Your party needs vehicles to take supporters to rallies. Can you use the official government vehicles (CM's fleet, district vehicles) for this?",
        actor: "Chief Minister",
        article: "MCC — Government Resources",
        isDecision: true,
        choices: [
          { id: "no-vehicles", label: "No — government resources cannot be used for party campaigns", consequence: "Correct! Using government vehicles, buildings, government employees, or public resources for election campaigns is strictly prohibited under MCC.", nextStepId: "media-question", isCorrect: true },
          { id: "yes-vehicles", label: "Yes — as CM, you have access to government vehicles", consequence: "MCC violation. ECI will issue a show-cause notice. Political opponents will publicize it. Government vehicles are paid for by all citizens — cannot be used for one party's campaign.", nextStepId: "media-question", isCorrect: false },
        ],
      },
      {
        id: "media-question",
        title: "Government Advertisements During Campaigning",
        description: "Your government wants to run TV ads highlighting schemes implemented in the last 5 years — paid from government treasury. Allowed?",
        actor: "Chief Minister",
        article: "MCC — Government Advertisement",
        isDecision: true,
        choices: [
          { id: "no-ads", label: "No — government ads highlighting achievements are effectively political ads; prohibited during election period", consequence: "Correct! Government-funded advertising that promotes ruling party's achievements is prohibited under MCC — it uses taxpayer money as an electoral tool.", nextStepId: "rally-question", isCorrect: true },
          { id: "yes-ads", label: "Yes — these are informational government ads, not party ads", consequence: "ECI will issue notice. The distinction between 'government information' and 'party promotion' is recognized — MCC prohibits ads that benefit incumbent party by promoting their work.", nextStepId: "rally-question", isCorrect: false },
        ],
      },
      {
        id: "rally-question",
        title: "Election Rally — What's Allowed?",
        description: "You want to hold a campaign rally. Which of these is allowed under MCC?",
        actor: "Chief Minister",
        article: "MCC — Campaign guidelines",
        isDecision: true,
        choices: [
          { id: "private-rally", label: "Hold a rally with party funds, at a private ground, without using government staff", consequence: "Correct! Campaigning with party funds, at private venues, with party workers is allowed. MCC allows vigorous campaigning — it just restricts use of government resources.", nextStepId: "complete", isCorrect: true },
          { id: "govt-rally", label: "Hold a rally at the government stadium, using district administration to manage it", consequence: "MCC violation. Government properties and officials cannot be used for party events during elections.", nextStepId: "complete", isCorrect: false },
        ],
      },
      {
        id: "complete",
        title: "MCC Lesson Complete",
        description: "You've navigated the Model Code of Conduct. The principle is clear: during elections, the ruling party remains in power but cannot use government resources, funds, or machinery for electoral advantage. All parties compete on level ground.",
        actor: "Election Commission of India",
        isDecision: false,
        outcome: "Elections held. ECI reports no serious MCC violations. Result: fair elections where voters choose on merit, not because of government resource advantage.",
      },
    ],
  },
  {
    id: "pil-journey",
    title: "File a PIL — Protect a Public Right",
    description: "Air quality in your city has become hazardous. Children are being hospitalized. File a PIL to compel government action.",
    topic: "pil",
    level: "intermediate",
    startStepId: "identify-issue",
    endMessage: "Your PIL led to real change — monitoring committees, clean fuel mandates, and better air. PIL works best when backed by documented evidence and genuine public interest.",
    steps: [
      {
        id: "identify-issue",
        title: "Step 1: The Issue",
        description: "Air quality (AQI) in your city has been 'Severe' (500+) for 30 straight days. Children's hospitals are full. The state government and municipality have done nothing despite 3 months of public complaints. What's your first step in filing a PIL?",
        actor: "Citizen / NGO",
        isDecision: true,
        choices: [
          { id: "evidence", label: "Gather evidence: AQI data, hospital admission statistics, government's inaction documentation", consequence: "Essential first step. PIL courts need evidence. Collect: CPCB AQI data, hospital records, government orders (or lack thereof), media reports, expert opinions.", nextStepId: "court-choice", isCorrect: true },
          { id: "direct", label: "Directly file petition without collecting evidence", consequence: "Court will ask for evidence. Weak PILs get dismissed. Always document the issue thoroughly before filing.", nextStepId: "court-choice", isCorrect: false },
        ],
      },
      {
        id: "court-choice",
        title: "Step 2: Which Court?",
        description: "The pollution affects your city and surrounding districts in one state. Which court should you approach?",
        actor: "Petitioner",
        article: "Art. 32, 226; National Green Tribunal Act",
        isDecision: true,
        choices: [
          { id: "ngt", label: "National Green Tribunal (NGT) — specialized environmental court", consequence: "Best choice for environmental matters. NGT has technical expertise, can order immediate interim relief, and has nationwide enforcement powers.", nextStepId: "draft-petition", isCorrect: true },
          { id: "hc", label: "High Court (Art. 226 writ)", consequence: "Valid. HC has environmental PIL jurisdiction. But NGT has technical expertise specific to environment cases and may be more effective for this issue.", nextStepId: "draft-petition", isCorrect: true },
          { id: "sc", label: "Directly approach Supreme Court", consequence: "SC requires you to exhaust state remedies first. For air pollution, NGT or HC first, then SC on appeal if state courts fail.", nextStepId: "draft-petition", isCorrect: false },
        ],
      },
      {
        id: "draft-petition",
        title: "Step 3: Draft the Petition",
        description: "What should your PIL petition include?",
        actor: "Petitioner + Lawyer",
        article: "Art. 226 / NGT Act",
        isDecision: true,
        choices: [
          { id: "comprehensive", label: "Facts with AQI data, constitutional basis (Art. 21 — right to healthy life), relief sought (specific actions), and respondents (state government, PCB, municipality)", consequence: "Well-drafted. Good PIL petitions cite constitutional rights violated, specific facts, named respondents, and specific relief sought — not vague 'do something' orders.", nextStepId: "admission", isCorrect: true },
          { id: "vague", label: "Simply state 'air is bad, do something' — court will figure out the rest", consequence: "Courts reject vague petitions. You need specific facts, specific violations, and specific relief asked.", nextStepId: "admission", isCorrect: false },
        ],
      },
      {
        id: "admission",
        title: "Step 4: Admission Hearing",
        description: "The NGT bench hears your PIL for admission. The judges ask: 'Is this genuinely in public interest? Is there prima facie evidence?' Your AQI data and hospital records impress the bench.",
        actor: "NGT Bench",
        article: "NGT Act 2010",
        isDecision: false,
        outcome: "PIL admitted. NGT issues notices to state government, Pollution Control Board, and municipal corporation to file their response within 4 weeks. Interim order: ban on crop burning and firecrackers pending next hearing.",
      },
      {
        id: "government-response",
        title: "Step 5: Government Responds",
        description: "Government files its response: 'Steps are being taken. AQI monitoring expanded. Action plan underway.' The response is vague — no specific timelines or targets. What do you argue?",
        actor: "Petitioner",
        isDecision: true,
        choices: [
          { id: "specific", label: "Argue the response lacks specific timelines, measurable targets, and enforcement mechanisms — request court to mandate specific actions", consequence: "Courts respond well to specific, measurable relief. Request: ban on diesel generators, CNG conversion plan with timeline, emergency school closure protocol at AQI 400+.", nextStepId: "final-order", isCorrect: true },
          { id: "accept", label: "Accept the government's response — they say they're working on it", consequence: "Too passive. Courts expect petitioners to pushback on vague government responses. 'Steps are being taken' without specifics is not accountability.", nextStepId: "final-order", isCorrect: false },
        ],
      },
      {
        id: "final-order",
        title: "Step 6: Final Order",
        description: "After 4 hearings over 6 months, the NGT issues its final order. It mandates: ban on industries without scrubbers, CNG conversion of city buses within 2 years, green belt development, monthly AQI reports to the Tribunal, and a ₹50,000 fine per day on the state PCB for non-compliance.",
        actor: "NGT",
        isDecision: false,
        outcome: "Comprehensive order issued. Monitoring committee constituted. Government must report monthly. Non-compliance penalties create real incentive. Your PIL has made history.",
      },
      {
        id: "complete",
        title: "PIL Impact",
        description: "Six months after the NGT order: AQI has improved to 'Moderate' levels. Industry compliance at 80%. City buses converting to CNG. Media coverage credited the PIL. Children's hospital admissions down 35%.",
        actor: "All stakeholders",
        isDecision: false,
        outcome: "PIL achieved what years of public complaints could not. Legal action forced accountability. This is the power of PIL used in genuine public interest.",
      },
    ],
  },
];

export function getSimulation(id: string): Simulation | undefined {
  return SIMULATIONS.find((s) => s.id === id);
}
