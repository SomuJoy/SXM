import { Component, ChangeDetectionStrategy, ViewChild, Inject, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Router } from '@angular/router';
import {
    getBillingSectionVM,
    LoadBillingHistoryRecordsWorkflowService,
    LoadPaymentHistoryRecordsWorkflowService,
    getAllAvailableYears,
    getAllAvailableDevices,
    UpdateEbillEnrollmentBillingWorkflowService,
} from '@de-care/de-care-use-cases/account/state-my-account-billing';
import { OAC_BASE_URL } from '@de-care/shared/configuration-tokens-oac';
import { SharedSxmUiBillingEbillSignUpComponent } from '@de-care/shared/sxm-ui/billing/ui-billing';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { ToastNotificationService } from '@de-care/shared/sxm-ui/ui-toast-notification';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { map, takeUntil, tap } from 'rxjs/operators';
import { setBillingActivityFilter } from '@de-care/de-care-use-cases/account/state-my-account';
import { combineLatest, Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
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
    selector: 'my-account-billing-page',
    templateUrl: './billing-page.component.html',
    styleUrls: ['./billing-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingPageComponent implements ComponentWithLocale, OnInit, AfterViewInit, OnDestroy {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    form: FormGroup;
    activeTable: 'BILLING' | 'PAYMENT' = 'BILLING';
    signUpEBillServerError = false;
    billingEbillSignUpLoading = false;
    filterState = { showFilters: true, overflowHidden: false, visibilityHidden: false };
    private readonly _window: Window;
    allOptions$ = null;
    billingPageModalAriaDescribedbyTextId = uuid();

    eBillDropdownOptions$;
    billingVM$ = this._store.pipe(select(getBillingSectionVM));
    private readonly _destroy$: Subject<boolean> = new Subject<boolean>();

    @ViewChild('BillingEbillSignUpModal') private readonly BillingEbillSignUpModal: SxmUiModalComponent;
    @ViewChild('BillingEbillSignUp') private _billingEbillSignUpComponent: SharedSxmUiBillingEbillSignUpComponent;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _formBuilder: FormBuilder,
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _translateService: TranslateService,
        private readonly _toastNotificationService: ToastNotificationService,
        private readonly _updateEbillEnrollmentBillingWorkflowService: UpdateEbillEnrollmentBillingWorkflowService,
        @Inject(OAC_BASE_URL) private readonly _oacBaseUrl: string,
        private readonly _loadBillingHistoryRecordsWorkflowService: LoadBillingHistoryRecordsWorkflowService,
        private readonly _loadPaymentHistoryRecordsWorkflowService: LoadPaymentHistoryRecordsWorkflowService,
        @Inject(DOCUMENT) private readonly _document: Document
    ) {
		translationsForComponentService.init(this);
        this._window = this._document && this._document.defaultView;
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
        this.form = this._formBuilder.group({
            date: '',
            device: '',
        });
    }

    onEditPaymentMethod($event: UpdatePaymentModel) {
        this._router.navigate(['/account/pay/make-payment'], { queryParams: { accountNumber: $event.accountNo, updatePayment: true } });
    }

    onEditBillingAddress() {
        this._router.navigate(['/account/manage/account-info/account-information/edit-billing-address']);
    }

    onSignUpEBill() {
        this.BillingEbillSignUpModal.open();
    }

    onMakePayment() {
        this._router.navigate(['account/pay/make-payment']);
    }

    onRedeemPrepaidOrGiftCard() {
		const redirectUrl = this._oacBaseUrl + this._translateService.instant(`${this.translateKeyPrefix}.BILLING_REDEEM_PREPAID_GIFTCARD_LINK`);
        this._window && (this._window.location.href = redirectUrl);
    }

    closeEbillSignupModal() {
        this.billingEbillSignUpLoading = false;
        this._billingEbillSignUpComponent.clearForm();
        this.BillingEbillSignUpModal.close();
    }

    onSignUpEmailId(email: string) {
        this.signUpEBillServerError = false;
        this.billingEbillSignUpLoading = true;
        const request = {
            email: email,
            ebillEnrollment: true,
        };
        this._updateEbillEnrollmentBillingWorkflowService.build(request).subscribe(
            () => {
                this._toastNotificationService.showNotification(this.translationsForComponentService.instant(`${this.translateKeyPrefix}.EBILL_SIGN_UP_SUCCESS_MESAGE`));
                this.billingEbillSignUpLoading = false;
                this.closeEbillSignupModal();
            },
            (error: any) => {
                this.billingEbillSignUpLoading = false;
                this.signUpEBillServerError = true;
            }
        );
    }

    filterToggle() {
        this.filterState.showFilters = !this.filterState.showFilters;
        this.filterState.overflowHidden = true; // overflow: hidden during animation transition and when the filters are hidden, needs to be visible when filters are fully shown (animation is not in progress)
        this.filterState.visibilityHidden = false; //visibility: hidden needs to be true only when the filters are completely hidden (animation is not in progress)
    }

    filterTransitionEnd(evt: TransitionEvent) {
        if (evt.propertyName === 'grid-template-rows') {
            this.filterState.overflowHidden = false;
            this.filterState.visibilityHidden = !this.filterState.showFilters;
        }
    }

    ngOnInit(): void {
        this.form.valueChanges.pipe(takeUntil(this._destroy$)).subscribe((changes) => {
            this._store.dispatch(setBillingActivityFilter({ ...changes }));
        });
        this.allOptions$ = combineLatest([
            this._store.pipe(select(getAllAvailableYears)),
            this._store.pipe(select(getAllAvailableDevices)),
            this._translateService.stream(`${this.translateKeyPrefix}.FILTER_DROPDOWN_OPTIONS`),
        ]).pipe(
            map(([allAvailableYears, allAvailableDevices, copies]) => {
                const allYears = [
                    { label: this._translateService.instant(`${this.translateKeyPrefix}.FILTER_DROPDOWN_OPTIONS.ALL_LABEL`), key: 'ALL' },
                    { label: this._translateService.instant(`${this.translateKeyPrefix}.FILTER_DROPDOWN_OPTIONS.LAST_6MONTHS`), key: '6MONTHS' },
                    ...allAvailableYears.map((year) => ({ label: year.toString(), key: year.toString() })),
                ];
                const allDevices = [
                    { label: this._translateService.instant(`${this.translateKeyPrefix}.FILTER_DROPDOWN_OPTIONS.ALL_LABEL`), key: 'ALL' },
                    ...allAvailableDevices.map((device) => ({ label: device, key: device })),
                ];
                return { allYears, allDevices };
            })
        );
    }

    ngAfterViewInit(): void {
        this._loadBillingHistoryRecordsWorkflowService
            .build()
            .pipe(
                tap(() => {
                    // setting default value for filters
                    this.form.setValue({ date: 'ALL', device: 'ALL' }, { emitEvent: true });
                })
            )
            .subscribe();

        this._loadPaymentHistoryRecordsWorkflowService.build().subscribe();
    }
    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }
}
