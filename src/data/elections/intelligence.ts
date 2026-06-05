// Election Intelligence — comprehensive static data for LokTantra
// All figures are accurate to public record / ECI data through 2024 LS elections

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface LsElectionMeta {
  year: number;
  lsNo: number;
  turnout: number;
  seats: number;
  winner: string;
  winnerColor: string;
  winnerSeats: number;
}

/** Flat historical row: INC / BJP (Jan Sangh pre-1977, Janata 1977) / Left (CPM+CPI) / SP / total */
export interface LsHistoryRow {
  year: number;
  seats: number;
  INC: number;
  BJP: number;
  Left: number;
  SP: number;
  incShare: number; // vote share %
  bjpShare: number;
  leftShare: number;
  turnout: number;
}

export interface State2024 {
  state: string;
  code: string;
  seats: number;
  dominant: string;
  dominantColor: string;
  dominantSeats: number;
  alliance: "NDA" | "INDIA" | "Other";
  turnout: number;
  ndaSeats: number;
  indiaSeats: number;
  otherSeats: number;
}

export interface RsParty {
  party: string;
  abbr: string;
  color: string;
  seats: number;
  alliance: "NDA" | "INDIA" | "Regional" | "Nominated";
}

export interface StateAssemblyElection {
  state: string;
  year: number;
  totalSeats: number;
  winner: string;
  winnerColor: string;
  winnerSeats: number;
  runnerUp: string;
  runnerUpSeats: number;
  turnout: number;
}

export interface CoalitionParty {
  name: string;
  abbr: string;
  color: string;
  seats: number;
}

export interface Coalition {
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  totalSeats: number;
  parties: CoalitionParty[];
}

export interface Constituency {
  id: number;
  name: string;
  state: string;
  winner: string;
  winnerParty: string;
  partyColor: string;
  votes: number;
  margin: number;
  turnout: number;
  reserved: null | "SC" | "ST";
}

/** Parliament seat entry for the semicircle diagram — ordered left (opposition) to right (treasury) */
export interface ParliamentSeat {
  party: string;
  abbr: string;
  color: string;
  seats: number;
  alliance: "NDA" | "INDIA" | "Other";
}

// ─── Party Colours ────────────────────────────────────────────────────────────
export const PARTY_COLORS: Record<string, string> = {
  BJP: "#FF9933",
  INC: "#1565C0",
  SP: "#EF4444",
  TMC: "#059669",
  DMK: "#DC143C",
  TDP: "#D97706",
  JDU: "#0891B2",
  NCP: "#7C3AED",
  AAP: "#06B6D4",
  RJD: "#7F1D1D",
  JMM: "#2E7D32",
  NC: "#1A237E",
  "SS-UBT": "#F97316",
  SS: "#EA580C",
  CPM: "#B91C1C",
  CPI: "#991B1B",
  Left: "#B91C1C",
  AIMIM: "#1B5E20",
  YSRCP: "#F59E0B",
  BRS: "#E91E63",
  AGP: "#795548",
  Others: "#64748B",
  Regional: "#78716C",
};

// ─── LS Elections 1952-2024 ──────────────────────────────────────────────────
export const LS_ELECTIONS: LsElectionMeta[] = [
  { year: 1952, lsNo: 1,  turnout: 45.7, seats: 489, winner: "INC",     winnerColor: "#1565C0", winnerSeats: 364 },
  { year: 1957, lsNo: 2,  turnout: 47.7, seats: 494, winner: "INC",     winnerColor: "#1565C0", winnerSeats: 371 },
  { year: 1962, lsNo: 3,  turnout: 55.4, seats: 494, winner: "INC",     winnerColor: "#1565C0", winnerSeats: 361 },
  { year: 1967, lsNo: 4,  turnout: 61.3, seats: 520, winner: "INC",     winnerColor: "#1565C0", winnerSeats: 283 },
  { year: 1971, lsNo: 5,  turnout: 55.3, seats: 518, winner: "INC",     winnerColor: "#1565C0", winnerSeats: 352 },
  { year: 1977, lsNo: 6,  turnout: 60.5, seats: 542, winner: "Janata",  winnerColor: "#9CA3AF", winnerSeats: 295 },
  { year: 1980, lsNo: 7,  turnout: 57.0, seats: 542, winner: "INC(I)",  winnerColor: "#1565C0", winnerSeats: 353 },
  { year: 1984, lsNo: 8,  turnout: 64.1, seats: 514, winner: "INC",     winnerColor: "#1565C0", winnerSeats: 414 },
  { year: 1989, lsNo: 9,  turnout: 62.0, seats: 543, winner: "INC",     winnerColor: "#1565C0", winnerSeats: 197 },
  { year: 1991, lsNo: 10, turnout: 57.0, seats: 543, winner: "INC",     winnerColor: "#1565C0", winnerSeats: 244 },
  { year: 1996, lsNo: 11, turnout: 58.0, seats: 543, winner: "BJP",     winnerColor: "#FF9933", winnerSeats: 161 },
  { year: 1998, lsNo: 12, turnout: 62.0, seats: 543, winner: "BJP",     winnerColor: "#FF9933", winnerSeats: 182 },
  { year: 1999, lsNo: 13, turnout: 60.0, seats: 543, winner: "BJP",     winnerColor: "#FF9933", winnerSeats: 182 },
  { year: 2004, lsNo: 14, turnout: 58.1, seats: 543, winner: "INC",     winnerColor: "#1565C0", winnerSeats: 145 },
  { year: 2009, lsNo: 15, turnout: 58.2, seats: 543, winner: "INC",     winnerColor: "#1565C0", winnerSeats: 206 },
  { year: 2014, lsNo: 16, turnout: 66.4, seats: 543, winner: "BJP",     winnerColor: "#FF9933", winnerSeats: 282 },
  { year: 2019, lsNo: 17, turnout: 67.4, seats: 543, winner: "BJP",     winnerColor: "#FF9933", winnerSeats: 303 },
  { year: 2024, lsNo: 18, turnout: 65.8, seats: 543, winner: "BJP",     winnerColor: "#FF9933", winnerSeats: 240 },
];

