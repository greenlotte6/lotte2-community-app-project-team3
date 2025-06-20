import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLoginStore = create(
  persist(
    (set) => ({
      user: null,
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
      _hasHydrated: false, // 스토어 상태 복원 여부 추적
      setHasHydrated: () => set({ _hasHydrated: true }), // 복원 완료 시 호출 함수
    }),
    {
      name: "login-storage", // 로컬 스토리지에 저장될 키 이름
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(); // 상태 복원 완료 후 _hasHydrated를 true로 설정
      },
    }
  )
);
