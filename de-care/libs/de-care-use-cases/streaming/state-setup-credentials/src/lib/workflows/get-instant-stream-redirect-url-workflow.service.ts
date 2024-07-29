import { Injectable } from '@angular/core';
import { GetAlcCodeFromAccountTokenInstantStreamWorkflowService } from '@de-care/domains/account/state-account';
import { GetUrlForAlcCodeWorkflowService } from '@de-care/domains/subscriptions/state-player-app-tokens';
import { behaviorEventInteractionLinkClick } from '@de-care/shared/state-behavior-events';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

export type GetInstantStreamRedirectUrlWorkflowError = 'SYSTEM' | 'NO_TOKEN';

@Injectable({ providedIn: 'root' })
export class GetInstantStreamRedirectUrlWorkflowService implements DataWorkflow<void, string> {
    constructor(
        private readonly _store: Store,
        private readonly _getAlcCodeFromAccountTokenInstantStreamWorkflowService: GetAlcCodeFromAccountTokenInstantStreamWorkflowService,
        private readonly _getUrlForAlcCodeWorkflowService: GetUrlForAlcCodeWorkflowService
    ) {}

    build(): Observable<string> {
        return this._store.select(getNormalizedQueryParams).pipe(
            map(({ tkn }) => {
                if (!tkn) {
                    // TODO: add a behavior event error here if need be to track missing token scenario.
                    throw 'NO_TOKEN' as GetInstantStreamRedirectUrlWorkflowError;
                }
                this._store.dispatch(
                    behaviorEventInteractionLinkClick({
                        linkName: 'instantstream',
                        linkType: 'player',
                    })
                );
                return tkn;
            }),
            concatMap((token) => this._getAlcCodeFromAccountTokenInstantStreamWorkflowService.build({ token })),
            // TODO: figure out how to get the deeplinkUrl value here (the smartlink query params stuff) and figure out what useCase to use
            concatMap((alcCode) => this._getUrlForAlcCodeWorkflowService.build({ alcCode, deeplinkUrl: '', useCase: '' }))
        );
    }
}
