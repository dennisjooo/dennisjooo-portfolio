import { useState, useEffect } from 'react';
import { getSessionItem, setSessionItem } from '@/lib/utils/storage';
import { useMounted } from '@/lib/hooks/useMounted';

type TabType = 'blog' | 'certifications';

export function useTabState() {
    const [activeTab, setActiveTab] = useState<TabType>('blog');
    const mounted = useMounted();

    useEffect(() => {
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
