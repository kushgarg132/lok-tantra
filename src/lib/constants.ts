export const SITE_NAME = "LokTantra";
export const SITE_DESCRIPTION =
  "The operating system for understanding Indian democracy";
export const SITE_TAGLINE =
  "Explore, learn, and participate in Indian governance";

export const NAVIGATION = [
  {
    label: "Explore",
    items: [
      {
        href: "/power-structure",
        label: "Power Structure",
        description: "Interactive governance hierarchy",
        icon: "Network",
      },
      {
        href: "/institutions",
        label: "Institutions",
        description: "Government bodies and organs",
        icon: "Building2",
      },
      {
        href: "/representatives",
        label: "Find Representatives",
        description: "Discover your elected officials",
        icon: "Users",
      },
      {
        href: "/map",
        label: "Governance Map",
        description: "Geographic view of governance",
        icon: "Map",
      },
    ],
  },
  {
    label: "Learn",
    items: [
      {
        href: "/constitution",
        label: "Constitution",
        description: "Interactive Constitution of India",
        icon: "BookOpen",
      },
      {
        href: "/learn",
        label: "Learning Paths",
        description: "Beginner to expert education",
        icon: "GraduationCap",
      },
      {
        href: "/simulator",
        label: "Governance Simulator",
        description: "Simulate democratic processes",
        icon: "PlayCircle",
      },
      {
        href: "/timeline",
        label: "Political History",
        description: "Interactive historical timeline",
        icon: "Clock",
      },
    ],
  },
  {
    label: "Analyze",
    items: [
      {
        href: "/elections",
        label: "Elections",
        description: "Election data and analytics",
        icon: "BarChart3",
      },
      {
        href: "/parties",
        label: "Political Parties",
        description: "Party profiles and ideologies",
        icon: "Flag",
      },
      {
        href: "/judiciary",
        label: "Judiciary",
        description: "Courts and landmark judgments",
        icon: "Scale",
      },
      {
        href: "/bureaucracy",
        label: "Bureaucracy",
        description: "Administrative machinery",
        icon: "Briefcase",
      },
    ],
  },
  {
    label: "Participate",
    items: [
      {
        href: "/citizen-action",
        label: "Citizen Action",
        description: "RTI, PIL, grievances, and more",
        icon: "Megaphone",
      },
      {
        href: "/assistant",
        label: "Governance Assistant",
        description: "AI-powered governance Q&A",
        icon: "Bot",
      },
      {
        href: "/dashboard",
        label: "Live Dashboard",
        description: "Real-time governance updates",
        icon: "Activity",
      },
    ],
  },
] as const;

