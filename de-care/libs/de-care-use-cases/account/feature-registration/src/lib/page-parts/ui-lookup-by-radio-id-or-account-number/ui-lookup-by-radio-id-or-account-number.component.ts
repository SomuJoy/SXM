import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {
    clearLookupErrors,
    getIncludeChatWithAnAgentLink,
    getLookupFormData,
    getVerificationOptionsAvailableAndTwoFactorAuthData,
    lookupIsLoading,
    submitLookupAccountByRadioIdOrAccountNumber,
    twoFactorAuthCompleted
} from '@de-care/de-care-use-cases/account/state-registration';
import { TwoFactorAuthModalComponent, TwoFactorAuthModalComponentApi } from '@de-care/domains/account/ui-two-factor-auth';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { LookupByRadioIdOrAccountNumberForm } from './lookup-by-radio-id-or-account-number-form';

@Component({
    selector: 'ui-lookup-by-radio-id-or-account-number',
    templateUrl: './ui-lookup-by-radio-id-or-account-number.component.html',
    styleUrls: ['./ui-lookup-by-radio-id-or-account-number.component.scss']
})
export class UiLookupByRadioIdOrAccountNumberComponent implements OnInit, OnDestroy {
    @ViewChild(TwoFactorAuthModalComponent) twoFactorAuthModal: TwoFactorAuthModalComponentApi;
    form: LookupByRadioIdOrAccountNumberForm;
    translateKeyPrefix = 'deCareUseCasesAccountFeatureRegistration.UiLookupByRadioIdOrAccountNumberComponent';
    includeChatWithAnAgentLink$ = this._store.select(getIncludeChatWithAnAgentLink);
    lookupIsLoading$ = this._store.select(lookupIsLoading);
    openHelpFindRadioIdModal = false;
    verifyOptionsHaveChanged = false;
    private readonly _unsubscribe$: Subject<void> = new Subject();
    private _previousVerificationSelection: string;
    @Output() opened = new EventEmitter();

    constructor(private readonly _store: Store) {}

    ngOnInit(): void {
        this._store.pipe(select(getLookupFormData), take(1)).subscribe(({ language, country }) => (this.form = new LookupByRadioIdOrAccountNumberForm(language, country)));
        this._store
            .pipe(
                select(getVerificationOptionsAvailableAndTwoFactorAuthData),
                filter(response => response.verificationOptionsAvailable),
                takeUntil(this._unsubscribe$)
            )
            .subscribe({
                next: response => {
                    this.twoFactorAuthModal && this.twoFactorAuthModal.start(response.twoFactorAuthData);
                }
            });
        this._listenForVerificationSelectionChange();
    }

    ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
        this.form.unsubscribe$.next();
        this.form.unsubscribe$.complete();
    }

    openUiLookupModals(): void {
        this.openHelpFindRadioIdModal = true;
        this.opened.emit(true);
    }

    handleLookupSubmission(): void {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            this._store.dispatch(
                submitLookupAccountByRadioIdOrAccountNumber({
                    radioId: this.form.verifyType.value === 'radioId' ? this.form.identifier.value : null,
                    accountNumber: this.form.verifyType.value === 'accountNumber' ? this.form.identifier.value : null
                })
            );
            !this.verifyOptionsHaveChanged && this.twoFactorAuthModal.reopen();
        }
    }

    verifyCompleted(): void {
        this._store.dispatch(twoFactorAuthCompleted());
    }

    private _listenForVerificationSelectionChange() {
        this.form?.controls?.verifyType?.valueChanges?.pipe(takeUntil(this._unsubscribe$)).subscribe(value => {
            if (value !== this._previousVerificationSelection) {
                this._store.dispatch(clearLookupErrors());
                this.verifyOptionsHaveChanged = true;
            }
            this._previousVerificationSelection = value;
        });
    }

    verifyOptionsClosedIncomplete() {
        this.verifyOptionsHaveChanged = false;
    }
}
