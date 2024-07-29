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
    PaymentInfoWithFullAddressAndPhoneComponent,
    PaymentInfoWithPhoneNumberAndZipComponent,
} from '@de-care/de-care-use-cases/checkout/ui-common';
import {
    LoadPurchaseReviewDataForTargetedWorkflowService,
    clearPaymentInfoCvv,
    getTargetedPaymentViewModel,
    SubmitPurchasePaymentInformationForTargetedWorkflowService,
    skipUpdateOfferOnProvinceChange,
    SubmitPurchasePaymentInformationForTargetedWorkflowError,
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
import { ProvinceSelection, PROVINCE_SELECTION } from '@de-care/de-care/shared/ui-province-selection';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-targeted-payment-page',
    templateUrl: './step-targeted-payment-page.component.html',
    styleUrls: ['./step-targeted-payment-page.component.scss'],
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
        PaymentInfoWithPhoneNumberAndZipComponent,
        PaymentInfoWithFullAddressAndPhoneComponent,
    ],
})
export class StepTargetedPaymentPageComponent implements ComponentWithLocale, OnInit, AfterViewInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    @ViewChild(PaymentInfoBasicFormComponent) private readonly _paymentInfoBasicFormComponentApi: PaymentInfoBasicFormComponentApi;
    displayIneligibleLoader$ = new BehaviorSubject(false);
    targetedPaymentViewModel$ = this._store.select(getTargetedPaymentViewModel);
    constructor(
        public readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _location: Location,
        private readonly _submitPurchasePaymentInformationForTargetedWorkflowService: SubmitPurchasePaymentInformationForTargetedWorkflowService,
        private readonly _loadPurchaseReviewDataForTargetedWorkflowService: LoadPurchaseReviewDataForTargetedWorkflowService,
        @Inject(DOCUMENT) private readonly _document: Document,
        @Inject(COUNTRY_SETTINGS) public readonly countrySettings: CountrySettingsToken,
        @Inject(PROVINCE_SELECTION) private readonly _provinceSelection: ProvinceSelection
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
        if (paymentInfo?.country?.toUpperCase() === 'CA') {
            this._store.dispatch(skipUpdateOfferOnProvinceChange());
            this._provinceSelection?.setSelectedProvince(paymentInfo?.state);
        }
        this._submitPurchasePaymentInformationForTargetedWorkflowService
            .build({ paymentInfo })
            .pipe(
                concatMap(() => this._loadPurchaseReviewDataForTargetedWorkflowService.build({ loadFallback: false })),
                catchError((error: SubmitPurchasePaymentInformationForTargetedWorkflowError) => {
                    if (error === 'NOT_ELIGIBLE_FOR_OFFER') {
                        this.displayIneligibleLoader$.next(true);
                        this._scrollToTop();
                        return forkJoin([timer(5000), this._loadPurchaseReviewDataForTargetedWorkflowService.build({ loadFallback: true })]).pipe(mapTo(true));
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
