const isBrowser = typeof window !== 'undefined';

const session = () => {
    if (!isBrowser) return null;
    try {
        return window.sessionStorage;
    } catch (error) {
        console.error('Session storage is not available:', error);
        return null;
    }
};

export function getSessionItem(key: string) {
    return session()?.getItem(key) ?? null;
}

export function setSessionItem(key: string, value: string) {
    session()?.setItem(key, value);
}