/** Party seat & vote-share history, 18 elections (index-matched with LS_ELECTIONS) */
export const LS_HISTORY: LsHistoryRow[] = [
  { year: 1952, seats: 489, INC: 364, BJP: 3,   Left: 28, SP: 0,  incShare: 45.0, bjpShare: 3.1,  leftShare: 8.0,  turnout: 45.7 },
  { year: 1957, seats: 494, INC: 371, BJP: 4,   Left: 34, SP: 0,  incShare: 47.8, bjpShare: 5.9,  leftShare: 9.0,  turnout: 47.7 },
  { year: 1962, seats: 494, INC: 361, BJP: 14,  Left: 52, SP: 0,  incShare: 44.7, bjpShare: 6.4,  leftShare: 10.2, turnout: 55.4 },
  { year: 1967, seats: 520, INC: 283, BJP: 35,  Left: 42, SP: 0,  incShare: 40.8, bjpShare: 9.4,  leftShare: 8.5,  turnout: 61.3 },
  { year: 1971, seats: 518, INC: 352, BJP: 22,  Left: 48, SP: 0,  incShare: 43.7, bjpShare: 7.4,  leftShare: 10.2, turnout: 55.3 },
  { year: 1977, seats: 542, INC: 154, BJP: 295, Left: 29, SP: 0,  incShare: 34.5, bjpShare: 41.3, leftShare: 8.8,  turnout: 60.5 },
  { year: 1980, seats: 542, INC: 353, BJP: 31,  Left: 41, SP: 0,  incShare: 42.7, bjpShare: 19.0, leftShare: 10.2, turnout: 57.0 },
  { year: 1984, seats: 514, INC: 414, BJP: 2,   Left: 29, SP: 0,  incShare: 49.0, bjpShare: 7.4,  leftShare: 8.2,  turnout: 64.1 },
  { year: 1989, seats: 543, INC: 197, BJP: 85,  Left: 56, SP: 0,  incShare: 39.5, bjpShare: 11.5, leftShare: 10.5, turnout: 62.0 },
  { year: 1991, seats: 543, INC: 244, BJP: 120, Left: 58, SP: 5,  incShare: 36.5, bjpShare: 20.1, leftShare: 11.0, turnout: 57.0 },
  { year: 1996, seats: 543, INC: 140, BJP: 161, Left: 67, SP: 17, incShare: 28.8, bjpShare: 20.3, leftShare: 12.0, turnout: 58.0 },
  { year: 1998, seats: 543, INC: 141, BJP: 182, Left: 57, SP: 20, incShare: 25.8, bjpShare: 25.6, leftShare: 11.2, turnout: 62.0 },
  { year: 1999, seats: 543, INC: 114, BJP: 182, Left: 64, SP: 26, incShare: 28.3, bjpShare: 23.8, leftShare: 12.5, turnout: 60.0 },
  { year: 2004, seats: 543, INC: 145, BJP: 138, Left: 61, SP: 36, incShare: 26.5, bjpShare: 22.2, leftShare: 11.5, turnout: 58.1 },
  { year: 2009, seats: 543, INC: 206, BJP: 116, Left: 24, SP: 23, incShare: 28.5, bjpShare: 18.8, leftShare: 7.5,  turnout: 58.2 },
  { year: 2014, seats: 543, INC: 44,  BJP: 282, Left: 11, SP: 5,  incShare: 19.5, bjpShare: 31.0, leftShare: 4.1,  turnout: 66.4 },
  { year: 2019, seats: 543, INC: 52,  BJP: 303, Left: 6,  SP: 5,  incShare: 19.5, bjpShare: 37.4, leftShare: 2.7,  turnout: 67.4 },
  { year: 2024, seats: 543, INC: 99,  BJP: 240, Left: 5,  SP: 37, incShare: 21.2, bjpShare: 36.6, leftShare: 2.1,  turnout: 65.8 },
];

