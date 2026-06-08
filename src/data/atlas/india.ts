interface State2024 { state: string; code: string; seats: number; dominant: string; dominantColor: string; dominantSeats: number; alliance: "NDA" | "INDIA" | "Other"; turnout: number; ndaSeats: number; indiaSeats: number; otherSeats: number }

const LS_2024_STATES: State2024[] = [
  { state: "Uttar Pradesh",     code: "UP", seats: 80, dominant: "SP",     dominantColor: "#EF4444", dominantSeats: 37, alliance: "INDIA", turnout: 57.4, ndaSeats: 36, indiaSeats: 43, otherSeats: 1  },
  { state: "Maharashtra",       code: "MH", seats: 48, dominant: "INC",    dominantColor: "#1565C0", dominantSeats: 13, alliance: "INDIA", turnout: 61.0, ndaSeats: 17, indiaSeats: 30, otherSeats: 1  },
  { state: "West Bengal",       code: "WB", seats: 42, dominant: "TMC",    dominantColor: "#059669", dominantSeats: 29, alliance: "INDIA", turnout: 73.0, ndaSeats: 12, indiaSeats: 30, otherSeats: 0  },
  { state: "Tamil Nadu",        code: "TN", seats: 39, dominant: "DMK",    dominantColor: "#DC143C", dominantSeats: 22, alliance: "INDIA", turnout: 69.1, ndaSeats: 1,  indiaSeats: 38, otherSeats: 0  },
  { state: "Bihar",             code: "BR", seats: 40, dominant: "BJP",    dominantColor: "#FF9933", dominantSeats: 12, alliance: "NDA",   turnout: 56.2, ndaSeats: 30, indiaSeats: 10, otherSeats: 0  },
  { state: "Karnataka",         code: "KA", seats: 28, dominant: "BJP",    dominantColor: "#FF9933", dominantSeats: 17, alliance: "NDA",   turnout: 69.5, ndaSeats: 19, indiaSeats: 9,  otherSeats: 0  },
  { state: "Andhra Pradesh",    code: "AP", seats: 25, dominant: "TDP",    dominantColor: "#D97706", dominantSeats: 16, alliance: "NDA",   turnout: 79.4, ndaSeats: 21, indiaSeats: 4,  otherSeats: 0  },
  { state: "Rajasthan",         code: "RJ", seats: 25, dominant: "BJP",    dominantColor: "#FF9933", dominantSeats: 14, alliance: "NDA",   turnout: 58.2, ndaSeats: 14, indiaSeats: 8,  otherSeats: 3  },
  { state: "Madhya Pradesh",    code: "MP", seats: 29, dominant: "BJP",    dominantColor: "#FF9933", dominantSeats: 29, alliance: "NDA",   turnout: 58.1, ndaSeats: 29, indiaSeats: 0,  otherSeats: 0  },
  { state: "Gujarat",           code: "GJ", seats: 26, dominant: "BJP",    dominantColor: "#FF9933", dominantSeats: 25, alliance: "NDA",   turnout: 60.3, ndaSeats: 25, indiaSeats: 0,  otherSeats: 1  },
  { state: "Odisha",            code: "OD", seats: 21, dominant: "BJP",    dominantColor: "#FF9933", dominantSeats: 20, alliance: "NDA",   turnout: 74.2, ndaSeats: 20, indiaSeats: 1,  otherSeats: 0  },
  { state: "Kerala",            code: "KL", seats: 20, dominant: "INC",    dominantColor: "#1565C0", dominantSeats: 18, alliance: "INDIA", turnout: 70.9, ndaSeats: 1,  indiaSeats: 19, otherSeats: 0  },
  { state: "Telangana",         code: "TS", seats: 17, dominant: "BJP",    dominantColor: "#FF9933", dominantSeats: 8,  alliance: "NDA",   turnout: 63.2, ndaSeats: 8,  indiaSeats: 8,  otherSeats: 1  },
  { state: "Assam",             code: "AS", seats: 14, dominant: "BJP",    dominantColor: "#FF9933", dominantSeats: 9,  alliance: "NDA",   turnout: 74.0, ndaSeats: 11, indiaSeats: 3,  otherSeats: 0  },
  { state: "Jharkhand",         code: "JH", seats: 14, dominant: "BJP",    dominantColor: "#FF9933", dominantSeats: 8,  alliance: "NDA",   turnout: 65.6, ndaSeats: 9,  indiaSeats: 5,  otherSeats: 0  },
  { state: "Punjab",            code: "PB", seats: 13, dominant: "INC",    dominantColor: "#1565C0", dominantSeats: 7,  alliance: "INDIA", turnout: 60.8, ndaSeats: 2,  indiaSeats: 10, otherSeats: 1  },
  { state: "Chhattisgarh",      code: "CG", seats: 11, dominant: "BJP",    dominantColor: "#FF9933", dominantSeats: 10, alliance: "NDA",   turnout: 72.1, ndaSeats: 10, indiaSeats: 1,  otherSeats: 0  },
  { state: "Haryana",           code: "HR", seats: 10, dominant: "INC",    dominantColor: "#1565C0", dominantSeats: 5,  alliance: "INDIA", turnout: 63.2, ndaSeats: 5,  indiaSeats: 5,  otherSeats: 0  },
  { state: "Delhi",             code: "DL", seats: 7,  dominant: "BJP",    dominantColor: "#FF9933", dominantSeats: 7,  alliance: "NDA",   turnout: 58.7, ndaSeats: 7,  indiaSeats: 0,  otherSeats: 0  },
  { state: "Jammu & Kashmir",   code: "JK", seats: 5,  dominant: "NC",     dominantColor: "#1A237E", dominantSeats: 2,  alliance: "INDIA", turnout: 57.8, ndaSeats: 2,  indiaSeats: 3,  otherSeats: 0  },
  { state: "Uttarakhand",       code: "UK", seats: 5,  dominant: "BJP",    dominantColor: "#FF9933", dominantSeats: 5,  alliance: "NDA",   turnout: 60.1, ndaSeats: 5,  indiaSeats: 0,  otherSeats: 0  },
  { state: "Himachal Pradesh",  code: "HP", seats: 4,  dominant: "BJP",    dominantColor: "#FF9933", dominantSeats: 4,  alliance: "NDA",   turnout: 72.3, ndaSeats: 4,  indiaSeats: 0,  otherSeats: 0  },
  { state: "Tripura",           code: "TR", seats: 2,  dominant: "BJP",    dominantColor: "#FF9933", dominantSeats: 2,  alliance: "NDA",   turnout: 80.4, ndaSeats: 2,  indiaSeats: 0,  otherSeats: 0  },
  { state: "Meghalaya",         code: "ML", seats: 2,  dominant: "VPP",    dominantColor: "#64748B", dominantSeats: 1,  alliance: "Other", turnout: 70.1, ndaSeats: 0,  indiaSeats: 1,  otherSeats: 1  },
  { state: "Manipur",           code: "MN", seats: 2,  dominant: "BJP",    dominantColor: "#FF9933", dominantSeats: 1,  alliance: "NDA",   turnout: 70.2, ndaSeats: 1,  indiaSeats: 0,  otherSeats: 1  },
  { state: "Arunachal Pradesh", code: "AR", seats: 2,  dominant: "BJP",    dominantColor: "#FF9933", dominantSeats: 2,  alliance: "NDA",   turnout: 80.3, ndaSeats: 2,  indiaSeats: 0,  otherSeats: 0  },
  { state: "Goa",               code: "GA", seats: 2,  dominant: "BJP",    dominantColor: "#FF9933", dominantSeats: 1,  alliance: "NDA",   turnout: 76.5, ndaSeats: 1,  indiaSeats: 1,  otherSeats: 0  },
  { state: "Nagaland",          code: "NL", seats: 1,  dominant: "NDPP",   dominantColor: "#64748B", dominantSeats: 1,  alliance: "NDA",   turnout: 62.1, ndaSeats: 1,  indiaSeats: 0,  otherSeats: 0  },
  { state: "Mizoram",           code: "MZ", seats: 1,  dominant: "ZPM",    dominantColor: "#6D28D9", dominantSeats: 1,  alliance: "Other", turnout: 56.9, ndaSeats: 0,  indiaSeats: 0,  otherSeats: 1  },
  { state: "Sikkim",            code: "SK", seats: 1,  dominant: "SKM",    dominantColor: "#059669", dominantSeats: 1,  alliance: "Other", turnout: 80.1, ndaSeats: 0,  indiaSeats: 0,  otherSeats: 1  },
  { state: "Chandigarh",        code: "CH", seats: 1,  dominant: "INC",    dominantColor: "#1565C0", dominantSeats: 1,  alliance: "INDIA", turnout: 68.3, ndaSeats: 0,  indiaSeats: 1,  otherSeats: 0  },
  { state: "Puducherry",        code: "PY", seats: 1,  dominant: "INC",    dominantColor: "#1565C0", dominantSeats: 1,  alliance: "INDIA", turnout: 80.5, ndaSeats: 0,  indiaSeats: 1,  otherSeats: 0  },
  { state: "A&N Islands",       code: "AN", seats: 1,  dominant: "BJP",    dominantColor: "#FF9933", dominantSeats: 1,  alliance: "NDA",   turnout: 72.4, ndaSeats: 1,  indiaSeats: 0,  otherSeats: 0  },
  { state: "Lakshadweep",       code: "LD", seats: 1,  dominant: "NCP-SP", dominantColor: "#7C3AED", dominantSeats: 1,  alliance: "INDIA", turnout: 84.1, ndaSeats: 0,  indiaSeats: 1,  otherSeats: 0  },
  { state: "Ladakh",            code: "LA", seats: 1,  dominant: "Ind.",   dominantColor: "#64748B", dominantSeats: 1,  alliance: "Other", turnout: 72.0, ndaSeats: 0,  indiaSeats: 0,  otherSeats: 1  },
  { state: "DNH & DD",          code: "DD", seats: 2,  dominant: "BJP",    dominantColor: "#FF9933", dominantSeats: 2,  alliance: "NDA",   turnout: 71.2, ndaSeats: 2,  indiaSeats: 0,  otherSeats: 0  },
];

