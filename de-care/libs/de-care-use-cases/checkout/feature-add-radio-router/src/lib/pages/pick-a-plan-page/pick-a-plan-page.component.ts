import { Component, OnInit } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReactiveComponentModule } from '@ngrx/component';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routes/page-step-route-configuration';
import { select, Store } from '@ngrx/store';
import { SxmUiVehicleYmmInfoComponentModule } from '@de-care/shared/sxm-ui/ui-vehicle-ymm-info';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomainsOffersUiOfferFormsModule } from '@de-care/domains/offers/ui-offer-forms';
import { catchError, map } from 'rxjs/operators';
import { getPickAPlanPageViewModel, LoadOffersCustomerForAddRadioWorkflowService, setSelectedPlanCode } from '@de-care/de-care-use-cases/checkout/state-add-radio-router';
import { SharedSxmUiUiToastNotificationModule } from '@de-care/shared/sxm-ui/ui-toast-notification';
import { SxmUiMultiPackageCardSelectionSkeletonLoaderComponentModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SxmUiButtonCtaSkeletonLoaderComponentModule } from '@de-care/shared/sxm-ui/ui-button-cta';
import { SxmUiSkeletonLoaderTextCopyComponentModule } from '@de-care/shared/sxm-ui/ui-skeleton-loader-panel';
import { suspensify } from '@jscutlery/operators';
import { of } from 'rxjs';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-pick-a-plan-page',
    templateUrl: './pick-a-plan-page.component.html',
    styleUrls: ['./pick-a-plan-page.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveComponentModule,
        DeCareSharedUiPageLayoutModule,
        SharedSxmUiUiStepperModule,
        SxmUiVehicleYmmInfoComponentModule,
        DomainsOffersUiOfferFormsModule,
        SharedSxmUiUiToastNotificationModule,
        SxmUiMultiPackageCardSelectionSkeletonLoaderComponentModule,
        SxmUiButtonCtaSkeletonLoaderComponentModule,
        SxmUiSkeletonLoaderTextCopyComponentModule,
    ],
})
export class PickAPlanPageComponent implements ComponentWithLocale, OnInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    multiOfferSelectionData$;
    viewModel$ = this._store.select(getPickAPlanPageViewModel);

    offerLoad$ = this._loadOffersCustomerForAddRadioWorkflowService.build().pipe(
        suspensify(),
        catchError(() => of(this._router.createUrlTree(['/error'])))
    );

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _activatedRoute: ActivatedRoute,
        private _translateService: TranslateService,
        private readonly _router: Router,
        private readonly _loadOffersCustomerForAddRadioWorkflowService: LoadOffersCustomerForAddRadioWorkflowService
    ) {
        translationsForComponentService.init(this);
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
    submitForm({ planCode }) {
        this._store.dispatch(setSelectedPlanCode({ planCode }));
        this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' });
    }

    selectedPlan({ planCode }) {
        this._store.dispatch(setSelectedPlanCode({ planCode }));
    }

    ngOnInit(): void {
        this.multiOfferSelectionData$ = this._store.pipe(
            select(getPickAPlanPageViewModel),
            map(({ offersAddSelectionData }) => ({
                mainOffers: offersAddSelectionData.mainOffers.map(this.handlePackageData.bind(this)),
                additionalOffers: offersAddSelectionData.additionalOffers.map(this.handlePackageData.bind(this)),
            }))
        );
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }
}
