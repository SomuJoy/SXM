export function getPlatform() {
    const _navigator = document?.defaultView?.navigator;
    const userAgent = _navigator?.userAgent;
    if (userAgent?.match(/Android/i)) {
        return 'android';
    } else if (userAgent?.match(/iPad|iPhone|iPod/i)) {
        return 'ios';
    }
    return 'desktop';
}
