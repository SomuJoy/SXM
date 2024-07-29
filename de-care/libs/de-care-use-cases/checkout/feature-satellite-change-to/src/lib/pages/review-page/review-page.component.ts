import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { getReviewPageViewModel, SubmitSatelliteChangeToTransactionWorkflowService } from '@de-care/de-care-use-cases/checkout/state-satellite-change-to';
import { DeCareUseCasesCheckoutUiCommonModule } from '@de-care/de-care-use-cases/checkout/ui-common';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { SxmUiVehicleYmmInfoWithEditCtaComponentModule } from '@de-care/shared/sxm-ui/ui-vehicle-ymm-info';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { ReactiveComponentModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routes/page-step-route-configuration';
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'review-page',
    templateUrl: './review-page.component.html',
    styleUrls: ['./review-page.component.scss'],
    standalone: true,
    imports: [
        TranslateModule,
        ReactiveComponentModule,
        DeCareSharedUiPageLayoutModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        SxmUiVehicleYmmInfoWithEditCtaComponentModule,
        CommonModule,
        DeCareUseCasesCheckoutUiCommonModule,
    ],
})
export class ReviewPageComponent implements ComponentWithLocale, OnInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    viewModel$ = this._store.select(getReviewPageViewModel);

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _submitSatelliteChangeToTransactionWorkflowService: SubmitSatelliteChangeToTransactionWorkflowService
    ) {
        translationsForComponentService.init(this);
    }
    submitTransaction() {
        this._submitSatelliteChangeToTransactionWorkflowService.build().subscribe({
            next: () => {
                this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { relativeTo: this._activatedRoute });
            },
            error: (error) => {
                switch (error) {
                    case 'CREDIT_CARD_FAILURE': {
                        this._router.navigate([this.pageStepRouteConfiguration.paymentMethodRouteUrl], {
                            relativeTo: this._activatedRoute,
                            queryParamsHandling: 'preserve',
                            state: { ccError: true },
                        });
                        break;
                    }
                    default: {
                        this._router.navigate([this.pageStepRouteConfiguration.paymentMethodRouteUrl], {
                            relativeTo: this._activatedRoute,
                            queryParamsHandling: 'preserve',
                            state: { systemError: true },
                        });
                        break;
                    }
                }
            },
        });
    }
    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }
    redirectToSelectOrLookUpPage(useSelectYourRadioUrlForDeviceEdituse) {
        useSelectYourRadioUrlForDeviceEdituse
            ? this._router.navigate([this.pageStepRouteConfiguration.startOfFlowUrl], { relativeTo: this._activatedRoute })
            : this._router.navigate([this.pageStepRouteConfiguration.lookupDeviceUrl], { relativeTo: this._activatedRoute });
    }
}
