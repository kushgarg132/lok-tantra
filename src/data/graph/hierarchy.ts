export type BranchType = "foundation" | "executive" | "legislative" | "judicial" | "independent";

export interface HierarchyNode {
  id: string;
  name: string;
  role?: string;
  article?: string;
  branch: BranchType;
  appointedBy?: string;
  children?: HierarchyNode[];
}

export const BRANCH_COLORS: Record<BranchType, { stroke: string; fill: string; text: string }> = {
  foundation:  { stroke: "#D97706", fill: "#FEF3C7", text: "#92400E" },
  executive:   { stroke: "#3B82F6", fill: "#EFF6FF", text: "#1E40AF" },
  legislative: { stroke: "#F97316", fill: "#FFF7ED", text: "#9A3412" },
  judicial:    { stroke: "#10B981", fill: "#ECFDF5", text: "#065F46" },
  independent: { stroke: "#8B5CF6", fill: "#F5F3FF", text: "#5B21B6" },
};

export const POWER_HIERARCHY: HierarchyNode = {
  id: "root",
  name: "Republic of India",
  role: "Constitutional Democracy",
  branch: "foundation",
  children: [
    {
      id: "constitution",
      name: "Constitution of India",
      role: "Supreme Law — Art. 13",
      article: "Art. 13",
      branch: "foundation",
    },
    {
      id: "president",
      name: "President of India",
      role: "Constitutional Head of State",
      article: "Art. 52–62",
      branch: "executive",
      appointedBy: "Electoral College",
      children: [
        {
          id: "council-ministers",
          name: "Council of Ministers",
          role: "Real Executive — Art. 74",
          article: "Art. 74–75",
          branch: "executive",
          children: [
            {
              id: "pm",
              name: "Prime Minister",
              role: "Head of Government",
              article: "Art. 75",
              branch: "executive",
              children: [
                {
                  id: "pmo",
                  name: "Prime Minister's Office",
                  role: "PMO — Policy Coordination",
                  branch: "executive",
                },
                {
                  id: "cabinet-committees",
                  name: "Cabinet Committees",
                  role: "CCS, CCEA, CCA, ACC",
                  article: "Art. 77",
                  branch: "executive",
                  children: [
                    { id: "ccs",  name: "CC on Security (CCS)",        branch: "executive", role: "Nuclear, defence, intelligence" },
                    { id: "ccea", name: "CC on Economic Affairs (CCEA)", branch: "executive", role: "Economic policy, projects" },
                    { id: "acc",  name: "Appointments Committee (ACC)", branch: "executive", role: "Senior IAS/IPS appointments" },
                  ],
                },
                {
                  id: "niti",
                  name: "NITI Aayog",
                  role: "Policy Think Tank (replaced Planning Commission)",
                  branch: "executive",
                },
                {
                  id: "ministries",
                  name: "Union Ministries (28+)",
                  role: "Cabinet + MoS (I/C)",
                  article: "Art. 77",
                  branch: "executive",
                  children: [
                    { id: "mha",    name: "Home Affairs",    branch: "executive", role: "Internal security, states" },
                    { id: "mea",    name: "External Affairs", branch: "executive", role: "Foreign policy, treaties" },
                    { id: "mof",    name: "Finance",          branch: "executive", role: "Budget, taxation, economy" },
                    { id: "mod",    name: "Defence",          branch: "executive", role: "Armed forces, borders" },
                  ],
                },
              ],
            },
            { id: "cabinet-ministers", name: "Cabinet Ministers", role: "18 Senior Ministers", branch: "executive" },
            { id: "mos",               name: "Ministers of State", role: "36 Junior Ministers", branch: "executive" },
          ],
        },
        {
          id: "governors",
          name: "Governors (36)",
          role: "Constitutional Head of States/UTs",
          article: "Art. 153–162",
          branch: "executive",
          children: [
            {
              id: "state-govt",
              name: "State Governments",
              role: "28 States + 3 LAs",
              article: "Art. 163",
              branch: "executive",
              children: [
                { id: "cms",    name: "Chief Ministers",    branch: "executive", role: "Head of state government" },
                { id: "slegi",  name: "State Legislatures", branch: "legislative", role: "Vidhan Sabha + Vidhan Parishad" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "parliament",
      name: "Parliament of India",
      role: "Supreme Legislative Body",
      article: "Art. 79",
      branch: "legislative",
      children: [
        {
          id: "lok-sabha",
          name: "Lok Sabha",
          role: "Lower House — 543 elected seats",
          article: "Art. 81",
          branch: "legislative",
          children: [
            { id: "ls-speaker",   name: "Speaker / Pro-Tem",       branch: "legislative", role: "Presides over LS proceedings" },
            { id: "ls-committees", name: "Parliamentary Committees", branch: "legislative", role: "PAC, Estimates, Standing Committees" },
          ],
        },
        {
          id: "rajya-sabha",
          name: "Rajya Sabha",
          role: "Upper House — 250 seats",
          article: "Art. 80",
          branch: "legislative",
          children: [
            { id: "vp",          name: "Vice President (Chairman)", branch: "executive",   role: "Ex-officio Chairman of RS" },
            { id: "rs-deputy",   name: "Deputy Chairman",           branch: "legislative", role: "Presides in VP's absence" },
          ],
        },
      ],
    },
    {
      id: "judiciary",
      name: "Judiciary",
      role: "Independent — Art. 124",
      article: "Art. 124–147",
      branch: "judicial",
      children: [
        {
          id: "sc",
          name: "Supreme Court of India",
          role: "Apex Court — Final interpreter of Constitution",
          article: "Art. 124–130",
          branch: "judicial",
          children: [
            { id: "cji",  name: "Chief Justice of India", branch: "judicial", role: "Art. 124 — appointed by President" },
            { id: "sc-j", name: "33 Puisne Judges",       branch: "judicial", role: "Full court strength" },
          ],
        },
        {
          id: "hc",
          name: "High Courts (25)",
          role: "State apex courts — Art. 214",
          article: "Art. 214–231",
          branch: "judicial",
        },
        {
          id: "sub-courts",
          name: "Subordinate Courts",
          role: "District / Sessions / Magistrate courts",
          branch: "judicial",
        },
      ],
    },
    {
      id: "independent-bodies",
      name: "Constitutional Bodies",
      role: "Art. 148, 315, 324 etc.",
      branch: "independent",
      children: [
        { id: "eci",  name: "Election Commission",   branch: "independent", article: "Art. 324", role: "Free & fair elections" },
        { id: "cag",  name: "CAG",                   branch: "independent", article: "Art. 148", role: "Public accounts audit" },
        { id: "upsc", name: "UPSC",                  branch: "independent", article: "Art. 315", role: "Civil services recruitment" },
        { id: "fc",   name: "Finance Commission",    branch: "independent", article: "Art. 280", role: "Centre-state fiscal devolution" },
      ],
    },
  ],
};
