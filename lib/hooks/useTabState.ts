import { useState, useEffect } from 'react';
import { getSessionItem, setSessionItem } from '@/lib/utils/storage';

type TabType = 'blog' | 'certifications';

export function useTabState() {
    const [activeTab, setActiveTab] = useState<TabType>('blog');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const storedTab = getSessionItem('projectsActiveTab') as TabType | null;
        if (storedTab && (storedTab === 'blog' || storedTab === 'certifications')) {
            setActiveTab(storedTab);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            setSessionItem('projectsActiveTab', activeTab);
        }
    }, [activeTab, mounted]);

    return {
        activeTab,
        setActiveTab,
        mounted
    };
} 
