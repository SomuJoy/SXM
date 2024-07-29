import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
    fetchVerificationOptions,
    getCustomerAccounts,
    getVerificationOptionsAvailableAndTwoFactorAuthData,
    getVerificationStatus,
    hasMultilpleAccounts,
    selectIsStepUpFlowWithLast4OfAccountNumber,
    fetchVerificationOptionsForOneAccountFound,
    twoFactorAuthCompleted,
    setAccountNotFoundLinkClick,
    resetAccountNotFoundLinkClick,
    getLast4DgititsSelectedRadioId,
    selectIsNotInStepUpFlow,
    uiLookupModalClosed,
} from '@de-care/de-care-use-cases/account/state-registration';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { TwoFactorAuthData, TwoFactorAuthModalComponent, TwoFactorAuthModalComponentApi } from '@de-care/domains/account/ui-two-factor-auth';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';
import { behaviorEventImpressionForPage, behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { clearVerificationStatus } from '@de-care/domains/account/state-two-factor-auth';
import { TranslationsForComponentService } from '@de-care/shared/translation';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'de-care-select-account-and-verify',
    templateUrl: './select-account-and-verify.component.html',
    styleUrls: ['./select-account-and-verify.component.scss'],
})
export class SelectAccountAndVerifyComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(TwoFactorAuthModalComponent) twoFactorAuthModal: TwoFactorAuthModalComponentApi;

    private readonly _destroyed$ = new Subject<void>();

    loading$ = this._store.pipe(select(getVerificationStatus));
    accountDataInfo$ = this._store.pipe(select(getCustomerAccounts));
    hasMultipleAccounts$ = this._store.pipe(select(hasMultilpleAccounts));
    last4DigitsSelectedRadioId$ = this._store.pipe(select(getLast4DgititsSelectedRadioId));
    notInStepUp$ = this._store.select(selectIsNotInStepUpFlow);
    accountNotFoundLink = false;
    selectAccVerifyModalAriaDescribedbyTextId = uuid();

    verifyInfo: TwoFactorAuthData;
    translateKeyPrefix = 'deCareUseCasesAccountFeatureRegistration.selectAccountAndVerifyComponent';
    openModal = false;

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private readonly _store: Store) {}

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    ngOnInit(): void {
        this._store
            .pipe(
                select(getVerificationOptionsAvailableAndTwoFactorAuthData),
                filter((response) => response.verificationOptionsAvailable),
                takeUntil(this._destroyed$)
            )
            .subscribe({
                next: (response) => {
                    this.twoFactorAuthModal?.start(response.twoFactorAuthData);
                },
            });
    }

    open(): void {
        this.openModal = true;
        this.accountNotFoundLink = false;
    }

    close(): void {
        this.openModal = false;
        this._store.dispatch(resetAccountNotFoundLinkClick());
    }

    ngAfterViewInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'registration', componentKey: 'accountsfound' }));
        this._stepUpVerification();
    }

    onVerifyClicked(last4AccountNumber?: string): void {
        this._store.dispatch(fetchVerificationOptions({ last4DigitsOfAccountNumber: last4AccountNumber }));
    }

    verifySingleAccount(accounts: { accountLast4Digits: string }[]): void {
        if (accounts?.length === 0) {
            this._store.dispatch(clearVerificationStatus());
            this._stepUpVerification();
        }

        if (accounts?.[0]) {
            this._store.dispatch(fetchVerificationOptionsForOneAccountFound({ last4DigitsOfAccountNumber: accounts[0].accountLast4Digits }));
        }
    }

    onVerifyCompleted() {
        this._store.dispatch(twoFactorAuthCompleted());
    }

    onClickAccountNotFound() {
        this.accountNotFoundLink = true;
        this._store.dispatch(setAccountNotFoundLinkClick());
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'overlay:lookup' }));
    }

    onClickAccountNotFoundModalClosed() {
        this.accountNotFoundLink = false;
        this._store.dispatch(uiLookupModalClosed());
        this._store.dispatch(resetAccountNotFoundLinkClick());
    }

    private _stepUpVerification() {
        this._store
            .pipe(
                select(selectIsStepUpFlowWithLast4OfAccountNumber),
                filter(({ isInStepUpFlow, twoFactorAuthData }) => isInStepUpFlow && !!twoFactorAuthData?.verifyOptionsInfo),
                delay(1),
                take(1)
            )
            .subscribe(({ twoFactorAuthData }) => this.twoFactorAuthModal.start(twoFactorAuthData));
    }
}
