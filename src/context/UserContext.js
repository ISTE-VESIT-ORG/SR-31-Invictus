'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserContext = createContext(null);

const DEFAULT_PREFS = {
    location: null,           // { lat, lng, city }
    favorites: [],            // [{ id, type, title, image, savedAt }]
    units: 'metric',          // 'metric' | 'imperial'
    onboarded: false,
    notificationPrefs: {
        enabled: false,
        categories: { meteor: true, eclipse: true, alignment: true, moon: true, solstice: true },
    },
};

export function UserProvider({ children }) {
    const [prefs, setPrefs] = useState(DEFAULT_PREFS);
    const [loaded, setLoaded] = useState(false);

    // Hydrate from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('celestia_prefs');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Deep merge notificationPrefs to ensure new defaults are applied
                const merged = { ...DEFAULT_PREFS, ...parsed };
                merged.notificationPrefs = {
                    ...DEFAULT_PREFS.notificationPrefs,
                    ...(parsed.notificationPrefs || {}),
                    categories: {
                        ...DEFAULT_PREFS.notificationPrefs.categories,
                        ...((parsed.notificationPrefs || {}).categories || {}),
                    },
                };
                setPrefs(merged);
            }
        } catch (e) { /* ignore */ }
        setLoaded(true);
    }, []);

    // Persist on change
    useEffect(() => {
        if (loaded) {
            localStorage.setItem('celestia_prefs', JSON.stringify(prefs));
        }
    }, [prefs, loaded]);

    const setLocation = useCallback((location) => {
        setPrefs(p => ({ ...p, location, onboarded: true }));
    }, []);

    const toggleFavorite = useCallback((item) => {
        setPrefs(p => {
            const exists = p.favorites.find(f => f.id === item.id);
            if (exists) {
                return { ...p, favorites: p.favorites.filter(f => f.id !== item.id) };
            }
            return { ...p, favorites: [...p.favorites, { ...item, savedAt: Date.now() }] };
        });
    }, []);

    const isFavorite = useCallback((id) => {
        return prefs.favorites.some(f => f.id === id);
    }, [prefs.favorites]);

    const setUnits = useCallback((units) => {
        setPrefs(p => ({ ...p, units }));
    }, []);

    const clearFavorites = useCallback(() => {
        setPrefs(p => ({ ...p, favorites: [] }));
    }, []);

    const setNotificationPrefs = useCallback((notificationPrefs) => {
        setPrefs(p => ({ ...p, notificationPrefs }));
    }, []);

    const resetPrefs = useCallback(() => {
        setPrefs(DEFAULT_PREFS);
        localStorage.removeItem('celestia_prefs');
    }, []);

    return (
        <UserContext.Provider value={{
            ...prefs,
            loaded,
            setLocation,
            toggleFavorite,
            isFavorite,
            setUnits,
            clearFavorites,
            setNotificationPrefs,
            resetPrefs,
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUser must be used within UserProvider');
    return ctx;
}
