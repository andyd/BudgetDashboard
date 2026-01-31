"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

/**
 * Supported types for URL state values
 */
type URLStateValue = string | number | boolean | string[] | number[] | null;

/**
 * Schema definition for a single URL parameter
 */
interface ParamSchema<T extends URLStateValue> {
  /** Default value when param is not in URL */
  defaultValue: T;
  /** Parse string from URL to typed value */
  parse?: (value: string | null) => T;
  /** Serialize typed value to string for URL */
  serialize?: (value: T) => string | null;
}

/**
 * Schema definition for multiple URL parameters
 */
type URLStateSchema<T extends Record<string, URLStateValue>> = {
  [K in keyof T]: ParamSchema<T[K]>;
};

/**
 * Return type for useURLState hook
 */
interface UseURLStateReturn<T extends Record<string, URLStateValue>> {
  /** Current state values parsed from URL */
  state: T;
  /** Set a single parameter value */
  setParam: <K extends keyof T>(key: K, value: T[K]) => void;
  /** Set multiple parameter values at once */
  setParams: (params: Partial<T>) => void;
  /** Reset a parameter to its default value */
  resetParam: <K extends keyof T>(key: K) => void;
  /** Reset all parameters to their default values */
  resetAll: () => void;
  /** Get the current URL search string */
  searchString: string;
}

/**
 * Default parsers for common types
 */
const defaultParsers = {
  string: (value: string | null, defaultValue: string): string =>
    value ?? defaultValue,

  number: (value: string | null, defaultValue: number): number => {
    if (value === null) return defaultValue;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  },

  boolean: (value: string | null, defaultValue: boolean): boolean => {
    if (value === null) return defaultValue;
    return value === "true" || value === "1";
  },

  stringArray: (value: string | null, defaultValue: string[]): string[] => {
    if (value === null || value === "") return defaultValue;
    return value.split(",").filter(Boolean);
  },

  numberArray: (value: string | null, defaultValue: number[]): number[] => {
    if (value === null || value === "") return defaultValue;
    return value
      .split(",")
      .map(Number)
      .filter((n) => !Number.isNaN(n));
  },
};

/**
 * Default serializers for common types
 */
const defaultSerializers = {
  string: (value: string): string | null => (value === "" ? null : value),

  number: (value: number): string | null => String(value),

  boolean: (value: boolean): string | null => (value ? "true" : null),

  stringArray: (value: string[]): string | null =>
    value.length === 0 ? null : value.join(","),

  numberArray: (value: number[]): string | null =>
    value.length === 0 ? null : value.join(","),
};

/**
 * Infer the type category of a value for auto-parsing
 */
function inferType(
  value: URLStateValue,
): "string" | "number" | "boolean" | "stringArray" | "numberArray" | "null" {
  if (value === null) return "null";
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (Array.isArray(value)) {
    if (value.length === 0 || typeof value[0] === "string")
      return "stringArray";
    return "numberArray";
  }
  return "string";
}

/**
 * Get default parser for a value type
 */
function getDefaultParser<T extends URLStateValue>(
  defaultValue: T,
): (value: string | null) => T {
  const type = inferType(defaultValue);

  switch (type) {
    case "number":
      return ((value: string | null) =>
        defaultParsers.number(value, defaultValue as number)) as (
        value: string | null,
      ) => T;
    case "boolean":
      return ((value: string | null) =>
        defaultParsers.boolean(value, defaultValue as boolean)) as (
        value: string | null,
      ) => T;
    case "stringArray":
      return ((value: string | null) =>
        defaultParsers.stringArray(value, defaultValue as string[])) as (
        value: string | null,
      ) => T;
    case "numberArray":
      return ((value: string | null) =>
        defaultParsers.numberArray(value, defaultValue as number[])) as (
        value: string | null,
      ) => T;
    case "null":
      return (() => defaultValue) as (value: string | null) => T;
    default:
      return ((value: string | null) =>
        defaultParsers.string(value, defaultValue as string)) as (
        value: string | null,
      ) => T;
  }
}

/**
 * Get default serializer for a value type
 */
function getDefaultSerializer<T extends URLStateValue>(
  defaultValue: T,
): (value: T) => string | null {
  const type = inferType(defaultValue);

  switch (type) {
    case "number":
      return defaultSerializers.number as (value: T) => string | null;
    case "boolean":
      return defaultSerializers.boolean as (value: T) => string | null;
    case "stringArray":
      return defaultSerializers.stringArray as (value: T) => string | null;
    case "numberArray":
      return defaultSerializers.numberArray as (value: T) => string | null;
    case "null":
      return () => null;
    default:
      return defaultSerializers.string as (value: T) => string | null;
  }
}

/**
 * Hook to sync component state with URL query parameters
 *
 * @param schema - Schema definition for URL parameters with types and defaults
 * @param options - Optional configuration
 * @returns State object and setter functions
 *
 * @example
 * ```tsx
 * // Basic usage with multiple params
 * const { state, setParam, setParams } = useURLState({
 *   page: { defaultValue: 1 },
 *   search: { defaultValue: '' },
 *   sort: { defaultValue: 'date' },
 *   ascending: { defaultValue: true },
 * });
 *
 * // Access state values (typed correctly)
 * console.log(state.page); // number
 * console.log(state.search); // string
 * console.log(state.ascending); // boolean
 *
 * // Update single param
 * setParam('page', 2);
 *
 * // Update multiple params
 * setParams({ page: 1, sort: 'name' });
 * ```
 *
 * @example
 * ```tsx
 * // With array types
 * const { state, setParam } = useURLState({
 *   categories: { defaultValue: [] as string[] },
 *   ids: { defaultValue: [] as number[] },
 * });
 *
 * setParam('categories', ['tech', 'science']);
 * // URL: ?categories=tech,science
 * ```
 *
 * @example
 * ```tsx
 * // With custom parsing/serialization
 * const { state, setParam } = useURLState({
 *   date: {
 *     defaultValue: new Date().toISOString().split('T')[0],
 *     parse: (value) => value || new Date().toISOString().split('T')[0],
 *     serialize: (value) => value || null,
 *   },
 * });
 * ```
 */
