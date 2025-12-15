import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  wishlistIds: string[];
  joinedGroupIds: string[]; // Stores the IDs of groups the user joined
  
  // Actions
  toggleWishlist: (productId: string) => void;
  joinGroup: (groupId: string) => void;
  isWishlisted: (productId: string) => boolean;
  hasJoined: (groupId: string) => boolean;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      wishlistIds: [], // Start empty
      joinedGroupIds: ['g1', 'g4'], // Start with some mock data for visualization

      toggleWishlist: (productId) => set((state) => {
        const exists = state.wishlistIds.includes(productId);
        return {
          wishlistIds: exists 
            ? state.wishlistIds.filter(id => id !== productId)
            : [...state.wishlistIds, productId]
        };
      }),

      joinGroup: (groupId) => set((state) => {
        if (state.joinedGroupIds.includes(groupId)) return state;
        return { joinedGroupIds: [...state.joinedGroupIds, groupId] };
      }),

      isWishlisted: (productId) => get().wishlistIds.includes(productId),
      hasJoined: (groupId) => get().joinedGroupIds.includes(groupId),
    }),
    {
      name: 'buyforce-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);