// ─── Parliament 2024 — seat order for semicircle diagram ──────────────────────
// Left (opposition) → centre (unaffiliated) → right (treasury bench / NDA)
export const PARLIAMENT_2024: ParliamentSeat[] = [
  // INDIA alliance — 234 seats
  { party: "JMM",        abbr: "JMM",    color: "#2E7D32", seats: 3,   alliance: "INDIA" },
  { party: "AAP",        abbr: "AAP",    color: "#06B6D4", seats: 3,   alliance: "INDIA" },
  { party: "Left",       abbr: "Left",   color: "#B91C1C", seats: 5,   alliance: "INDIA" },
  { party: "RJD",        abbr: "RJD",    color: "#7F1D1D", seats: 4,   alliance: "INDIA" },
  { party: "NCP (SP)",   abbr: "NCP-SP", color: "#7C3AED", seats: 8,   alliance: "INDIA" },
  { party: "SS (UBT)",   abbr: "SS-UBT", color: "#F97316", seats: 9,   alliance: "INDIA" },
  { party: "TMC",        abbr: "TMC",    color: "#059669", seats: 29,  alliance: "INDIA" },
  { party: "DMK",        abbr: "DMK",    color: "#DC143C", seats: 22,  alliance: "INDIA" },
  { party: "SP",         abbr: "SP",     color: "#EF4444", seats: 37,  alliance: "INDIA" },
  { party: "INC",        abbr: "INC",    color: "#1565C0", seats: 99,  alliance: "INDIA" },
  { party: "INDIA Oth.", abbr: "I-Oth",  color: "#475569", seats: 15,  alliance: "INDIA" },
  // Unaffiliated — 16 seats
  { party: "YSRCP",      abbr: "YSRCP",  color: "#F59E0B", seats: 4,   alliance: "Other" },
  { party: "Ind./Oth.",  abbr: "Oth",    color: "#9CA3AF", seats: 12,  alliance: "Other" },
  // NDA coalition — 293 seats
  { party: "NDA Oth.",   abbr: "NDA-O",  color: "#94A3B8", seats: 11,  alliance: "NDA"   },
  { party: "LJP-RV",     abbr: "LJP",    color: "#FBBF24", seats: 5,   alliance: "NDA"   },
  { party: "RLD",        abbr: "RLD",    color: "#34D399", seats: 2,   alliance: "NDA"   },
  { party: "SS",         abbr: "SS",     color: "#EA580C", seats: 7,   alliance: "NDA"   },
  { party: "JDU",        abbr: "JDU",    color: "#0891B2", seats: 12,  alliance: "NDA"   },
  { party: "TDP",        abbr: "TDP",    color: "#D97706", seats: 16,  alliance: "NDA"   },
  { party: "BJP",        abbr: "BJP",    color: "#FF9933", seats: 240, alliance: "NDA"   },
];