export const STATES_AND_UTS = [
  { name: "Andhra Pradesh", code: "AP", type: "state", capital: "Amaravati", lsSeats: 25, rsSeats: 11, assemblySeats: 175 },
  { name: "Arunachal Pradesh", code: "AR", type: "state", capital: "Itanagar", lsSeats: 2, rsSeats: 1, assemblySeats: 60 },
  { name: "Assam", code: "AS", type: "state", capital: "Dispur", lsSeats: 14, rsSeats: 7, assemblySeats: 126 },
  { name: "Bihar", code: "BR", type: "state", capital: "Patna", lsSeats: 40, rsSeats: 16, assemblySeats: 243 },
  { name: "Chhattisgarh", code: "CG", type: "state", capital: "Raipur", lsSeats: 11, rsSeats: 5, assemblySeats: 90 },
  { name: "Goa", code: "GA", type: "state", capital: "Panaji", lsSeats: 2, rsSeats: 1, assemblySeats: 40 },
  { name: "Gujarat", code: "GJ", type: "state", capital: "Gandhinagar", lsSeats: 26, rsSeats: 11, assemblySeats: 182 },
  { name: "Haryana", code: "HR", type: "state", capital: "Chandigarh", lsSeats: 10, rsSeats: 5, assemblySeats: 90 },
  { name: "Himachal Pradesh", code: "HP", type: "state", capital: "Shimla", lsSeats: 4, rsSeats: 3, assemblySeats: 68 },
  { name: "Jharkhand", code: "JH", type: "state", capital: "Ranchi", lsSeats: 14, rsSeats: 6, assemblySeats: 81 },
  { name: "Karnataka", code: "KA", type: "state", capital: "Bengaluru", lsSeats: 28, rsSeats: 12, assemblySeats: 224 },
  { name: "Kerala", code: "KL", type: "state", capital: "Thiruvananthapuram", lsSeats: 20, rsSeats: 9, assemblySeats: 140 },
  { name: "Madhya Pradesh", code: "MP", type: "state", capital: "Bhopal", lsSeats: 29, rsSeats: 11, assemblySeats: 230 },
  { name: "Maharashtra", code: "MH", type: "state", capital: "Mumbai", lsSeats: 48, rsSeats: 19, assemblySeats: 288 },
  { name: "Manipur", code: "MN", type: "state", capital: "Imphal", lsSeats: 2, rsSeats: 1, assemblySeats: 60 },
  { name: "Meghalaya", code: "ML", type: "state", capital: "Shillong", lsSeats: 2, rsSeats: 1, assemblySeats: 60 },
  { name: "Mizoram", code: "MZ", type: "state", capital: "Aizawl", lsSeats: 1, rsSeats: 1, assemblySeats: 40 },
  { name: "Nagaland", code: "NL", type: "state", capital: "Kohima", lsSeats: 1, rsSeats: 1, assemblySeats: 60 },
  { name: "Odisha", code: "OD", type: "state", capital: "Bhubaneswar", lsSeats: 21, rsSeats: 10, assemblySeats: 147 },
  { name: "Punjab", code: "PB", type: "state", capital: "Chandigarh", lsSeats: 13, rsSeats: 7, assemblySeats: 117 },
  { name: "Rajasthan", code: "RJ", type: "state", capital: "Jaipur", lsSeats: 25, rsSeats: 10, assemblySeats: 200 },
  { name: "Sikkim", code: "SK", type: "state", capital: "Gangtok", lsSeats: 1, rsSeats: 1, assemblySeats: 32 },
  { name: "Tamil Nadu", code: "TN", type: "state", capital: "Chennai", lsSeats: 39, rsSeats: 18, assemblySeats: 234 },
  { name: "Telangana", code: "TS", type: "state", capital: "Hyderabad", lsSeats: 17, rsSeats: 7, assemblySeats: 119 },
  { name: "Tripura", code: "TR", type: "state", capital: "Agartala", lsSeats: 2, rsSeats: 1, assemblySeats: 60 },
  { name: "Uttar Pradesh", code: "UP", type: "state", capital: "Lucknow", lsSeats: 80, rsSeats: 31, assemblySeats: 403 },
  { name: "Uttarakhand", code: "UK", type: "state", capital: "Dehradun", lsSeats: 5, rsSeats: 3, assemblySeats: 70 },
  { name: "West Bengal", code: "WB", type: "state", capital: "Kolkata", lsSeats: 42, rsSeats: 16, assemblySeats: 294 },
  { name: "Delhi", code: "DL", type: "ut", capital: "New Delhi", lsSeats: 7, rsSeats: 3, assemblySeats: 70 },
  { name: "Jammu & Kashmir", code: "JK", type: "ut", capital: "Srinagar", lsSeats: 5, rsSeats: 4, assemblySeats: 90 },
  { name: "Puducherry", code: "PY", type: "ut", capital: "Puducherry", lsSeats: 1, rsSeats: 1, assemblySeats: 30 },
  { name: "Chandigarh", code: "CH", type: "ut", capital: "Chandigarh", lsSeats: 1, rsSeats: 0, assemblySeats: 0 },
  { name: "Andaman & Nicobar", code: "AN", type: "ut", capital: "Port Blair", lsSeats: 1, rsSeats: 0, assemblySeats: 0 },
  { name: "Dadra Nagar Haveli & Daman Diu", code: "DD", type: "ut", capital: "Daman", lsSeats: 2, rsSeats: 0, assemblySeats: 0 },
  { name: "Lakshadweep", code: "LD", type: "ut", capital: "Kavaratti", lsSeats: 1, rsSeats: 0, assemblySeats: 0 },
  { name: "Ladakh", code: "LA", type: "ut", capital: "Leh", lsSeats: 1, rsSeats: 0, assemblySeats: 0 },
] as const;

export const BRANCHES_OF_GOVERNMENT = [
  {
    id: "legislature",
    name: "Legislature",
    description: "Makes laws",
    color: "#FF9933",
    icon: "Landmark",
    bodies: ["Parliament", "State Legislatures"],
  },
  {
    id: "executive",
    name: "Executive",
    description: "Implements laws",
    color: "#000080",
    icon: "Building2",
    bodies: ["President", "Prime Minister", "Council of Ministers", "Bureaucracy"],
  },
  {
    id: "judiciary",
    name: "Judiciary",
    description: "Interprets laws",
    color: "#138808",
    icon: "Scale",
    bodies: ["Supreme Court", "High Courts", "District Courts"],
  },
] as const;
