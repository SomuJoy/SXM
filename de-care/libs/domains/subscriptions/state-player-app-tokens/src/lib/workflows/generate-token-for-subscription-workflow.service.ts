import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { DataPlayerAppTokenService } from '../data-services/data-player-app-token.service';
import { tap, catchError, map } from 'rxjs/operators';
import { PLAYER_APP_TOKEN_CONFIG, PlayerAppTokenConfig } from '@de-care/shared/configuration-tokens-player-app';
import { behaviorEventReactionTokenForSubscriptionGenerationFailure, behaviorEventReactionTokenForSubscriptionGenerationSuccess } from '@de-care/shared/state-behavior-events';
import { getUserAgentPlatform } from '@de-care/shared/browser-common/user-agent';

interface GenerateTokenForSubscriptionWorkflowRequest {
    subscriptionId: string;
    useCase?: string;
    deeplinkUrl?: string;
}

export interface GenerateTokenForSubscriptionWorkflowResponse {
    token: string;
    url: string;
}

@Injectable({ providedIn: 'root' })
export class GenerateTokenForSubscriptionWorkflowService
    implements DataWorkflow<GenerateTokenForSubscriptionWorkflowRequest, GenerateTokenForSubscriptionWorkflowResponse | null>
{
    private readonly _navigator: Navigator;

    constructor(
        @Inject(PLAYER_APP_TOKEN_CONFIG) private readonly _playerAppTokenConfig: PlayerAppTokenConfig,
        private readonly _store: Store,
        private readonly _dataPlayerAppTokenService: DataPlayerAppTokenService,
        @Inject(DOCUMENT) document: Document
    ) {
        this._navigator = document?.defaultView?.navigator;
    }

    private disabledForUserAgentPlatform(disableForBrowserUserAgentPlatforms: string[]): boolean {
        if (!disableForBrowserUserAgentPlatforms || !Array.isArray(disableForBrowserUserAgentPlatforms)) {
            return false;
        }
        const currentPlatform = getUserAgentPlatform(this._navigator.userAgent);
        if (disableForBrowserUserAgentPlatforms.includes(currentPlatform)) {
            return true;
        }
        return false;
    }

    build({ subscriptionId, useCase, deeplinkUrl }: GenerateTokenForSubscriptionWorkflowRequest): Observable<GenerateTokenForSubscriptionWorkflowResponse | null> {
        // Checks to make sure we have player app URL configurations and if not, returns null results so fallback can be done
        if (
            !this._playerAppTokenConfig?.baseUrl ||
            !this._playerAppTokenConfig?.org ||
            this.disabledForUserAgentPlatform(this._playerAppTokenConfig?.disableForBrowserUserAgentPlatforms)
        ) {
            return of(null);
        }
        const serviceCall$ = subscriptionId ? this._dataPlayerAppTokenService.getTokenForSubscriptionId({ subscriptionId }) : this._dataPlayerAppTokenService.getToken();

        return serviceCall$.pipe(
            map(({ token }) => token),
            tap((token) => {
                if (token) {
                    this._store.dispatch(behaviorEventReactionTokenForSubscriptionGenerationSuccess());
                } else {
                    this._store.dispatch(behaviorEventReactionTokenForSubscriptionGenerationFailure({ failure: 'no-token' }));
                }
            }),
            map((token) => {
                let extraQueryParamsAsString = '';
                const deeplinkUrlPieces = new URL(deeplinkUrl);
                const base = deeplinkUrlPieces?.pathname?.substr(1) || '/';
                if (deeplinkUrlPieces?.search?.length > 1) {
                    extraQueryParamsAsString = `&${deeplinkUrlPieces.search.substr(1)}`;
                }
                return {
                    token,
                    url: `${this._playerAppTokenConfig.baseUrl}/orgs/${
                        this._playerAppTokenConfig.org
                    }/authn/flows/purchase-redirect-suspense?base=${base}${extraQueryParamsAsString}&useCase=${useCase || 'DEPurchaseCompletion'}`,
                };
            }),
            // Silently catch errors so callers don't need to worry about handling Observable stream errors
            catchError(() => {
                this._store.dispatch(behaviorEventReactionTokenForSubscriptionGenerationFailure({ failure: 'token-generation-error' }));
                return of(null);
            })
        );
    }
}