// ─── 2024 State-wise LS Results ──────────────────────────────────────────────
export const LS_2024_STATES: State2024[] = [
  { state: "Uttar Pradesh",     code: "UP", seats: 80, dominant: "SP",      dominantColor: "#EF4444", dominantSeats: 37, alliance: "INDIA", turnout: 57.4, ndaSeats: 36, indiaSeats: 43, otherSeats: 1  },
  { state: "Maharashtra",       code: "MH", seats: 48, dominant: "INC",     dominantColor: "#1565C0", dominantSeats: 13, alliance: "INDIA", turnout: 61.0, ndaSeats: 17, indiaSeats: 30, otherSeats: 1  },
  { state: "West Bengal",       code: "WB", seats: 42, dominant: "TMC",     dominantColor: "#059669", dominantSeats: 29, alliance: "INDIA", turnout: 73.0, ndaSeats: 12, indiaSeats: 30, otherSeats: 0  },
  { state: "Tamil Nadu",        code: "TN", seats: 39, dominant: "DMK",     dominantColor: "#DC143C", dominantSeats: 22, alliance: "INDIA", turnout: 69.1, ndaSeats: 1,  indiaSeats: 38, otherSeats: 0  },
  { state: "Bihar",             code: "BR", seats: 40, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 12, alliance: "NDA",   turnout: 56.2, ndaSeats: 30, indiaSeats: 10, otherSeats: 0  },
  { state: "Karnataka",         code: "KA", seats: 28, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 17, alliance: "NDA",   turnout: 69.5, ndaSeats: 19, indiaSeats: 9,  otherSeats: 0  },
  { state: "Andhra Pradesh",    code: "AP", seats: 25, dominant: "TDP",     dominantColor: "#D97706", dominantSeats: 16, alliance: "NDA",   turnout: 79.4, ndaSeats: 21, indiaSeats: 4,  otherSeats: 0  },
  { state: "Rajasthan",         code: "RJ", seats: 25, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 14, alliance: "NDA",   turnout: 58.2, ndaSeats: 14, indiaSeats: 8,  otherSeats: 3  },
  { state: "Madhya Pradesh",    code: "MP", seats: 29, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 29, alliance: "NDA",   turnout: 58.1, ndaSeats: 29, indiaSeats: 0,  otherSeats: 0  },
  { state: "Gujarat",           code: "GJ", seats: 26, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 25, alliance: "NDA",   turnout: 60.3, ndaSeats: 25, indiaSeats: 0,  otherSeats: 1  },
  { state: "Odisha",            code: "OD", seats: 21, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 20, alliance: "NDA",   turnout: 74.2, ndaSeats: 20, indiaSeats: 1,  otherSeats: 0  },
  { state: "Kerala",            code: "KL", seats: 20, dominant: "INC",     dominantColor: "#1565C0", dominantSeats: 18, alliance: "INDIA", turnout: 70.9, ndaSeats: 1,  indiaSeats: 19, otherSeats: 0  },
  { state: "Telangana",         code: "TS", seats: 17, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 8,  alliance: "NDA",   turnout: 63.2, ndaSeats: 8,  indiaSeats: 8,  otherSeats: 1  },
  { state: "Assam",             code: "AS", seats: 14, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 9,  alliance: "NDA",   turnout: 74.0, ndaSeats: 11, indiaSeats: 3,  otherSeats: 0  },
  { state: "Jharkhand",         code: "JH", seats: 14, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 8,  alliance: "NDA",   turnout: 65.6, ndaSeats: 9,  indiaSeats: 5,  otherSeats: 0  },
  { state: "Punjab",            code: "PB", seats: 13, dominant: "INC",     dominantColor: "#1565C0", dominantSeats: 7,  alliance: "INDIA", turnout: 60.8, ndaSeats: 2,  indiaSeats: 10, otherSeats: 1  },
  { state: "Chhattisgarh",      code: "CG", seats: 11, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 10, alliance: "NDA",   turnout: 72.1, ndaSeats: 10, indiaSeats: 1,  otherSeats: 0  },
  { state: "Haryana",           code: "HR", seats: 10, dominant: "INC",     dominantColor: "#1565C0", dominantSeats: 5,  alliance: "INDIA", turnout: 63.2, ndaSeats: 5,  indiaSeats: 5,  otherSeats: 0  },
  { state: "Delhi",             code: "DL", seats: 7,  dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 7,  alliance: "NDA",   turnout: 58.7, ndaSeats: 7,  indiaSeats: 0,  otherSeats: 0  },
  { state: "Jammu & Kashmir",   code: "JK", seats: 5,  dominant: "NC",      dominantColor: "#1A237E", dominantSeats: 2,  alliance: "INDIA", turnout: 57.8, ndaSeats: 2,  indiaSeats: 3,  otherSeats: 0  },
  { state: "Uttarakhand",       code: "UK", seats: 5,  dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 5,  alliance: "NDA",   turnout: 60.1, ndaSeats: 5,  indiaSeats: 0,  otherSeats: 0  },
  { state: "Himachal Pradesh",  code: "HP", seats: 4,  dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 4,  alliance: "NDA",   turnout: 72.3, ndaSeats: 4,  indiaSeats: 0,  otherSeats: 0  },
  { state: "Tripura",           code: "TR", seats: 2,  dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 2,  alliance: "NDA",   turnout: 80.4, ndaSeats: 2,  indiaSeats: 0,  otherSeats: 0  },
  { state: "Meghalaya",         code: "ML", seats: 2,  dominant: "VPP",     dominantColor: "#64748B", dominantSeats: 1,  alliance: "Other", turnout: 70.1, ndaSeats: 0,  indiaSeats: 1,  otherSeats: 1  },
  { state: "Manipur",           code: "MN", seats: 2,  dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 1,  alliance: "NDA",   turnout: 70.2, ndaSeats: 1,  indiaSeats: 0,  otherSeats: 1  },
  { state: "Arunachal Pradesh", code: "AR", seats: 2,  dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 2,  alliance: "NDA",   turnout: 80.3, ndaSeats: 2,  indiaSeats: 0,  otherSeats: 0  },
  { state: "Goa",               code: "GA", seats: 2,  dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 1,  alliance: "NDA",   turnout: 76.5, ndaSeats: 1,  indiaSeats: 1,  otherSeats: 0  },
  { state: "Nagaland",          code: "NL", seats: 1,  dominant: "NDPP",    dominantColor: "#64748B", dominantSeats: 1,  alliance: "NDA",   turnout: 62.1, ndaSeats: 1,  indiaSeats: 0,  otherSeats: 0  },
  { state: "Mizoram",           code: "MZ", seats: 1,  dominant: "ZPM",     dominantColor: "#6D28D9", dominantSeats: 1,  alliance: "Other", turnout: 56.9, ndaSeats: 0,  indiaSeats: 0,  otherSeats: 1  },
  { state: "Sikkim",            code: "SK", seats: 1,  dominant: "SKM",     dominantColor: "#059669", dominantSeats: 1,  alliance: "Other", turnout: 80.1, ndaSeats: 0,  indiaSeats: 0,  otherSeats: 1  },
  { state: "Chandigarh",        code: "CH", seats: 1,  dominant: "INC",     dominantColor: "#1565C0", dominantSeats: 1,  alliance: "INDIA", turnout: 68.3, ndaSeats: 0,  indiaSeats: 1,  otherSeats: 0  },
  { state: "Puducherry",        code: "PY", seats: 1,  dominant: "INC",     dominantColor: "#1565C0", dominantSeats: 1,  alliance: "INDIA", turnout: 80.5, ndaSeats: 0,  indiaSeats: 1,  otherSeats: 0  },
  { state: "A&N Islands",       code: "AN", seats: 1,  dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 1,  alliance: "NDA",   turnout: 72.4, ndaSeats: 1,  indiaSeats: 0,  otherSeats: 0  },
  { state: "Lakshadweep",       code: "LD", seats: 1,  dominant: "NCP-SP",  dominantColor: "#7C3AED", dominantSeats: 1,  alliance: "INDIA", turnout: 84.1, ndaSeats: 0,  indiaSeats: 1,  otherSeats: 0  },
  { state: "Ladakh",            code: "LA", seats: 1,  dominant: "Ind.",    dominantColor: "#64748B", dominantSeats: 1,  alliance: "Other", turnout: 72.0, ndaSeats: 0,  indiaSeats: 0,  otherSeats: 1  },
  { state: "DNH & DD",          code: "DD", seats: 2,  dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 2,  alliance: "NDA",   turnout: 71.2, ndaSeats: 2,  indiaSeats: 0,  otherSeats: 0  },
];

