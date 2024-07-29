import { InjectionToken } from '@angular/core';

export interface PlayerAppTokenConfig {
    baseUrl: string;
    org: string;
    disableForBrowserUserAgentPlatforms?: string[];
}

export const PLAYER_APP_TOKEN_CONFIG = new InjectionToken<PlayerAppTokenConfig>('playerAppTokenConfig');