export interface StateAtlasData extends State2024 {
  lat: number;
  lng: number;
  population: number; // millions (2021 Census)
  area: number; // sq km
  region: "North" | "South" | "East" | "West" | "Central" | "Northeast" | "Islands";
  capital: string;
}

const META: Record<string, Omit<StateAtlasData, keyof State2024>> = {
  UP: { lat: 26.8, lng: 80.9, population: 199.8, area: 240928, region: "North",     capital: "Lucknow" },
  MH: { lat: 19.7, lng: 75.7, population: 112.4, area: 307713, region: "West",      capital: "Mumbai" },
  WB: { lat: 22.6, lng: 87.8, population: 91.3,  area: 88752,  region: "East",      capital: "Kolkata" },
  TN: { lat: 11.1, lng: 78.7, population: 72.1,  area: 130058, region: "South",     capital: "Chennai" },
  BR: { lat: 25.1, lng: 85.3, population: 104.1, area: 94163,  region: "East",      capital: "Patna" },
  KA: { lat: 15.3, lng: 75.7, population: 61.1,  area: 191791, region: "South",     capital: "Bengaluru" },
  AP: { lat: 15.9, lng: 79.7, population: 49.6,  area: 162975, region: "South",     capital: "Amaravati" },
  RJ: { lat: 27.0, lng: 74.5, population: 68.5,  area: 342239, region: "North",     capital: "Jaipur" },
  MP: { lat: 22.9, lng: 78.6, population: 72.6,  area: 308252, region: "Central",   capital: "Bhopal" },
  GJ: { lat: 22.3, lng: 71.2, population: 60.4,  area: 196024, region: "West",      capital: "Gandhinagar" },
  OD: { lat: 20.9, lng: 84.8, population: 41.9,  area: 155707, region: "East",      capital: "Bhubaneswar" },
  KL: { lat: 10.5, lng: 76.3, population: 33.4,  area: 38852,  region: "South",     capital: "Thiruvananthapuram" },
  TS: { lat: 17.8, lng: 79.1, population: 35.0,  area: 112077, region: "South",     capital: "Hyderabad" },
  AS: { lat: 26.2, lng: 92.9, population: 31.2,  area: 78438,  region: "Northeast", capital: "Dispur" },
  JH: { lat: 23.6, lng: 85.3, population: 32.9,  area: 79716,  region: "East",      capital: "Ranchi" },
  PB: { lat: 31.1, lng: 75.3, population: 27.7,  area: 50362,  region: "North",     capital: "Chandigarh" },
  CG: { lat: 21.3, lng: 81.9, population: 25.5,  area: 135192, region: "Central",   capital: "Raipur" },
  HR: { lat: 29.1, lng: 76.1, population: 25.4,  area: 44212,  region: "North",     capital: "Chandigarh" },
  DL: { lat: 28.7, lng: 77.1, population: 16.8,  area: 1484,   region: "North",     capital: "New Delhi" },
  JK: { lat: 33.5, lng: 75.8, population: 12.5,  area: 42241,  region: "North",     capital: "Srinagar" },
  UK: { lat: 30.3, lng: 78.8, population: 10.1,  area: 53483,  region: "North",     capital: "Dehradun" },
  HP: { lat: 31.9, lng: 77.0, population: 6.9,   area: 55673,  region: "North",     capital: "Shimla" },
  TR: { lat: 23.7, lng: 91.8, population: 3.7,   area: 10486,  region: "Northeast", capital: "Agartala" },
  ML: { lat: 25.5, lng: 91.4, population: 3.0,   area: 22429,  region: "Northeast", capital: "Shillong" },
  MN: { lat: 24.7, lng: 93.9, population: 2.9,   area: 22327,  region: "Northeast", capital: "Imphal" },
  AR: { lat: 28.2, lng: 94.7, population: 1.4,   area: 83743,  region: "Northeast", capital: "Itanagar" },
  GA: { lat: 15.3, lng: 74.1, population: 1.5,   area: 3702,   region: "West",      capital: "Panaji" },
  NL: { lat: 26.2, lng: 94.5, population: 2.0,   area: 16579,  region: "Northeast", capital: "Kohima" },
  MZ: { lat: 23.2, lng: 92.9, population: 1.1,   area: 21081,  region: "Northeast", capital: "Aizawl" },
  SK: { lat: 27.5, lng: 88.5, population: 0.6,   area: 7096,   region: "Northeast", capital: "Gangtok" },
  CH: { lat: 30.7, lng: 76.8, population: 1.1,   area: 114,    region: "North",     capital: "Chandigarh" },
  PY: { lat: 11.9, lng: 79.8, population: 1.2,   area: 479,    region: "South",     capital: "Puducherry" },
  AN: { lat: 11.7, lng: 92.6, population: 0.4,   area: 8249,   region: "Islands",   capital: "Port Blair" },
  LD: { lat: 10.6, lng: 72.6, population: 0.07,  area: 32,     region: "Islands",   capital: "Kavaratti" },
  LA: { lat: 34.2, lng: 77.6, population: 0.3,   area: 59146,  region: "North",     capital: "Leh" },
  DD: { lat: 20.4, lng: 73.0, population: 0.6,   area: 603,    region: "West",      capital: "Daman" },
};

const FALLBACK: Omit<StateAtlasData, keyof State2024> = {
  lat: 20, lng: 80, population: 1, area: 1000, region: "Central", capital: "—",
};

export const INDIA_STATES: StateAtlasData[] = LS_2024_STATES.map((s) => ({
  ...s,
  ...(META[s.code] ?? FALLBACK),
}));

// Projection constants (fixed viewBox 800×580)
export const PROJ_W = 800;
export const PROJ_H = 580;
export const PROJ_CENTER: [number, number] = [82, 22];
export const PROJ_SCALE = 950;
export const PROJ_TRANSLATE: [number, number] = [PROJ_W / 2, PROJ_H / 2];