// ─── Rajya Sabha Composition (2024 approximate) ───────────────────────────────
export const RS_COMPOSITION: RsParty[] = [
  { party: "BJP",              abbr: "BJP",    color: "#FF9933", seats: 88, alliance: "NDA"       },
  { party: "Congress",         abbr: "INC",    color: "#1565C0", seats: 26, alliance: "INDIA"     },
  { party: "TMC",              abbr: "TMC",    color: "#059669", seats: 13, alliance: "INDIA"     },
  { party: "YSRCP",            abbr: "YSRCP",  color: "#F59E0B", seats: 11, alliance: "Regional"  },
  { party: "AAP",              abbr: "AAP",    color: "#06B6D4", seats: 10, alliance: "INDIA"     },
  { party: "DMK",              abbr: "DMK",    color: "#DC143C", seats: 10, alliance: "INDIA"     },
  { party: "BJD",              abbr: "BJD",    color: "#2563EB", seats: 8,  alliance: "Regional"  },
  { party: "JDU",              abbr: "JDU",    color: "#0891B2", seats: 5,  alliance: "NDA"       },
  { party: "BRS",              abbr: "BRS",    color: "#E91E63", seats: 5,  alliance: "Regional"  },
  { party: "AIADMK",           abbr: "ADMK",   color: "#1B5E20", seats: 4,  alliance: "Regional"  },
  { party: "CPM",              abbr: "CPM",    color: "#B91C1C", seats: 4,  alliance: "INDIA"     },
  { party: "SP",               abbr: "SP",     color: "#EF4444", seats: 3,  alliance: "INDIA"     },
  { party: "RJD",              abbr: "RJD",    color: "#7F1D1D", seats: 3,  alliance: "INDIA"     },
  { party: "SS (Shinde)",      abbr: "SS",     color: "#EA580C", seats: 3,  alliance: "NDA"       },
  { party: "NCP (Ajit)",       abbr: "NCP",    color: "#7C3AED", seats: 3,  alliance: "NDA"       },
  { party: "SAD",              abbr: "SAD",    color: "#1E40AF", seats: 3,  alliance: "NDA"       },
  { party: "SS (UBT)",         abbr: "SS-UBT", color: "#F97316", seats: 2,  alliance: "INDIA"     },
  { party: "NCP (SP)",         abbr: "NCP-SP", color: "#A78BFA", seats: 2,  alliance: "INDIA"     },
  { party: "Others",           abbr: "Oth",    color: "#64748B", seats: 28, alliance: "Regional"  },
  { party: "Nominated",        abbr: "Nom",    color: "#94A3B8", seats: 12, alliance: "Nominated" },
];

