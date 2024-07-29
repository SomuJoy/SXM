import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import {
    getCampaignHeroViewModel,
    getOrganicSelectedOfferViewModel,
    LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService,
    LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowServiceErrors,
} from '@de-care/de-care-use-cases/checkout/state-streaming';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SharedSxmUiUiAccordionChevronModule } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { SxmUiButtonCtaSkeletonLoaderComponentModule } from '@de-care/shared/sxm-ui/ui-button-cta';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import {
    SharedSxmUiUiPrimaryPackageCardModule,
    SxmUiFeaturesListComponentModule,
    SxmUiPackageCardBasicComponentModule,
    SxmUiPrimaryPackageCardSkeletonLoaderComponentModule,
} from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SxmUiProductBannerComponentModule } from '@de-care/shared/sxm-ui/ui-product-banner';
import { SxmUiSkeletonLoaderTextCopyComponentModule } from '@de-care/shared/sxm-ui/ui-skeleton-loader-panel';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { suspensify } from '@jscutlery/operators';
import { ReactiveComponentModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FallbackAlertComponentModule } from '../../page-parts/fallback-alert/fallback-alert.component';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';

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
        TranslateModule,
        ReactiveComponentModule,
        FallbackAlertComponentModule,
        SxmUiPackageCardBasicComponentModule,
        SxmUiProductBannerComponentModule,
        SxmUiFeaturesListComponentModule,
        SharedSxmUiUiAccordionChevronModule,
        SharedSxmUiUiPrimaryPackageCardModule,
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
    displayFallbackLoader$ = new BehaviorSubject(false);
    fallbackReason$ = new BehaviorSubject('');
    campaignHeroViewModel$ = this._store.select(getCampaignHeroViewModel);
    offerViewModel$ = this._store.select(getOrganicSelectedOfferViewModel);
    offerLoad$ = this._loadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService.build().pipe(
        suspensify(),
        tap(({ value }) => {
            if (value?.['isFallbackOffer']) {
                this.displayFallbackLoader$.next(true);
                this.fallbackReason$.next(value?.['fallbackReason']?.toUpperCase());
                timer(4000).subscribe(() => {
                    this.displayFallbackLoader$.next(false);
                });
            }
        }),
        tap(({ error }: { error: LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowServiceErrors }) => {
            if (error) {
                switch (error) {
                    case 'LEGACY_FLOW_REQUIRED': {
                        this._router.navigate(['/subscribe/checkout/streaming'], { replaceUrl: true, queryParams: this._activatedRoute.snapshot.queryParams });
                        break;
                    }
                    case 'GENERIC_ERROR': {
                        this._router.navigate(['/subscribe/checkout/purchase/streaming/generic-error'], { replaceUrl: true });
                        break;
                    }
                    case 'EXPIRED_OFFER': {
                        this._router.navigate(['/subscribe/checkout/purchase/streaming/expired-offer-error'], { replaceUrl: true });
                        break;
                    }
                    case 'PROMO_CODE_REDEEMED': {
                        this._router.navigate(['/subscribe/checkout/purchase/streaming/promo-code-redeemed-error'], { replaceUrl: true });
                        break;
                    }
                    case 'SYSTEM':
                    default: {
                        this._router.navigate(['/error'], { replaceUrl: true });
                    }
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
