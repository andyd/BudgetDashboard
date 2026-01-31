"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "budget-favorites";
const MAX_FAVORITES = 50;

/**
 * Favorite comparison item stored in localStorage
 */
export interface FavoriteItem {
  /** Budget item ID */
  budgetId: string;
  /** Comparison unit ID */
  unitId: string;
  /** Timestamp when favorited */
  savedAt: number;
}

// In-memory cache of favorites for synchronous access
let favoritesCache: FavoriteItem[] | null = null;

// Subscribers for external store pattern
const subscribers = new Set<() => void>();

function notifySubscribers(): void {
  subscribers.forEach((callback) => callback());
}

function subscribe(callback: () => void): () => void {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

/**
 * Read favorites from localStorage
 * Returns cached value if available, otherwise reads from storage
 */
function readFavorites(): FavoriteItem[] {
  if (favoritesCache !== null) {
    return favoritesCache;
  }

  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    favoritesCache = stored ? JSON.parse(stored) : [];
    return favoritesCache;
  } catch {
    // Handle JSON parse errors or localStorage access errors
    favoritesCache = [];
    return [];
  }
}

/**
 * Write favorites to localStorage
 * Updates cache and notifies subscribers
 */
function writeFavorites(favorites: FavoriteItem[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    favoritesCache = favorites;
    notifySubscribers();
  } catch {
    // Handle storage quota exceeded or access errors
    // Cache is still updated for in-memory consistency
    favoritesCache = favorites;
    notifySubscribers();
  }
}

/**
 * Create a unique key for a favorite combination
 */
function createFavoriteKey(budgetId: string, unitId: string): string {
  return `${budgetId}:${unitId}`;
}

/**
 * Add a comparison to favorites
 * If already exists, moves it to the top with updated timestamp
 * Enforces MAX_FAVORITES limit by removing oldest entries
 */
export function addFavorite(budgetId: string, unitId: string): void {
  const favorites = readFavorites();
  const key = createFavoriteKey(budgetId, unitId);

  // Remove existing entry if present
  const filtered = favorites.filter(
    (f) => createFavoriteKey(f.budgetId, f.unitId) !== key,
  );

  // Add new entry at the beginning
  const newFavorites = [
    { budgetId, unitId, savedAt: Date.now() },
    ...filtered,
  ].slice(0, MAX_FAVORITES);

  writeFavorites(newFavorites);
}

/**
 * Remove a comparison from favorites
 */
export function removeFavorite(budgetId: string, unitId: string): void {
  const favorites = readFavorites();
  const key = createFavoriteKey(budgetId, unitId);

  const filtered = favorites.filter(
    (f) => createFavoriteKey(f.budgetId, f.unitId) !== key,
  );

  writeFavorites(filtered);
}

/**
 * Check if a comparison is in favorites
 */
export function isFavorite(budgetId: string, unitId: string): boolean {
  const favorites = readFavorites();
  const key = createFavoriteKey(budgetId, unitId);

  return favorites.some((f) => createFavoriteKey(f.budgetId, f.unitId) === key);
}

/**
 * Get all favorites sorted by savedAt (newest first)
 */
export function getFavorites(): FavoriteItem[] {
  return [...readFavorites()].sort((a, b) => b.savedAt - a.savedAt);
}

/**
 * Clear all favorites
 */
export function clearFavorites(): void {
  writeFavorites([]);
}

/**
 * Toggle a favorite on/off
 * Returns true if added, false if removed
 */
export function toggleFavorite(budgetId: string, unitId: string): boolean {
  if (isFavorite(budgetId, unitId)) {
    removeFavorite(budgetId, unitId);
    return false;
  } else {
    addFavorite(budgetId, unitId);
    return true;
  }
}

/**
 * Hook to access and manage favorites with automatic re-renders
 */
export function useFavorites() {
  // Use useSyncExternalStore for proper hydration and updates
  const favorites = useSyncExternalStore(
    subscribe,
    () => readFavorites(),
    () => [], // Server snapshot returns empty array
  );

  // Memoized check function
  const checkIsFavorite = useCallback(
    (budgetId: string, unitId: string): boolean => {
      const key = createFavoriteKey(budgetId, unitId);
      return favorites.some(
        (f) => createFavoriteKey(f.budgetId, f.unitId) === key,
      );
    },
    [favorites],
  );

  // Memoized add function
  const add = useCallback((budgetId: string, unitId: string): void => {
    addFavorite(budgetId, unitId);
  }, []);

  // Memoized remove function
  const remove = useCallback((budgetId: string, unitId: string): void => {
    removeFavorite(budgetId, unitId);
  }, []);

  // Memoized toggle function
  const toggle = useCallback((budgetId: string, unitId: string): boolean => {
    return toggleFavorite(budgetId, unitId);
  }, []);

  // Memoized clear function
  const clear = useCallback((): void => {
    clearFavorites();
  }, []);

  // Initialize cache on mount
  useEffect(() => {
    readFavorites();
  }, []);

  return {
    favorites,
    addFavorite: add,
    removeFavorite: remove,
    isFavorite: checkIsFavorite,
    getFavorites: () => getFavorites(),
    toggleFavorite: toggle,
    clearFavorites: clear,
    count: favorites.length,
    maxFavorites: MAX_FAVORITES,
    isAtLimit: favorites.length >= MAX_FAVORITES,
  };
}
