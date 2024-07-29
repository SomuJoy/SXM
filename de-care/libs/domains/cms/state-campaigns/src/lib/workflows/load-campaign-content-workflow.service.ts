import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, mapTo, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { DataCmsCampaignsService } from '../data-services/data-cms-campaigns.service';
import { loadCampaignContentError, setCampaignContent } from '../state/actions';
import { DataCmsHerosService } from '../data-services/data-cms-heros.service';

@Injectable({ providedIn: 'root' })
export class LoadCampaignContentWorkflowService implements DataWorkflow<{ campaignId: string }, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _dataCmsCampaignsService: DataCmsCampaignsService,
        private readonly _dataCmsHerosService: DataCmsHerosService
    ) {}

    build({ campaignId }: { campaignId: string }): Observable<boolean> {
        return this._dataCmsCampaignsService.getCampaignById(campaignId).pipe(
            concatMap((campaign) => this._dataCmsCampaignsService.getCampaignAssetById(campaign.assets?.[0].id)),
            concatMap((campaignAsset) => this._dataCmsHerosService.getHeroAssetById(campaignAsset.sales_heros?.[0].id)),
            tap((campaign) => {
                this._store.dispatch(
                    setCampaignContent({
                        campaign: {
                            campaignId: campaignId,
                            heroBackgroundImage: campaign?.hero_background_image,
                            heroForegroundImage: campaign?.hero_foreground_image,
                            heroHeadline: campaign?.hero_headline,
                            heroSubHeadline: campaign?.hero_sub_headline,
                        },
                    })
                );
            }),
            mapTo(true),
            catchError(() => {
                this._store.dispatch(loadCampaignContentError());
                return of(false);
            })
        );
    }
}
