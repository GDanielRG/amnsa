import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;

const mediaQueryList =
    typeof window === 'undefined'
        ? undefined
        : window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

function subscribe(callback: (event: MediaQueryListEvent) => void): () => void {
    if (!mediaQueryList) {
        return () => {};
    }

    mediaQueryList.addEventListener('change', callback);

    return () => {
        mediaQueryList.removeEventListener('change', callback);
    };
}

function getSnapshot(): boolean {
    return mediaQueryList?.matches ?? false;
}

function getServerSnapshot(): boolean {
    return false;
}

export function useIsMobile(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
