export interface PartyElectionData {
  party: string;
  color: string;
  seats2024: number;
  seats2019: number;
  seats2014: number;
  voteShare2024: number;
}

export const LOK_SABHA_2024_DATA: PartyElectionData[] = [
  { party: "BJP", color: "#FF9933", seats2024: 240, seats2019: 303, seats2014: 282, voteShare2024: 36.56 },
  { party: "INC", color: "#00BFFF", seats2024: 99, seats2019: 52, seats2014: 44, voteShare2024: 21.19 },
  { party: "SP", color: "#FF0000", seats2024: 37, seats2019: 5, seats2014: 5, voteShare2024: 4.42 },
  { party: "TMC", color: "#00FF00", seats2024: 29, seats2019: 22, seats2014: 34, voteShare2024: 4.03 },
  { party: "DMK", color: "#FF0000", seats2024: 22, seats2019: 23, seats2014: 0, voteShare2024: 2.58 },
  { party: "TDP", color: "#FFFF00", seats2024: 16, seats2019: 3, seats2014: 2, voteShare2024: 1.73 },
  { party: "JDU", color: "#006400", seats2024: 12, seats2019: 16, seats2014: 2, voteShare2024: 1.32 },
  { party: "SS (UBT)", color: "#FF6600", seats2024: 9, seats2019: 1, seats2014: 0, voteShare2024: 1.12 },
  { party: "NCP (SP)", color: "#004B87", seats2024: 8, seats2019: 1, seats2014: 0, voteShare2024: 0.91 },
  { party: "Others", color: "#6B7280", seats2024: 71, seats2019: 117, seats2014: 174, voteShare2024: 26.14 },
];

export const ELECTION_HISTORY = [
  { year: 1952, totalSeats: 489, majorWinner: "INC", majorSeats: 364, turnout: 45.7 },
  { year: 1957, totalSeats: 494, majorWinner: "INC", majorSeats: 371, turnout: 47.7 },
  { year: 1962, totalSeats: 494, majorWinner: "INC", majorSeats: 361, turnout: 55.4 },
  { year: 1967, totalSeats: 520, majorWinner: "INC", majorSeats: 283, turnout: 61.3 },
  { year: 1971, totalSeats: 518, majorWinner: "INC", majorSeats: 352, turnout: 55.3 },
  { year: 1977, totalSeats: 542, majorWinner: "JNP", majorSeats: 295, turnout: 60.5 },
  { year: 1980, totalSeats: 529, majorWinner: "INC(I)", majorSeats: 353, turnout: 56.9 },
  { year: 1984, totalSeats: 514, majorWinner: "INC", majorSeats: 404, turnout: 64.0 },
  { year: 1989, totalSeats: 529, majorWinner: "INC", majorSeats: 197, turnout: 62.0 },
  { year: 1991, totalSeats: 521, majorWinner: "INC", majorSeats: 244, turnout: 56.7 },
  { year: 1996, totalSeats: 543, majorWinner: "BJP", majorSeats: 161, turnout: 57.9 },
  { year: 1998, totalSeats: 543, majorWinner: "BJP", majorSeats: 182, turnout: 62.0 },
  { year: 1999, totalSeats: 543, majorWinner: "BJP", majorSeats: 182, turnout: 60.0 },
  { year: 2004, totalSeats: 543, majorWinner: "INC", majorSeats: 145, turnout: 58.1 },
  { year: 2009, totalSeats: 543, majorWinner: "INC", majorSeats: 206, turnout: 58.2 },
  { year: 2014, totalSeats: 543, majorWinner: "BJP", majorSeats: 282, turnout: 66.4 },
  { year: 2019, totalSeats: 543, majorWinner: "BJP", majorSeats: 303, turnout: 67.4 },
  { year: 2024, totalSeats: 543, majorWinner: "BJP", majorSeats: 240, turnout: 65.8 },
];

export const STATE_WISE_LS_SEATS: Record<string, { total: number; reserved_sc: number; reserved_st: number }> = {
  "Uttar Pradesh": { total: 80, reserved_sc: 17, reserved_st: 0 },
  "Maharashtra": { total: 48, reserved_sc: 5, reserved_st: 4 },
  "West Bengal": { total: 42, reserved_sc: 10, reserved_st: 2 },
  "Bihar": { total: 40, reserved_sc: 8, reserved_st: 0 },
  "Tamil Nadu": { total: 39, reserved_sc: 7, reserved_st: 0 },
  "Madhya Pradesh": { total: 29, reserved_sc: 4, reserved_st: 6 },
  "Karnataka": { total: 28, reserved_sc: 5, reserved_st: 2 },
  "Gujarat": { total: 26, reserved_sc: 2, reserved_st: 4 },
  "Rajasthan": { total: 25, reserved_sc: 4, reserved_st: 3 },
  "Andhra Pradesh": { total: 25, reserved_sc: 4, reserved_st: 1 },
  "Odisha": { total: 21, reserved_sc: 3, reserved_st: 5 },
  "Kerala": { total: 20, reserved_sc: 2, reserved_st: 0 },
  "Telangana": { total: 17, reserved_sc: 3, reserved_st: 2 },
  "Assam": { total: 14, reserved_sc: 1, reserved_st: 2 },
  "Jharkhand": { total: 14, reserved_sc: 1, reserved_st: 5 },
  "Punjab": { total: 13, reserved_sc: 4, reserved_st: 0 },
  "Chhattisgarh": { total: 11, reserved_sc: 1, reserved_st: 4 },
  "Haryana": { total: 10, reserved_sc: 2, reserved_st: 0 },
  "Delhi": { total: 7, reserved_sc: 1, reserved_st: 0 },
  "Jammu & Kashmir": { total: 5, reserved_sc: 0, reserved_st: 0 },
  "Uttarakhand": { total: 5, reserved_sc: 1, reserved_st: 0 },
  "Himachal Pradesh": { total: 4, reserved_sc: 1, reserved_st: 0 },
  "Goa": { total: 2, reserved_sc: 0, reserved_st: 0 },
  "Arunachal Pradesh": { total: 2, reserved_sc: 0, reserved_st: 2 },
  "Manipur": { total: 2, reserved_sc: 0, reserved_st: 1 },
  "Meghalaya": { total: 2, reserved_sc: 0, reserved_st: 2 },
  "Tripura": { total: 2, reserved_sc: 0, reserved_st: 1 },
  "Mizoram": { total: 1, reserved_sc: 0, reserved_st: 1 },
  "Nagaland": { total: 1, reserved_sc: 0, reserved_st: 0 },
  "Sikkim": { total: 1, reserved_sc: 0, reserved_st: 0 },
};
