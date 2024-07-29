import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { getAccountInformationVM, UpdateEbillEnrollmentAccountInfoWorkflowService } from '@de-care/de-care-use-cases/account/state-my-account-account-info';
import { MyAccountInnerStripComponentModule } from '@de-care/de-care-use-cases/account/ui-my-account';
import { OAC_BASE_URL } from '@de-care/shared/configuration-tokens-oac';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import {
    SharedSxmUiUiAccountLoginActionModule,
    SharedSxmUiBillingAddressActionComponentModule,
    SharedSxmUiContactInfoActionComponentModule,
    SharedSxmUiEBillActionsComponentModule,
    SharedSxmUiEBillSignupSingleActionComponentModule,
    SharedSxmUiPaymentMethodActionComponentModule,
} from '@de-care/shared/sxm-ui/account/ui-account-information';
import { SharedSxmUiBillingEbillSignUpComponent, SharedSxmUiBillingEbillSignUpComponentModule } from '@de-care/shared/sxm-ui/billing/ui-billing';
import { SharedSxmUiUiModalModule, SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiMyAccountCardModule } from '@de-care/shared/sxm-ui/ui-my-account-card';
import { ToastNotificationService } from '@de-care/shared/sxm-ui/ui-toast-notification';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { ReactiveComponentModule } from '@ngrx/component';
import { select, Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as uuid from 'uuid/v4';

interface UpdatePaymentModel {
    accountNo?: string;
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'my-account-account-information-page',
    templateUrl: './account-information-page.component.html',
    styleUrls: ['./account-information-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        SharedSxmUiUiMyAccountCardModule,
        SharedSxmUiUiAccountLoginActionModule,
        SharedSxmUiBillingAddressActionComponentModule,
        SharedSxmUiContactInfoActionComponentModule,
        SharedSxmUiEBillActionsComponentModule,
        SharedSxmUiEBillSignupSingleActionComponentModule,
        SharedSxmUiPaymentMethodActionComponentModule,
        MyAccountInnerStripComponentModule,
        ReactiveComponentModule,
        RouterModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiBillingEbillSignUpComponentModule,
    ],
})
export class AccountInformationPageComponent implements ComponentWithLocale, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    accountInformationVM$ = this._store.pipe(select(getAccountInformationVM));
    private readonly _window: Window;
    @ViewChild('BillingEbillSignUpModal') private readonly BillingEbillSignUpModal: SxmUiModalComponent;
    @ViewChild('BillingEbillSignUp') private _billingEbillSignUpComponent: SharedSxmUiBillingEbillSignUpComponent;
    signUpEBillServerError = false;
    eBillDropdownOptions$;
    billingEbillSignUpLoading$ = new BehaviorSubject(false);
    accountInformationModalAriaDescribedbyTextId = uuid();

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _translateService: TranslateService,
        private readonly _toastNotificationService: ToastNotificationService,
        private readonly _updateEbillEnrollmentAccountInfoWorkflowService: UpdateEbillEnrollmentAccountInfoWorkflowService,
        @Inject(OAC_BASE_URL) private readonly _oacBaseUrl: string
    ) {
        translationsForComponentService.init(this);
        this._window = document.defaultView;
        this.eBillDropdownOptions$ = this._translateService.stream(`${this.translateKeyPrefix}.EBILL_DROPDOWN_OPTIONS`).pipe(
            map((copies) => {
                const tempCopies = JSON.parse(JSON.stringify(copies));
                let dropdownOptions = [];
                for (const [key, value] of Object.entries(tempCopies)) {
                    const modalId = value['modalId'] ? this._translateService.instant(`${this.translateKeyPrefix}.EBILL_DROPDOWN_OPTIONS.${key}.modalId`) : null;
                    if (modalId) {
                        value['routerLinkObject'] = [{ outlets: { modal: [modalId] } }];
                    }
                    dropdownOptions = [...dropdownOptions, value];
                }
                return dropdownOptions;
            })
        );
    }
    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'accountinfo' }));
    }

    onEditContactInfo() {
        this._router.navigate(['/account/manage/account-info/account-information/edit-contact-info']);
    }

    onEditPaymentMethod($event: UpdatePaymentModel) {
        this._router.navigate(['/account/pay/make-payment'], { queryParams: { accountNumber: $event.accountNo, updatePayment: true } });
    }

    onEditBillingAddress() {
        this._router.navigate(['/account/manage/account-info/account-information/edit-billing-address']);
    }

    onEditAccountLogin() {
        this._router.navigate(['/account/manage/account-info/account-information/edit-account-login']);
    }

    onSignUpEBill() {
        this.BillingEbillSignUpModal.open();
    }

    openEbillSignupModal() {
        this.BillingEbillSignUpModal.open();
    }

    closeEbillSignupModal() {
        this.billingEbillSignUpLoading$.next(false);
        this._billingEbillSignUpComponent.clearForm();
        this.BillingEbillSignUpModal.close();
    }

    onSignUpEmailId(email: string) {
        this.signUpEBillServerError = false;
        this.billingEbillSignUpLoading$.next(true);
        const request = {
            email: email,
            ebillEnrollment: true,
        };
        this._updateEbillEnrollmentAccountInfoWorkflowService.build(request).subscribe(
            () => {
                this._toastNotificationService.showNotification(this.translationsForComponentService.instant(`${this.translateKeyPrefix}.EBILL_SIGN_UP_SUCCESS_MESAGE`));
                this.billingEbillSignUpLoading$.next(false);
                this.closeEbillSignupModal();
            },
            (error: any) => {
                this.billingEbillSignUpLoading$.next(false);
                this.signUpEBillServerError = true;
            }
        );
    }
}
