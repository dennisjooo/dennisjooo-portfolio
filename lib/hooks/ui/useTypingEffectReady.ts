import { useEffect, useState } from "react";
import { resolveTypingDescription } from "./typingRollback";

export function useTypingEffectReady(
  enabled: boolean,
  initialDelay: number,
  firstDescription: string,
) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsReady(true);
      return;
    }

    setIsReady(false);
    const start = () => setIsReady(true);

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, {
        timeout: initialDelay + 500,
      });
      const timer = setTimeout(start, initialDelay);
      return () => {
        window.cancelIdleCallback(id);
        clearTimeout(timer);
      };
    }

    const timer = setTimeout(start, initialDelay);
    return () => clearTimeout(timer);
  }, [enabled, initialDelay]);

  const disabledDescription = enabled
    ? ""
    : resolveTypingDescription(firstDescription);

  return { isReady, disabledDescription };
}
