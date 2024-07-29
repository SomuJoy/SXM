import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { flatMap, switchMap } from 'rxjs/operators';
import { loadCampaignContentByCampaignId } from './public.actions';
import { LoadCampaignContentWorkflowService } from '../workflows/load-campaign-content-workflow.service';
import { setCampaignContent } from './actions';

@Injectable({ providedIn: 'root' })
export class Effects {
    constructor(private readonly _actions$: Actions, private readonly _loadCampaignContentWorkflowService: LoadCampaignContentWorkflowService) {}

    loadCampaignById = createEffect(
        () =>
            this._actions$.pipe(
                ofType(loadCampaignContentByCampaignId),
                switchMap(({ campaignId }) => this._loadCampaignContentWorkflowService.build({ campaignId }))
            ),
        { dispatch: false }
    );

    onSetCampaignContent = createEffect(() =>
        this._actions$.pipe(
            ofType(setCampaignContent),
            flatMap(({ campaign }) => [
                // TODO: add any behavior events that need to get dispatched to here
            ])
        )
    );
}
