// 倒计时hook
import { useState, useEffect, useRef, useCallback } from "react";

export const useCountDown = (initialCount: number = 60) => {
  const [count, setCount] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    if (count > 0) {
      timerRef.current = setInterval(() => {
        setCount((prev) => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [count]);

  return { count, start, isCounting: count > 0 };
};
