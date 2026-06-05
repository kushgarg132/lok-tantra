import { LS_2024_STATES, type State2024 } from "@/data/elections/intelligence";

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
