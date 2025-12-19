import { useState, useEffect, useCallback, useMemo } from 'react';
import { shuffleArray } from '@/lib/utils/array';

interface RollbackConfig {
    prefix: string;
    oldText: string;
    newText: string;
    suffix: string;
}

type RollbackPhase = 'typing-to-old' | 'pausing' | 'deleting-old' | 'typing-new' | 'done';

const parseRollback = (text: string): RollbackConfig | null => {
    const rollbackRegex = /^(.*){{(.+?)>>(.+?)}}(.*)$/;
    const match = text.match(rollbackRegex);

    if (match) {
        return {
            prefix: match[1],
            oldText: match[2],
            newText: match[3],
            suffix: match[4],
        };
    }
    return null;
};

export const useTypingEffect = (descriptions: string[]) => {
    const shuffledDescriptions = useMemo(() => shuffleArray(descriptions), [descriptions]);
    const [description, setDescription] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(100);
    const [rollbackPhase, setRollbackPhase] = useState<RollbackPhase | null>(null);

    const handleTyping = useCallback(() => {
        const i = loopNum % shuffledDescriptions.length;
        const fullDescription = shuffledDescriptions[i];
        const parsedRollback = parseRollback(fullDescription);

        // Handle descriptions with rollback syntax
        if (parsedRollback && !isDeleting) {
            const { prefix, oldText, newText, suffix } = parsedRollback;
            const fullWithOld = prefix + oldText + suffix;
            const fullWithNew = prefix + newText + suffix;

            if (!rollbackPhase) {
                // Start typing phase - type up to and including the old text
                if (description.length < fullWithOld.length) {
                    setDescription(fullWithOld.substring(0, description.length + 1));
                    setTypingSpeed(100);
                } else {
                    // Finished typing the old text, pause before deleting
                    setRollbackPhase('pausing');
                    setTypingSpeed(800);
                }
            } else if (rollbackPhase === 'pausing') {
                // Start deleting the old text
                setRollbackPhase('deleting-old');
                setTypingSpeed(50);
            } else if (rollbackPhase === 'deleting-old') {
                const targetLength = prefix.length;
                if (description.length > targetLength) {
                    setDescription(description.substring(0, description.length - 1));
                    setTypingSpeed(50);
                } else {
                    // Finished deleting, start typing the new text
                    setRollbackPhase('typing-new');
                    setTypingSpeed(100);
                }
            } else if (rollbackPhase === 'typing-new') {
                if (description.length < fullWithNew.length) {
                    setDescription(fullWithNew.substring(0, description.length + 1));
                    setTypingSpeed(100);
                } else {
                    // Finished typing the new text
                    setRollbackPhase('done');
                    setTypingSpeed(500);
                }
            } else if (rollbackPhase === 'done') {
                // Pause before starting to delete the whole description
                setTimeout(() => {
                    setIsDeleting(true);
                    setRollbackPhase(null);
                }, 500);
            }
        } else if (parsedRollback && isDeleting) {
            // When deleting a rollback description, use the final processed version
            const { prefix, newText, suffix } = parsedRollback;
            const fullWithNew = prefix + newText + suffix;

            setDescription(fullWithNew.substring(0, description.length - 1));
            setTypingSpeed(30);

            if (description === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
                setRollbackPhase(null);
            }
        } else {
            // Handle normal descriptions (without rollback)
            setDescription(isDeleting
                ? fullDescription.substring(0, description.length - 1)
                : fullDescription.substring(0, description.length + 1)
            );

            setTypingSpeed(isDeleting ? 30 : 100);

            if (!isDeleting && description === fullDescription) {
                setTimeout(() => setIsDeleting(true), 500);
            } else if (isDeleting && description === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
                setRollbackPhase(null);
            }
        }
    }, [description, isDeleting, loopNum, shuffledDescriptions, rollbackPhase]);

    useEffect(() => {
        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [handleTyping, typingSpeed]);

    return description;
};
