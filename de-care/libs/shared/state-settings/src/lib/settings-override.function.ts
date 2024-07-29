export function settingsOverride<T>(settings: T, overrideSettings: Partial<T>): T {
    return { ...settings, ...overrideSettings };
}