export function useURLState<T extends Record<string, URLStateValue>>(
  schema: URLStateSchema<T>,
  options: {
    /** Use replace instead of push for navigation (default: true) */
    replace?: boolean;
    /** Scroll to top after navigation (default: false) */
    scroll?: boolean;
  } = {},
): UseURLStateReturn<T> {
  const { replace = true, scroll = false } = options;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse current URL state based on schema
  const state = useMemo(() => {
    const result = {} as T;

    for (const key of Object.keys(schema) as (keyof T)[]) {
      const paramSchema = schema[key];
      const rawValue = searchParams.get(key as string);

      const parser =
        paramSchema.parse ?? getDefaultParser(paramSchema.defaultValue);
      result[key] = parser(rawValue);
    }

    return result;
  }, [searchParams, schema]);

  // Create new URLSearchParams with updated values
  const createNewParams = useCallback(
    (updates: Partial<T>): URLSearchParams => {
      const newParams = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        const paramSchema = schema[key as keyof T];
        if (!paramSchema) continue;

        const serializer =
          paramSchema.serialize ??
          getDefaultSerializer(paramSchema.defaultValue);
        const serialized = serializer(value as T[keyof T]);

        // Check if value equals default - if so, remove from URL
        const defaultValue = paramSchema.defaultValue;
        const isDefault =
          JSON.stringify(value) === JSON.stringify(defaultValue);

        if (serialized === null || isDefault) {
          newParams.delete(key);
        } else {
          newParams.set(key, serialized);
        }
      }

      return newParams;
    },
    [searchParams, schema],
  );

  // Navigate with new params
  const navigate = useCallback(
    (newParams: URLSearchParams) => {
      const search = newParams.toString();
      const url = search ? `${pathname}?${search}` : pathname;

      if (replace) {
        router.replace(url, { scroll });
      } else {
        router.push(url, { scroll });
      }
    },
    [router, pathname, replace, scroll],
  );

  // Set a single parameter
  const setParam = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      const updates = { [key]: value } as unknown as Partial<T>;
      const newParams = createNewParams(updates);
      navigate(newParams);
    },
    [createNewParams, navigate],
  );

  // Set multiple parameters
  const setParams = useCallback(
    (params: Partial<T>) => {
      const newParams = createNewParams(params);
      navigate(newParams);
    },
    [createNewParams, navigate],
  );

  // Reset a single parameter to default
  const resetParam = useCallback(
    <K extends keyof T>(key: K) => {
      const paramSchema = schema[key];
      if (!paramSchema) return;
      setParam(key, paramSchema.defaultValue);
    },
    [schema, setParam],
  );

  // Reset all parameters to defaults
  const resetAll = useCallback(() => {
    const url = pathname;
    if (replace) {
      router.replace(url, { scroll });
    } else {
      router.push(url, { scroll });
    }
  }, [router, pathname, replace, scroll]);

  // Get current search string
  const searchString = useMemo(() => {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(state)) {
      const paramSchema = schema[key as keyof T];
      if (!paramSchema) continue;

      const serializer =
        paramSchema.serialize ?? getDefaultSerializer(paramSchema.defaultValue);
      const serialized = serializer(value as T[keyof T]);

      const isDefault =
        JSON.stringify(value) === JSON.stringify(paramSchema.defaultValue);

      if (serialized !== null && !isDefault) {
        params.set(key, serialized);
      }
    }

    return params.toString();
  }, [state, schema]);

  return {
    state,
    setParam,
    setParams,
    resetParam,
    resetAll,
    searchString,
  };
}

/**
 * Create a single URL state parameter hook
 * Simplified version for when you only need one parameter
 *
 * @param key - URL parameter key
 * @param defaultValue - Default value when param is not in URL
 * @param options - Optional parsing/serializing functions
 *
 * @example
 * ```tsx
 * const [page, setPage] = useURLParam('page', 1);
 * const [search, setSearch] = useURLParam('search', '');
 * const [active, setActive] = useURLParam('active', true);
 * ```
 */
export function useURLParam<T extends URLStateValue>(
  key: string,
  defaultValue: T,
  options: {
    parse?: (value: string | null) => T;
    serialize?: (value: T) => string | null;
    replace?: boolean;
    scroll?: boolean;
  } = {},
): [T, (value: T) => void, () => void] {
  const { parse, serialize, replace = true, scroll = false } = options;

  const schema = useMemo(
    () => ({
      [key]: {
        defaultValue,
        parse,
        serialize,
      },
    }),
    [key, defaultValue, parse, serialize],
  );

  const { state, setParam, resetParam } = useURLState(
    schema as URLStateSchema<Record<string, T>>,
    { replace, scroll },
  );

  const setValue = useCallback(
    (value: T) => {
      setParam(key as keyof Record<string, T>, value);
    },
    [setParam, key],
  );

  const reset = useCallback(() => {
    resetParam(key as keyof Record<string, T>);
  }, [resetParam, key]);

  return [state[key as keyof typeof state] as T, setValue, reset];
}
