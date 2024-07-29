type UserAgentPlatformTypes = 'ios' | 'android' | 'web';

export function getUserAgentPlatform(userAgent: string): UserAgentPlatformTypes {
    let platform: UserAgentPlatformTypes = 'web';
    if (userAgent.match(/Android/i)) {
        platform = 'android';
    } else if (userAgent.match(/iPad|iPhone|iPod/i)) {
        platform = 'ios';
    }
    return platform;
}