// ─── 2024 Coalitions ──────────────────────────────────────────────────────────
export const COALITIONS_2024: Coalition[] = [
  {
    name: "National Democratic Alliance",
    shortName: "NDA",
    color: "#FF9933",
    bgColor: "#FFF7ED",
    totalSeats: 293,
    parties: [
      { name: "BJP",          abbr: "BJP",   color: "#FF9933", seats: 240 },
      { name: "TDP",          abbr: "TDP",   color: "#D97706", seats: 16  },
      { name: "JDU",          abbr: "JDU",   color: "#0891B2", seats: 12  },
      { name: "SS (Shinde)",  abbr: "SS",    color: "#EA580C", seats: 7   },
      { name: "LJP-RV",       abbr: "LJP",   color: "#FBBF24", seats: 5   },
      { name: "RLD",          abbr: "RLD",   color: "#34D399", seats: 2   },
      { name: "Others",       abbr: "Oth",   color: "#94A3B8", seats: 11  },
    ],
  },
  {
    name: "INDIA Alliance",
    shortName: "INDIA",
    color: "#1565C0",
    bgColor: "#EFF6FF",
    totalSeats: 234,
    parties: [
      { name: "Congress",     abbr: "INC",    color: "#1565C0", seats: 99  },
      { name: "SP",           abbr: "SP",     color: "#EF4444", seats: 37  },
      { name: "TMC",          abbr: "TMC",    color: "#059669", seats: 29  },
      { name: "DMK",          abbr: "DMK",    color: "#DC143C", seats: 22  },
      { name: "SS (UBT)",     abbr: "SS-UBT", color: "#F97316", seats: 9   },
      { name: "NCP (SP)",     abbr: "NCP-SP", color: "#7C3AED", seats: 8   },
      { name: "RJD",          abbr: "RJD",    color: "#7F1D1D", seats: 4   },
      { name: "JMM",          abbr: "JMM",    color: "#2E7D32", seats: 3   },
      { name: "AAP",          abbr: "AAP",    color: "#06B6D4", seats: 3   },
      { name: "Left",         abbr: "Left",   color: "#B91C1C", seats: 5   },
      { name: "Others",       abbr: "Oth",    color: "#475569", seats: 15  },
    ],
  },
  {
    name: "Unaffiliated",
    shortName: "Others",
    color: "#64748B",
    bgColor: "#F8FAFC",
    totalSeats: 16,
    parties: [
      { name: "YSRCP",        abbr: "YSRCP", color: "#F59E0B", seats: 4   },
      { name: "Ind./Others",  abbr: "Oth",   color: "#9CA3AF", seats: 12  },
    ],
  },
];

