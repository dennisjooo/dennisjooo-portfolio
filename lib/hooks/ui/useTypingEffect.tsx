import { useState, useEffect, useCallback, useMemo } from "react";
import { shuffleArray } from "@/lib/utils/array";
import { parseRollback, type RollbackPhase } from "./typingRollback";
import { useTypingEffectReady } from "./useTypingEffectReady";

export { resolveTypingDescription } from "./typingRollback";

type UseTypingEffectOptions = {
  enabled?: boolean;
};

export const useTypingEffect = (
  descriptions: string[],
  initialDelay: number = 500,
  options: UseTypingEffectOptions = {},
) => {
  const { enabled = true } = options;
  const shuffledDescriptions = useMemo(
    () => shuffleArray(descriptions),
    [descriptions],
  );
  const firstDescription = shuffledDescriptions[0] ?? "";
  const { isReady, disabledDescription } = useTypingEffectReady(
    enabled,
    initialDelay,
    firstDescription,
  );

  const [description, setDescription] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [rollbackPhase, setRollbackPhase] = useState<RollbackPhase | null>(
    null,
  );

  useEffect(() => {
    if (!enabled) {
      setDescription(disabledDescription);
    }
  }, [enabled, disabledDescription]);

  const handleTyping = useCallback(() => {
    if (!enabled || !isReady) return;
    const i = loopNum % shuffledDescriptions.length;
    const fullDescription = shuffledDescriptions[i];
    const parsedRollback = parseRollback(fullDescription);

    if (parsedRollback && !isDeleting) {
      const { prefix, oldText, newText, suffix } = parsedRollback;
      const fullWithOld = prefix + oldText + suffix;
      const fullWithNew = prefix + newText + suffix;

      if (!rollbackPhase) {
        if (description.length < fullWithOld.length) {
          setDescription(fullWithOld.substring(0, description.length + 1));
          setTypingSpeed(100);
        } else {
          setRollbackPhase("pausing");
          setTypingSpeed(800);
        }
      } else if (rollbackPhase === "pausing") {
        setRollbackPhase("deleting-old");
        setTypingSpeed(50);
      } else if (rollbackPhase === "deleting-old") {
        const targetLength = prefix.length;
        if (description.length > targetLength) {
          setDescription(description.substring(0, description.length - 1));
          setTypingSpeed(50);
        } else {
          setRollbackPhase("typing-new");
          setTypingSpeed(100);
        }
      } else if (rollbackPhase === "typing-new") {
        if (description.length < fullWithNew.length) {
          setDescription(fullWithNew.substring(0, description.length + 1));
          setTypingSpeed(100);
        } else {
          setRollbackPhase("done");
          setTypingSpeed(500);
        }
      } else if (rollbackPhase === "done") {
        setTimeout(() => {
          setIsDeleting(true);
          setRollbackPhase(null);
        }, 500);
      }
    } else if (parsedRollback && isDeleting) {
      const { prefix, newText, suffix } = parsedRollback;
      const fullWithNew = prefix + newText + suffix;

      setDescription(fullWithNew.substring(0, description.length - 1));
      setTypingSpeed(30);

      if (description === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setRollbackPhase(null);
      }
    } else {
      setDescription(
        isDeleting
          ? fullDescription.substring(0, description.length - 1)
          : fullDescription.substring(0, description.length + 1),
      );

      setTypingSpeed(isDeleting ? 30 : 100);

      if (!isDeleting && description === fullDescription) {
        setTimeout(() => setIsDeleting(true), 500);
      } else if (isDeleting && description === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setRollbackPhase(null);
      }
    }
  }, [
    description,
    enabled,
    isDeleting,
    isReady,
    loopNum,
    rollbackPhase,
    shuffledDescriptions,
  ]);

  useEffect(() => {
    if (!enabled || !isReady) return;
    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [enabled, handleTyping, isReady, typingSpeed]);

  return description;
};
