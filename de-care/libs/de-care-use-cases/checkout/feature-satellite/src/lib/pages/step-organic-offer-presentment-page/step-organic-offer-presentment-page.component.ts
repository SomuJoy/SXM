import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiPrimaryPackageCardModule, SxmUiPrimaryPackageCardSkeletonLoaderComponentModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SharedSxmUiUiDealAddonCardModule } from '@de-care/shared/sxm-ui/ui-deal-addon-card';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { SxmUiButtonCtaSkeletonLoaderComponentModule } from '@de-care/shared/sxm-ui/ui-button-cta';
import { SxmUiSkeletonLoaderTextCopyComponentModule } from '@de-care/shared/sxm-ui/ui-skeleton-loader-panel';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';
import {
    getCampaignHeroViewModel,
    getOrganicOfferPresentmentPageViewModel,
    LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService,
    LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowServiceErrors,
} from '@de-care/de-care-use-cases/checkout/state-satellite';
import { tap } from 'rxjs/operators';
import { suspensify } from '@jscutlery/operators';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-organic-offer-presentment-page',
    templateUrl: './step-organic-offer-presentment-page.component.html',
    styleUrls: ['./step-organic-offer-presentment-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveComponentModule,
        TranslateModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        SharedSxmUiUiDealAddonCardModule,
        SharedSxmUiUiDataClickTrackModule,
        DeCareSharedUiPageLayoutModule,
        SxmUiPrimaryPackageCardSkeletonLoaderComponentModule,
        SxmUiButtonCtaSkeletonLoaderComponentModule,
        SxmUiSkeletonLoaderTextCopyComponentModule,
    ],
})
export class StepOrganicOfferPresentmentPageComponent implements ComponentWithLocale, OnInit, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    campaignHeroViewModel$ = this._store.select(getCampaignHeroViewModel);
    offerViewModel$ = this._store.select(getOrganicOfferPresentmentPageViewModel);
    offerLoad$ = this._loadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService.build().pipe(
        suspensify(),
        tap(({ error }: { error: LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowServiceErrors }) => {
            if (error) {
                switch (error) {
                    case 'LEGACY_FLOW_REQUIRED': {
                        this._router.navigate(['subscribe/checkout/flepz'], { queryParams: this._activatedRoute.snapshot.queryParams });
                        break;
                    }
                    case 'PROMO_CODE_EXPIRED':
                        this._router.navigate(['/subscribe/checkout/purchase/satellite/expired-offer-error'], { replaceUrl: true });
                        break;
                    case 'PROMO_CODE_INVALID':
                        this._router.navigate(['/subscribe/checkout/purchase/satellite/generic-error'], { replaceUrl: true });
                        break;
                    case 'PROMO_CODE_REDEEMED':
                        this._router.navigate(['/subscribe/checkout/purchase/satellite/promo-code-redeemed-error'], { replaceUrl: true });
                        break;
                    case 'SYSTEM':
                    default:
                        this._router.navigate(['error']);
                        break;
                }
            }
        })
    );

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _store: Store,
        private readonly _loadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService: LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'offerpresentmentstep' }));
    }
}
