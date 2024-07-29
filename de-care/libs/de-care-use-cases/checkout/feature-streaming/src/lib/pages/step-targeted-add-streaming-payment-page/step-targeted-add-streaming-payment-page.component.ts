import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { COUNTRY_SETTINGS, CountrySettingsToken } from '@de-care/shared/configuration-tokens-locales';
import {
    DeCareUseCasesCheckoutUiCommonModule,
    PaymentInfoBasicData,
    PaymentInfoBasicFormComponent,
    PaymentInfoBasicFormComponentApi,
} from '@de-care/de-care-use-cases/checkout/ui-common';
import {
    LoadPurchaseReviewDataForMrdWorkflowService,
    SubmitPurchasePaymentInformationForMrdWorkflowError,
    SubmitPurchasePaymentInformationForMrdWorkflowService,
    getAddStreamingPaymentViewModel,
    clearPaymentInfoCvv,
} from '@de-care/de-care-use-cases/checkout/state-streaming';
import { catchError, concatMap, mapTo } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, throwError, timer } from 'rxjs';
import { CommonModule, DOCUMENT, Location } from '@angular/common';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SharedSxmUiUiLoadingWithAlertMessageModule } from '@de-care/shared/sxm-ui/ui-loading-with-alert-message';
import { ReactiveComponentModule } from '@ngrx/component';
import { PickAPlanTermBillingFormComponentModule } from '../../page-parts/pick-a-plan-term-billing-form/pick-a-plan-term-billing-form.component';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-targeted-add-streaming-payment-page',
    templateUrl: './step-targeted-add-streaming-payment-page.component.html',
    styleUrls: ['./step-targeted-add-streaming-payment-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        SharedSxmUiUiStepperModule,
        DeCareUseCasesCheckoutUiCommonModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        SharedSxmUiUiLoadingWithAlertMessageModule,
        ReactiveComponentModule,
        PickAPlanTermBillingFormComponentModule,
        DeCareSharedUiPageLayoutModule,
    ],
})
export class StepTargetedAddStreamingPaymentPageComponent implements ComponentWithLocale, OnInit, AfterViewInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    @ViewChild(PaymentInfoBasicFormComponent) private readonly _paymentInfoBasicFormComponentApi: PaymentInfoBasicFormComponentApi;
    addStreamingPaymentViewModel$ = this._store.select(getAddStreamingPaymentViewModel);
    displayIneligibleLoader$ = new BehaviorSubject(false);

    constructor(
        public readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _location: Location,
        private readonly _submitPurchasePaymentInformationForMrdWorkflowService: SubmitPurchasePaymentInformationForMrdWorkflowService,
        private readonly _loadPurchaseReviewDataForMrdWorkflowService: LoadPurchaseReviewDataForMrdWorkflowService,
        @Inject(DOCUMENT) private readonly _document: Document,
        @Inject(COUNTRY_SETTINGS) public readonly countrySettings: CountrySettingsToken
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'paymentinfo' }));
        this._store.dispatch(clearPaymentInfoCvv());
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    ngAfterViewInit() {
        if ((this._location?.getState() as any)?.mrdCCError) {
            this._paymentInfoBasicFormComponentApi.showCreditCardSubmissionError();
        }
    }

    private _scrollToTop() {
        this._document.body.scrollTop = 0;
    }

    onPaymentInfoCollected({ paymentInfo }: PaymentInfoBasicData) {
        this._submitPurchasePaymentInformationForMrdWorkflowService
            .build({ paymentInfo })
            .pipe(
                concatMap(() => this._loadPurchaseReviewDataForMrdWorkflowService.build({ loadFallback: false })),
                catchError((error: SubmitPurchasePaymentInformationForMrdWorkflowError) => {
                    if (error === 'NOT_ELIGIBLE_FOR_OFFER') {
                        this.displayIneligibleLoader$.next(true);
                        this._scrollToTop();
                        return forkJoin([timer(5000), this._loadPurchaseReviewDataForMrdWorkflowService.build({ loadFallback: true })]).pipe(mapTo(true));
                    }
                    return throwError(error);
                })
            )
            .subscribe({
                next: () => {
                    this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' }).then(() => {
                        this.displayIneligibleLoader$.next(false);
                        this._paymentInfoBasicFormComponentApi?.setProcessingCompleted();
                    });
                },
                error: () => {
                    // TODO: show system error message
                    this.displayIneligibleLoader$.next(false);
                    this._paymentInfoBasicFormComponentApi?.setProcessingCompleted();
                },
            });
    }

    onLoadingWithAlertMessageComplete($event: boolean) {
        if ($event) {
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Animation:notEligibleToPurchasePlan' }));
        }
    }
}
