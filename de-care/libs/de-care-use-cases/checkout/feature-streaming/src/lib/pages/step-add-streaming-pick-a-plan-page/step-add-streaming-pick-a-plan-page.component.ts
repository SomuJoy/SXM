import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import {
    getSelectedOfferOfferInfoLegalCopy,
    getOffersAddSelectionData,
    setMrdSelectedPlanCode,
    getSelectedPlanCode,
    getSelectedOfferIsMrd,
    LoadPurchaseDataForAddStreamingWorkflowService,
    LoadPurchaseDataForAddStreamingnWorkflowErrors,
    getAccountProvinceCode,
} from '@de-care/de-care-use-cases/checkout/state-streaming';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { SharedSxmUiUiLoadingWithAlertMessageModule } from '@de-care/shared/sxm-ui/ui-loading-with-alert-message';
import { DomainsOffersUiOfferFormsModule } from '@de-care/domains/offers/ui-offer-forms';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { suspensify } from '@jscutlery/operators';
import { SxmUiMultiPackageCardSelectionSkeletonLoaderComponentModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SxmUiButtonCtaSkeletonLoaderComponentModule } from '@de-care/shared/sxm-ui/ui-button-cta';
import { SxmUiSkeletonLoaderTextCopyComponentModule } from '@de-care/shared/sxm-ui/ui-skeleton-loader-panel';
import { ProvinceSelection, PROVINCE_SELECTION } from '@de-care/de-care/shared/ui-province-selection';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-add-streaming-pick-a-plan',
    templateUrl: './step-add-streaming-pick-a-plan-page.component.html',
    styleUrls: ['./step-add-streaming-pick-a-plan-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        TranslateModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiLoadingWithAlertMessageModule,
        DomainsOffersUiOfferFormsModule,
        DeCareSharedUiPageLayoutModule,
        SxmUiMultiPackageCardSelectionSkeletonLoaderComponentModule,
        SxmUiButtonCtaSkeletonLoaderComponentModule,
        SxmUiSkeletonLoaderTextCopyComponentModule,
    ],
    standalone: true,
})
export class StepAddStreamingPickAPlanPageComponent implements ComponentWithLocale, OnInit, OnDestroy, AfterViewInit {
    selectedOfferIsMrd$ = this._store.select(getSelectedOfferIsMrd);
    getSelectedOfferOfferInfoLegalCopy$ = this._store.select(getSelectedOfferOfferInfoLegalCopy);
    getSelectedPlanCode$ = this._store.select(getSelectedPlanCode);
    multiOfferSelectionData$ = this._store.pipe(
        select(getOffersAddSelectionData),
        map(({ mainOffers, additionalOffers }) => ({
            mainOffers: mainOffers.map(this.handlePackageData.bind(this)),
            additionalOffers: additionalOffers.map(this.handlePackageData.bind(this)),
        }))
    );
    displayIneligibleLoader$ = new BehaviorSubject(false);
    private _destroy$: Subject<boolean> = new Subject<boolean>();

    translateKeyPrefix: string;
    languageResources: LanguageResources;
    pageStepRouteConfiguration: PageStepRouteConfiguration;

    offerLoad$ = this._loadPurchaseDataForAddStreamingWorkflowService.build().pipe(
        withLatestFrom(this._store.select(getAccountProvinceCode)),
        tap(([_, accountProvince]) => {
            this._provinceSelection.setSelectedProvince(accountProvince);
        }),
        suspensify(),
        tap(({ error }: { error: LoadPurchaseDataForAddStreamingnWorkflowErrors }) => {
            if (error) {
                switch (error) {
                    // TODO: add cases for different error scenarios that need redirects
                    default:
                        this._router.navigate(['/error'], { replaceUrl: true });
                }
            }
        })
    );

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _store: Store,
        private _translateService: TranslateService,
        private readonly _loadPurchaseDataForAddStreamingWorkflowService: LoadPurchaseDataForAddStreamingWorkflowService,
        @Inject(PROVINCE_SELECTION) private readonly _provinceSelection: ProvinceSelection,
        @Inject(DOCUMENT) private readonly _document: Document
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'offerpresentmentstep' }));
        setTimeout(() => {
            this._scrollToTop();
        }, 1000);
    }

    private _scrollToTop() {
        this._document.body.scrollTop = 0;
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    submitForm({ planCode }) {
        this._store.dispatch(setMrdSelectedPlanCode({ planCode }));
        this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' });
    }

    selectedPlan({ planCode }) {
        this._store.dispatch(setMrdSelectedPlanCode({ planCode }));
    }

    private handlePackageData(packageData: Record<string, any>) {
        return {
            ...(packageData.isBestPackage && {
                headlineFlagCopy: this._translateService.instant(`${this.translateKeyPrefix}.PACKAGE_SELECTION_STEP`),
            }),
            fieldLabel: this._translateService.instant(`${this.translateKeyPrefix}.CONTENT_CARD_HEADLINE`),
            planCodeOptions: [
                {
                    planCode: packageData.planCode,
                },
            ],
            packageData: packageData.data,
        };
    }
}
