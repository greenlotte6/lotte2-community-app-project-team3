import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLoginStore = create(
  persist(
    (set) => ({
      user: null,
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
      _hasHydrated: false,
      setHasHydrated: () => set({ _hasHydrated: true }),
    }),
    {
      name: "login-storage", // localStorage에 저장됨
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated();
      },
    }
  )
);

{
  /* 
  작업하는동안 로그아웃 방지용으로 주석처리. 추후 다시 사용예정

  export const useLoginStore = create((set) => ({
    user: null,
    login: (userData) => set({ user: userData }),
    logout: () => set({ user: null }),
  }));
  
  */
}
