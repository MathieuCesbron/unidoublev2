import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { create } from "zustand";
import { network, shdwBucketDevnet } from "./utils/solana/program";

const useStore = create((set) => ({
  category: { value: -1, label: "All" },
  setCategory: (category) => set((state) => ({ category })),

  isBuyer: undefined,
  setIsBuyer: (isBuyer) => set((state) => ({ isBuyer })),

  isSeller: undefined,
  setIsSeller: (isSeller) => set((state) => ({ isSeller })),

  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) =>
    set((state) => ({ isAuthenticated })),

  diffiePrivateKey: "",
  setDiffiePrivateKey: (diffiePrivateKey) =>
    set((state) => ({ diffiePrivateKey })),

  shdwBucket: network === WalletAdapterNetwork.Devnet ? shdwBucketDevnet : "",
  setShdwBucket: (shdwBucket) => set((state) => ({ shdwBucket })),
}));

export default useStore;
