import { CommonModule, DOCUMENT, Location } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import {
    organicpaymentSetupPageViewModel,
    SubmitPurchasePaymentInformationWorkflowError,
    SubmitPurchasePaymentInformationWorkflowService,
} from '@de-care/de-care-use-cases/checkout/state-streaming-roll-to-drop';
import {
    AccountInfoAndPaymentInfoFormComponent,
    AccountInfoAndPaymentInfoFormComponentApi,
    AccountInfoBasicAndPaymentInfoFormComponent,
    AccountInfoBasicAndPaymentInfoFormComponentApi,
    DeCareUseCasesCheckoutUiCommonModule,
} from '@de-care/de-care-use-cases/checkout/ui-common';
import { ProvinceSelection, PROVINCE_SELECTION } from '@de-care/de-care/shared/ui-province-selection';
import { AddedGiftCardData, DomainsPaymentUiPrepaidRedeemModule } from '@de-care/domains/payment/ui-prepaid-redeem';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';
import { SharedSxmUiUiCreditCardFormFieldsModule } from '@de-care/shared/sxm-ui/ui-credit-card-form-fields';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { ReactiveComponentModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../page-step-route-configuration';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-step-organic-setup-payment-page',
    templateUrl: './step-organic-setup-payment-page.component.html',
    styleUrls: ['./step-organic-setup-payment-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveComponentModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        SharedSxmUiUiStepperModule,
        DeCareSharedUiPageLayoutModule,
        DeCareUseCasesCheckoutUiCommonModule,
        SharedSxmUiUiAlertPillModule,
        SharedSxmUiUiCreditCardFormFieldsModule,
        DomainsPaymentUiPrepaidRedeemModule,
        SharedSxmUiUiPrivacyPolicyModule,
        DomainsPaymentUiPrepaidRedeemModule,
    ],
})
export class StepOrganicSetupPaymentPageComponent implements ComponentWithLocale, OnInit, AfterViewInit, OnDestroy {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    organicPaymentViewModel$ = this._store.select(organicpaymentSetupPageViewModel);
    @ViewChild(AccountInfoAndPaymentInfoFormComponent) private readonly _accountInfoAndPaymentInfoFormComponent: AccountInfoAndPaymentInfoFormComponentApi;
    @ViewChild(AccountInfoBasicAndPaymentInfoFormComponent) private readonly _accountInfoBasicAndPaymentInfoFormComponent: AccountInfoBasicAndPaymentInfoFormComponentApi;
    private _routerNavigationSubscription: Subscription;
    creditcardForm: FormGroup;
    initialState: {
        creditCard: { nameOnCard: string; cardNumber: string; expirationDate: string };
    } | null = null;
    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _store: Store,
        // paymentFormProcessing$ = new BehaviorSubject(false),

        private readonly _submitPurchasePaymentInformationWorkflowService: SubmitPurchasePaymentInformationWorkflowService,
        @Inject(DOCUMENT) private readonly _document: Document,
        private readonly _location: Location,
        private _form: FormBuilder,
        @Inject(PROVINCE_SELECTION) private readonly _provinceSelection: ProvinceSelection
    ) {
        translationsForComponentService.init(this);
    }

    ngOnDestroy(): void {
        this._routerNavigationSubscription?.unsubscribe();
    }

    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
        this.creditcardForm = this._form.group({
            creditCardInfo: new FormGroup({}),
            giftCard: new FormControl(null),
        });
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'paymentinfo' }));
        if ((this._location?.getState() as any)?.ccError) {
            this._accountInfoAndPaymentInfoFormComponent?.showCreditCardSubmissionError();
            this._accountInfoBasicAndPaymentInfoFormComponent?.showCreditCardSubmissionError();
        }
        if ((this._location?.getState() as any)?.systemError) {
            this._accountInfoAndPaymentInfoFormComponent?.showUnexpectedSubmissionError();
            this._accountInfoBasicAndPaymentInfoFormComponent?.showUnexpectedSubmissionError();
        }
    }

    onLoadingWithAlertMessageComplete($event: boolean) {
        if ($event) {
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Animation:notEligibleToPurchasePlan' }));
        }
    }

    onPrepaidCardSubmitted(data: AddedGiftCardData) {
        this.creditcardForm?.get('giftCard').patchValue(data.pin, { emitEvent: false });
    }

    onPrepaidCardCleared() {
        this.creditcardForm?.get('giftCard').patchValue(null, { emitEvent: false });
    }

    onPaymentInfoCollected() {
        this.creditcardForm.markAllAsTouched();
        if (this.creditcardForm.invalid) {
            return true;
        }
        const paymentInfo = this.creditcardForm?.controls.creditCardInfo?.value;
        if (paymentInfo?.country?.toUpperCase() === 'CA') {
            //TODO:- Add selector for skipping offer if province change
            // this._store.dispatch(skipUpdateOfferOnProvinceChange());
            this._provinceSelection?.setSelectedProvince(paymentInfo?.state);
            this._provinceSelection?.setProvinceCanBeChanged(false);
        }
        this._submitPurchasePaymentInformationWorkflowService
            .build({ paymentInfo })
            .pipe(
                catchError((error: SubmitPurchasePaymentInformationWorkflowError) => {
                    this._document.body.scrollTop = 0;
                    return throwError(error);
                })
            )
            .subscribe({
                next: () => {
                    this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { queryParamsHandling: 'preserve', relativeTo: this._activatedRoute });
                    this._accountInfoAndPaymentInfoFormComponent?.setProcessingCompleted();
                    this._accountInfoBasicAndPaymentInfoFormComponent?.setProcessingCompleted();
                },
                error: (error) => {
                    if (error === 'CREDIT_CARD_FAILURE') {
                        this._accountInfoAndPaymentInfoFormComponent?.showCreditCardSubmissionError();
                        this._accountInfoBasicAndPaymentInfoFormComponent?.showCreditCardSubmissionError();
                    } else {
                        // TODO: show system error message
                        this._accountInfoAndPaymentInfoFormComponent?.setProcessingCompleted();
                        this._accountInfoBasicAndPaymentInfoFormComponent?.setProcessingCompleted();
                    }
                },
            });
    }
}
