import { useEffect, useRef } from "react";

/**
 * Custom hook that returns the previous value of any state or prop.
 * Useful for comparing current vs previous values in effects or renders.
 *
 * @param value - The current value to track
 * @returns The previous value (undefined on initial render)
 *
 * @example
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 * // On first render: prevCount is undefined
 * // After setCount(5): prevCount is 0, count is 5
 */
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default usePrevious;
