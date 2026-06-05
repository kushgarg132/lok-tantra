import { create } from "zustand";

interface AppState {
  sidebarOpen: boolean;
  searchOpen: boolean;
  selectedState: string | null;
  selectedLevel: "central" | "state" | "district" | "local";
  learningLevel: "beginner" | "intermediate" | "advanced" | "upsc" | "research";
  toggleSidebar: () => void;
  toggleSearch: () => void;
  setSelectedState: (state: string | null) => void;
  setSelectedLevel: (level: "central" | "state" | "district" | "local") => void;
  setLearningLevel: (level: "beginner" | "intermediate" | "advanced" | "upsc" | "research") => void;
}

export const useStore = create<AppState>((set) => ({
  sidebarOpen: false,
  searchOpen: false,
  selectedState: null,
  selectedLevel: "central",
  learningLevel: "beginner",
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleSearch: () => set((s) => ({ searchOpen: !s.searchOpen })),
  setSelectedState: (state) => set({ selectedState: state }),
  setSelectedLevel: (level) => set({ selectedLevel: level }),
  setLearningLevel: (level) => set({ learningLevel: level }),
}));
