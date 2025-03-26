import { useEffect, useState } from "react";

export default function useDebounceValue<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    function debounce() {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay]
  );

  return debouncedValue;
}


