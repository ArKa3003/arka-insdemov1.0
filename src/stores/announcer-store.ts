import { create } from "zustand";

interface AnnouncerState {
  message: string;
  announce: (message: string) => void;
}

export const useAnnouncerStore = create<AnnouncerState>((set) => ({
  message: "",
  announce: (message: string) => {
    set({ message: "" });
    setTimeout(() => set({ message }), 50);
  },
}));
