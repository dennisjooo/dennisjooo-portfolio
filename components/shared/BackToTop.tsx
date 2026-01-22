'use client';

import { useEffect, useState } from 'react';
import { BsArrowUp } from 'react-icons/bs';
import { scrollToTop } from '@/lib/utils/scrollHelpers';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    const handleScrollToTop = () => {
        scrollToTop();
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={handleScrollToTop}
                    className="fixed bottom-8 right-8 p-3 text-accent-foreground rounded-full shadow-lg transition-all duration-300 z-50 border-none bg-accent"
                    style={{
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 0 20px var(--accent-shadow)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15), 0 0 30px var(--accent-shadow)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1), 0 0 20px var(--accent-shadow)';
                    }}
                    aria-label="Back to top"
                >
                    <BsArrowUp size={20} />
                </button>
            )}
        </>
    );
};

export default BackToTop; 