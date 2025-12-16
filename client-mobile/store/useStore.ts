import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  wishlistIds: string[];
  joinedGroupIds: string[];

  // 🔹 AUTH STATE
  isLoggedIn: boolean;

  // Actions
  toggleWishlist: (productId: string) => void;
  joinGroup: (groupId: string) => void;
  isWishlisted: (productId: string) => boolean;
  hasJoined: (groupId: string) => boolean;

  // 🔹 AUTH ACTIONS
  login: () => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    // 🔹 STORE STATE + ACTIONS (THIS MUST BE ONE OBJECT)
    (set, get) => ({
      wishlistIds: [],
      joinedGroupIds: ['g1', 'g4'],

      // 🔹 AUTH STATE (ADDED)
      isLoggedIn: false,

      toggleWishlist: (productId) =>
        set((state) => {
          const exists = state.wishlistIds.includes(productId);
          return {
            wishlistIds: exists
              ? state.wishlistIds.filter((id) => id !== productId)
              : [...state.wishlistIds, productId],
          };
        }),

      joinGroup: (groupId) =>
        set((state) => {
          if (state.joinedGroupIds.includes(groupId)) return state;
          return { joinedGroupIds: [...state.joinedGroupIds, groupId] };
        }),

      isWishlisted: (productId) => get().wishlistIds.includes(productId),
      hasJoined: (groupId) => get().joinedGroupIds.includes(groupId),

      // 🔹 AUTH ACTIONS (ADDED)
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false, joinedGroupIds: [] }),
    }),

    // 🔹 PERSIST CONFIG (ONLY CONFIG HERE)
    {
      name: 'buyforce-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
