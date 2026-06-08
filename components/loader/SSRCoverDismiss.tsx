'use client';

import { useEffect } from 'react';
import { dismissSSRCover } from './dismissSSRCover';

export function SSRCoverDismiss() {
    useEffect(() => {
        dismissSSRCover();
    }, []);

    return null;
}
