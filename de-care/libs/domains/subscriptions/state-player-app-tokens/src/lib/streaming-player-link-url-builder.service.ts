import { Inject, Injectable } from '@angular/core';
import { PlayerAppTokenConfig, PLAYER_APP_TOKEN_CONFIG } from '@de-care/shared/configuration-tokens-player-app';
import { createUrl } from './helpers';

@Injectable({ providedIn: 'root' })
export class StreamingPlayerLinkUrlBuilderService {
    constructor(@Inject(PLAYER_APP_TOKEN_CONFIG) private readonly _playerAppTokenConfig: PlayerAppTokenConfig) {}

    createUrl(deepLink: string, useCase = ''): string {
        return createUrl(deepLink, useCase, this._playerAppTokenConfig);
    }
}