// ─── State Assembly Elections (2022–2024) ─────────────────────────────────────
export const STATE_ASSEMBLIES: StateAssemblyElection[] = [
  { state: "Jharkhand",         year: 2024, totalSeats: 81,  winner: "JMM",     winnerColor: "#2E7D32", winnerSeats: 34, runnerUp: "BJP",     runnerUpSeats: 21, turnout: 68.5 },
  { state: "Maharashtra",       year: 2024, totalSeats: 288, winner: "BJP",     winnerColor: "#FF9933", winnerSeats: 132, runnerUp: "INC",    runnerUpSeats: 50, turnout: 65.0 },
  { state: "Haryana",           year: 2024, totalSeats: 90,  winner: "BJP",     winnerColor: "#FF9933", winnerSeats: 48, runnerUp: "INC",     runnerUpSeats: 37, turnout: 67.9 },
  { state: "Jammu & Kashmir",   year: 2024, totalSeats: 90,  winner: "NC",      winnerColor: "#1A237E", winnerSeats: 42, runnerUp: "BJP",     runnerUpSeats: 29, turnout: 63.6 },
  { state: "Andhra Pradesh",    year: 2024, totalSeats: 175, winner: "TDP",     winnerColor: "#D97706", winnerSeats: 135, runnerUp: "YSRCP",  runnerUpSeats: 11, turnout: 81.1 },
  { state: "Odisha",            year: 2024, totalSeats: 147, winner: "BJP",     winnerColor: "#FF9933", winnerSeats: 78, runnerUp: "BJD",     runnerUpSeats: 51, turnout: 74.1 },
  { state: "Rajasthan",         year: 2023, totalSeats: 200, winner: "BJP",     winnerColor: "#FF9933", winnerSeats: 115, runnerUp: "INC",    runnerUpSeats: 69, turnout: 75.1 },
  { state: "Madhya Pradesh",    year: 2023, totalSeats: 230, winner: "BJP",     winnerColor: "#FF9933", winnerSeats: 163, runnerUp: "INC",    runnerUpSeats: 66, turnout: 77.1 },
  { state: "Chhattisgarh",      year: 2023, totalSeats: 90,  winner: "BJP",     winnerColor: "#FF9933", winnerSeats: 54, runnerUp: "INC",     runnerUpSeats: 35, turnout: 76.4 },
  { state: "Telangana",         year: 2023, totalSeats: 119, winner: "INC",     winnerColor: "#1565C0", winnerSeats: 64, runnerUp: "BRS",     runnerUpSeats: 39, turnout: 73.1 },
  { state: "Mizoram",           year: 2023, totalSeats: 40,  winner: "ZPM",     winnerColor: "#6D28D9", winnerSeats: 27, runnerUp: "MNF",     runnerUpSeats: 10, turnout: 80.9 },
  { state: "Karnataka",         year: 2023, totalSeats: 224, winner: "INC",     winnerColor: "#1565C0", winnerSeats: 135, runnerUp: "BJP",    runnerUpSeats: 66, turnout: 72.7 },
  { state: "Gujarat",           year: 2022, totalSeats: 182, winner: "BJP",     winnerColor: "#FF9933", winnerSeats: 156, runnerUp: "INC",    runnerUpSeats: 17, turnout: 63.3 },
  { state: "Himachal Pradesh",  year: 2022, totalSeats: 68,  winner: "INC",     winnerColor: "#1565C0", winnerSeats: 40, runnerUp: "BJP",     runnerUpSeats: 25, turnout: 75.6 },
  { state: "Uttar Pradesh",     year: 2022, totalSeats: 403, winner: "BJP",     winnerColor: "#FF9933", winnerSeats: 255, runnerUp: "SP",     runnerUpSeats: 111, turnout: 60.5 },
  { state: "Punjab",            year: 2022, totalSeats: 117, winner: "AAP",     winnerColor: "#06B6D4", winnerSeats: 92, runnerUp: "INC",     runnerUpSeats: 18, turnout: 71.9 },
  { state: "Uttarakhand",       year: 2022, totalSeats: 70,  winner: "BJP",     winnerColor: "#FF9933", winnerSeats: 47, runnerUp: "INC",     runnerUpSeats: 19, turnout: 65.5 },
  { state: "Goa",               year: 2022, totalSeats: 40,  winner: "BJP",     winnerColor: "#FF9933", winnerSeats: 20, runnerUp: "INC",     runnerUpSeats: 11, turnout: 79.6 },
  { state: "Manipur",           year: 2022, totalSeats: 60,  winner: "BJP",     winnerColor: "#FF9933", winnerSeats: 32, runnerUp: "NPP",     runnerUpSeats: 7,  turnout: 88.1 },
];

