import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import {
    getOfferIncludesFees,
    getPlanRecapCardViewModel,
    getQuebecProvince,
    getQuoteViewModel,
    getSelectedOfferViewModel,
    getDisplayNuCaptcha,
    SubmitPurchaseTransactionWorkflowErrors,
    SubmitPurchaseTransactionWorkflowService,
    getVehicleInfoVM,
} from '@de-care/de-care-use-cases/checkout/state-satellite';
import { ReviewQuoteAndApproveFormComponent, ReviewQuoteAndApproveFormComponentApi } from '@de-care/de-care-use-cases/checkout/ui-common';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { SxmUiVehicleYmmInfoComponentModule } from '@de-care/shared/sxm-ui/ui-vehicle-ymm-info';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-targeted-review-page',
    templateUrl: './step-targeted-review-page.component.html',
    styleUrls: ['./step-targeted-review-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        DeCareSharedUiPageLayoutModule,
        SxmUiVehicleYmmInfoComponentModule,
        SharedSxmUiUiAlertPillModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        ReviewQuoteAndApproveFormComponent,
    ],
})
export class StepTargetedReviewPageComponent implements ComponentWithLocale, OnInit, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    offerViewModel$ = this._store.select(getSelectedOfferViewModel);
    planRecapCardViewModel$ = this._store.select(getPlanRecapCardViewModel);
    offerIncludesFees$ = this._store.select(getOfferIncludesFees);
    // TODO: this should be changed to what it is doing for the UI and not isQuebec
    isQuebecProvince$ = this._store.select(getQuebecProvince);

    quoteViewModel$ = this._store.select(getQuoteViewModel);
    displayNuCaptcha$ = this._store.select(getDisplayNuCaptcha);
    vehicleInfoVM$ = this._store.select(getVehicleInfoVM);

    @ViewChild(ReviewQuoteAndApproveFormComponent) private readonly _reviewQuoteAndApproveFormComponent: ReviewQuoteAndApproveFormComponentApi;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _store: Store,
        private readonly _submitPurchaseTransactionWorkflowService: SubmitPurchaseTransactionWorkflowService
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'review' }));
    }

    submitTransaction() {
        this._submitPurchaseTransactionWorkflowService.build().subscribe({
            next: () => {
                this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { relativeTo: this._activatedRoute, replaceUrl: true }).then(() => {
                    this._reviewQuoteAndApproveFormComponent.setProcessingCompleted();
                });
            },
            error: (error: SubmitPurchaseTransactionWorkflowErrors) => {
                this._reviewQuoteAndApproveFormComponent.setProcessingCompleted();
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
}
