import { create } from "zustand";

const useStore = create((set) => ({
  category: { value: -1, label: "All" },
  setCategory: (category) => set((state) => ({ category })),

  isSeller: undefined,
  setIsSeller: (isSeller) => set((state) => ({ isSeller })),
}));

export default useStore;