// ─── Key Constituencies 2024 ──────────────────────────────────────────────────
export const KEY_CONSTITUENCIES: Constituency[] = [
  { id: 1,  name: "Varanasi",         state: "UP",         winner: "Narendra Modi",      winnerParty: "BJP",    partyColor: "#FF9933", votes: 612970, margin: 152513, turnout: 62.0, reserved: null  },
  { id: 2,  name: "Rae Bareli",       state: "UP",         winner: "Rahul Gandhi",       winnerParty: "INC",    partyColor: "#1565C0", votes: 687649, margin: 390030, turnout: 54.0, reserved: null  },
  { id: 3,  name: "Amethi",           state: "UP",         winner: "K. L. Sharma",       winnerParty: "INC",    partyColor: "#1565C0", votes: 540678, margin: 167196, turnout: 55.0, reserved: null  },
  { id: 4,  name: "Lucknow",          state: "UP",         winner: "Rajnath Singh",      winnerParty: "BJP",    partyColor: "#FF9933", votes: 680078, margin: 452442, turnout: 55.0, reserved: null  },
  { id: 5,  name: "Meerut",           state: "UP",         winner: "Arun Govil",         winnerParty: "BJP",    partyColor: "#FF9933", votes: 623412, margin: 114979, turnout: 59.0, reserved: null  },
  { id: 6,  name: "Azamgarh",         state: "UP",         winner: "Dharmendra Yadav",   winnerParty: "SP",     partyColor: "#EF4444", votes: 515060, margin: 97499,  turnout: 55.0, reserved: "SC" },
  { id: 7,  name: "Thiruvananthapuram", state: "Kerala",   winner: "Shashi Tharoor",     winnerParty: "INC",    partyColor: "#1565C0", votes: 358155, margin: 16077,  turnout: 71.9, reserved: null  },
  { id: 8,  name: "Wayanad",          state: "Kerala",     winner: "Rahul Gandhi",       winnerParty: "INC",    partyColor: "#1565C0", votes: 648931, margin: 364422, turnout: 73.0, reserved: "ST" },
  { id: 9,  name: "Hyderabad",        state: "Telangana",  winner: "Asaduddin Owaisi",   winnerParty: "AIMIM",  partyColor: "#1B5E20", votes: 506082, margin: 338087, turnout: 52.0, reserved: null  },
  { id: 10, name: "Surat",            state: "Gujarat",    winner: "Mukesh Dalal",       winnerParty: "BJP",    partyColor: "#FF9933", votes: 0,      margin: 0,      turnout: 34.0, reserved: null  },
  { id: 11, name: "Chandigarh",       state: "Chandigarh", winner: "Manish Tewari",      winnerParty: "INC",    partyColor: "#1565C0", votes: 194765, margin: 2504,   turnout: 68.3, reserved: null  },
  { id: 12, name: "Nagpur",           state: "Maharashtra",winner: "Nitin Gadkari",      winnerParty: "BJP",    partyColor: "#FF9933", votes: 679985, margin: 136893, turnout: 62.0, reserved: null  },
  { id: 13, name: "Mumbai North",     state: "Maharashtra",winner: "Piyush Goyal",       winnerParty: "BJP",    partyColor: "#FF9933", votes: 700452, margin: 420123, turnout: 61.0, reserved: null  },
  { id: 14, name: "Bengaluru South",  state: "Karnataka",  winner: "Tejasvi Surya",      winnerParty: "BJP",    partyColor: "#FF9933", votes: 774289, margin: 200220, turnout: 65.0, reserved: null  },
  { id: 15, name: "Patna Sahib",      state: "Bihar",      winner: "Ravi Shankar Prasad",winnerParty: "BJP",    partyColor: "#FF9933", votes: 598045, margin: 154118, turnout: 58.0, reserved: null  },
  { id: 16, name: "Kolkata North",    state: "West Bengal",winner: "Sudip Bandyopadhyay",winnerParty: "TMC",    partyColor: "#059669", votes: 613250, margin: 155140, turnout: 68.0, reserved: null  },
  { id: 17, name: "New Delhi",        state: "Delhi",      winner: "Bansuri Swaraj",     winnerParty: "BJP",    partyColor: "#FF9933", votes: 507810, margin: 78370,  turnout: 56.0, reserved: null  },
  { id: 18, name: "Bhopal",           state: "MP",         winner: "Alok Sharma",        winnerParty: "BJP",    partyColor: "#FF9933", votes: 879012, margin: 295245, turnout: 59.0, reserved: null  },
  { id: 19, name: "Indore",           state: "MP",         winner: "Shankar Lalwani",    winnerParty: "BJP",    partyColor: "#FF9933", votes: 1174005, margin: 1174005, turnout: 63.0, reserved: null },
  { id: 20, name: "Baramulla",        state: "J&K",        winner: "Sheikh Abdul Rashid",winnerParty: "Ind.",   partyColor: "#64748B", votes: 695105, margin: 204142, turnout: 62.0, reserved: null  },
  { id: 21, name: "Bastar",           state: "Chhattisgarh",winner: "Mahesh Kashyap",   winnerParty: "BJP",    partyColor: "#FF9933", votes: 381920, margin: 6019,   turnout: 74.0, reserved: "ST" },
  { id: 22, name: "Mandya",           state: "Karnataka",  winner: "Nikhil Kumaraswamy", winnerParty: "JDS",    partyColor: "#16A34A", votes: 612450, margin: 166116, turnout: 80.0, reserved: null  },
  { id: 23, name: "Coimbatore",       state: "Tamil Nadu", winner: "Ganapathy P. Rajkumar",winnerParty:"DMK",   partyColor: "#DC143C", votes: 599250, margin: 141064, turnout: 68.0, reserved: null  },
  { id: 24, name: "Srinagar",         state: "J&K",        winner: "Aga S. Ruhullah Mehdi",winnerParty:"NC",    partyColor: "#1A237E", votes: 573872, margin: 278311, turnout: 38.0, reserved: null  },
  { id: 25, name: "Kolkata South",    state: "West Bengal",winner: "Mala Roy",           winnerParty: "TMC",    partyColor: "#059669", votes: 602010, margin: 167543, turnout: 65.0, reserved: null  },
];

// ─── Vote Share vs Seats 2024 (for disparity analysis) ───────────────────────
export const VOTE_SEAT_DISPARITY_2024 = [
  { party: "BJP",    color: "#FF9933", voteShare: 36.56, seatShare: 44.20, seats: 240 },
  { party: "INC",   color: "#1565C0", voteShare: 21.19, seatShare: 18.23, seats: 99  },
  { party: "SP",    color: "#EF4444", voteShare: 6.84,  seatShare: 6.81,  seats: 37  },
  { party: "TMC",   color: "#059669", voteShare: 5.65,  seatShare: 5.34,  seats: 29  },
  { party: "DMK",   color: "#DC143C", voteShare: 4.07,  seatShare: 4.05,  seats: 22  },
  { party: "TDP",   color: "#D97706", voteShare: 2.46,  seatShare: 2.95,  seats: 16  },
  { party: "Others",color: "#64748B", voteShare: 23.23, seatShare: 18.42, seats: 100 },
];
