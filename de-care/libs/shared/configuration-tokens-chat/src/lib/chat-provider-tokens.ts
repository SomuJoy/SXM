import { InjectionToken } from '@angular/core';

export type ChatProvider = '247' | 'liveperson';

export const ChatProviderToken = new InjectionToken<ChatProvider>('chatProvider', {
    providedIn: 'root',
    factory: () => 'liveperson',
});
