import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
    // Current zone
    currentZone: 'Clairière de l\'Arbre',
    setCurrentZone: (zone) => set({ currentZone: zone }),

    // Active dialog
    activeDialog: null,
    showDialog: (dialog) => set({ activeDialog: dialog }),
    closeDialog: () => set({ activeDialog: null }),

    // Player state (for future multiplayer)
    playerPosition: [0, 1, 10],
    setPlayerPosition: (pos) => set({ playerPosition: pos }),

    // Interactions
    hoveredObject: null,
    setHoveredObject: (obj) => set({ hoveredObject: obj }),

    // Error logging system
    errors: [],
    logError: (message, data) => {
        const error = {
            timestamp: new Date().toISOString(),
            message,
            data,
            id: Date.now()
        }
        console.error('🐛 [OHARA Error]', message, data)
        set((state) => ({
            errors: [...state.errors.slice(-19), error] // Keep last 20 errors
        }))
    },
    clearErrors: () => set({ errors: [] }),
}))
