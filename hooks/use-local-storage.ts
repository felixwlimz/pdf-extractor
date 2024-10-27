'use client'
import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {

  const [value, setValue] = useState(() => {
    try {
      const value = localStorage.getItem(key);

      if (value) {
        return JSON.parse(value);
      } else {
        localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }
    } catch (error) {
      localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    }
  });

  useEffect(() => {
     localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue]
}
