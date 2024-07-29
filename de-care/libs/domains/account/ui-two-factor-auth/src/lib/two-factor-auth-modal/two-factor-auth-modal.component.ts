import { Component, EventEmitter, Output, ViewChild, OnDestroy, OnInit, Input } from '@angular/core';
import { VerifyOptions, VerifyOptionsFormComponentApi, VerifyTypeSelection } from '../verify-options-form/verify-options-form.component';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { SecurityCodeVerificationFormComponentApi } from '../security-code-verification-form/security-code-verification-form.component';
import {
    getVerifyTypeSelection,
    resetVerificationSession,
    setVerifyTypeSelection,
    SubmitVerifyCodeWorkflow,
    getAccountVerificationStatus,
    getAccountIsInvalid,
    SubmitVerifyAccountWorkflow,
    AccountVerificationStatusEnum,
    VerifyCodeStatus,
    SubmitVerifyRadioIdWorkflow,
    RadioIdVerificationStatusEnum,
    AccountVerificationRequest,
    requestPhoneVerification,
    getPhoneVerificationRequestComplete,
    getIncludeChatWithAnAgentLink,
    getPhoneVerificationRequestCodeFailure,
    getPhoneVerificationRequestCodeLimitExceeded,
    getPhoneVerificationRequestCodeSuccessful,
    setResendPhoneCodeRequested,
    resetResendPhoneCodeRequested,
    getResendHasBeenRequested,
} from '@de-care/domains/account/state-two-factor-auth';
import { select, Store } from '@ngrx/store';
import { catchError, map, take, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { getLanguage } from '@de-care/domains/customer/state-locale';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import * as uuid from 'uuid/v4';

export interface TwoFactorAuthData {
    verifyOptionsInfo: VerifyOptions;
    last4DigitsRadioId?: string;
}

export interface TwoFactorAuthModalComponentApi {
    start(data: TwoFactorAuthData): void;
    reopen?(): void;
}

@Component({
    selector: 'two-factor-auth-modal',
    templateUrl: './two-factor-auth-modal.component.html',
    styleUrls: ['./two-factor-auth-modal.component.scss'],
})
export class TwoFactorAuthModalComponent implements TwoFactorAuthModalComponentApi, OnInit, OnDestroy {
    @Input() localeToInclude: string;
    @Output() verifyCompleted = new EventEmitter();
    @Output() verifyOptionsModalClosed = new EventEmitter();
    @ViewChild('verifyOptionsModal') verifyOptionsModal: SxmUiModalComponent;
    @ViewChild('securityCodeModal') securityCodeModal: SxmUiModalComponent;
    @ViewChild('verifyOptionsForm') verifyOptionsForm: VerifyOptionsFormComponentApi;
    @ViewChild('securityCodeForm') securityCodeForm: SecurityCodeVerificationFormComponentApi;
    @ViewChild('helpFindingRadioModal') helpFindingRadioModal: SxmUiModalComponent;
    @ViewChild('deviceHelpModal') deviceHelpModal: SxmUiModalComponent;
    translateKeyPrefix = 'domainsAccountUiTwoFactorAuth.twoFactorAuthModalComponent';
    deviceHelpModalAriaDescribedbyTextId = uuid();

    data: TwoFactorAuthData;
    securityCodeErrorMsg: string = '';
    showResendLink = true;
    resendClickCount = 0;
    radioIDInvalid = false;

    private _verifyType$ = this._store.pipe(
        select(getVerifyTypeSelection),
        map(({ verifyType }) => verifyType)
    );
    resendCodeLinkTextTranslateKey$ = this._verifyType$.pipe(
        map((verifyType) => {
            if (verifyType === 'email') {
                return `${this.translateKeyPrefix}.RESEND_CODE_LINK_TEXT.EMAIL`;
            } else if (verifyType === 'text') {
                return `${this.translateKeyPrefix}.RESEND_CODE_LINK_TEXT.PHONE`;
            } else {
                return null;
            }
        })
    );
    deliverySource$ = this._verifyType$.pipe(
        map((verifyType) => {
            switch (verifyType) {
                case 'email':
                    return this.data?.verifyOptionsInfo?.maskedEmail;
                case 'text':
                    return this.data?.verifyOptionsInfo?.maskedPhoneNumber;
                default:
                    return null;
            }
        })
    );
    processingCodeVerification$ = new BehaviorSubject(false);
    accountVerificationStatus$ = this._store.pipe(select(getAccountVerificationStatus));
    accountIsInvalid$ = this._store.pipe(select(getAccountIsInvalid));
    isCanadaMode$ = this._store.pipe(select(getIsCanadaMode));
    phoneVerificationRequestComplete$ = this._store.pipe(select(getPhoneVerificationRequestComplete));
    includeChatWithAnAgentLink$ = this._store.pipe(select(getIncludeChatWithAnAgentLink));

    codeRequestSuccessful$ = this._store.pipe(select(getPhoneVerificationRequestCodeSuccessful));
    codeRequestPhoneNotMatching$ = this._store.pipe(select(getPhoneVerificationRequestCodeFailure));
    codeRequestLimitExceeded$ = this._store.pipe(select(getPhoneVerificationRequestCodeLimitExceeded));
    codeRequestHasBeenResent$ = this._store.pipe(select(getResendHasBeenRequested));

    private _phoneNumber: string = null;
    private _unsubscribe$: Subject<void> = new Subject();

    constructor(
        private readonly _store: Store,
        private readonly _submitVerifyCodeWorkflow: SubmitVerifyCodeWorkflow,
        private readonly _submitVerifyAccountWorkFlow: SubmitVerifyAccountWorkflow,
        private readonly _submitverifyRadioIdWorkflow: SubmitVerifyRadioIdWorkflow
    ) {}

    ngOnInit() {
        this._listenForLangChange();
    }

    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    start(data: TwoFactorAuthData) {
        this.data = data;
        this._store.dispatch(resetVerificationSession());
        this.verifyOptionsForm?.reset();
        this.securityCodeForm?.reset();
        this.verifyOptionsModal.open();
    }

    reopen() {
        !!this.data && this.verifyOptionsModal.open();
    }

    onVerifyTypeSelected(verifyTypeSelection: VerifyTypeSelection): void {
        this._store.dispatch(setVerifyTypeSelection({ verifyTypeSelection }));
        if (verifyTypeSelection?.verifyType === 'radioId') {
            // TODO: attempt to process verification and if success then this.verifyCompleted.emit()
            this._submitverifyRadioIdWorkflow
                .build(verifyTypeSelection.identifier)
                .pipe(take(1))
                .subscribe((response) => {
                    if (response.status === RadioIdVerificationStatusEnum.valid) {
                        this._closeVerifyOptionsModal();
                        this.verifyCompleted.emit();
                    } else {
                        this.radioIDInvalid = true;
                    }
                });
        } else if (verifyTypeSelection?.verifyType === 'accountNumber') {
            // TODO: attempt to process verification and if success then this.verifyCompleted.emit()
            this._submitVerifyAccountWorkFlow
                .build({ accountNumber: verifyTypeSelection.identifier })
                .pipe(take(1))
                .subscribe((response) => {
                    if (response.status === AccountVerificationStatusEnum.valid) {
                        this._closeVerifyOptionsModal();
                        this.verifyCompleted.emit();
                    }
                });
        } else {
            this._phoneNumber = verifyTypeSelection.identifier;
            this._verifyPhoneNumberMatchesAccount(this._phoneNumber);
        }
    }

    returnToVerifyOptions(): void {
        this._store.dispatch(resetVerificationSession());
        this.securityCodeForm.reset();
        this.securityCodeModal.close();
        this.verifyOptionsModal.open();
    }

    onResendCodeRequest(): void {
        this._store.dispatch(setResendPhoneCodeRequested());
        this._verifyPhoneNumberMatchesAccount(this._phoneNumber);
    }

    onSecurityCodeSubmitted(securityCode: number): void {
        this.processingCodeVerification$.next(true);
        this.securityCodeErrorMsg = null;
        this._store.dispatch(resetResendPhoneCodeRequested());

        this._submitVerifyCodeWorkflow
            .build(securityCode)
            .pipe(take(1))
            .subscribe({
                next: (status) => {
                    switch (status) {
                        case VerifyCodeStatus.success: {
                            this.securityCodeModal.close();
                            this.verifyCompleted.emit();
                            break;
                        }
                        case VerifyCodeStatus.limitExceeded: {
                            this.securityCodeErrorMsg = `${this.translateKeyPrefix}.SECURITY_CODE_ERROR_MESSAGE_LIMIT`;
                            break;
                        }
                        case VerifyCodeStatus.incorrect: {
                            this.securityCodeErrorMsg = `${this.translateKeyPrefix}.SECURITY_CODE_ERROR_MESSAGE_INVALID`;
                            break;
                        }
                        case VerifyCodeStatus.error: {
                            this.securityCodeErrorMsg = `${this.translateKeyPrefix}.SECURITY_CODE_ERROR_MESSAGE_INVALID`;
                            break;
                        }
                    }
                    this.processingCodeVerification$.next(false);
                },
                error: () => {
                    this.processingCodeVerification$.next(false);
                    // [TODO] Send to error page
                },
            });
    }

    private _closeVerifyOptionsModal() {
        this.verifyOptionsForm.reset();
        this.verifyOptionsModal.close();
    }

    openHelpFindRadioModal() {
        this.verifyOptionsModal.close();
        this.helpFindingRadioModal.open();
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'overlay:radioidhelp' }));
    }

    private _verifyPhoneNumberMatchesAccount(phoneNumber: string) {
        if (this.localeToInclude) {
            this.localeToInclude = this.localeToInclude.slice(0, 2);
        }
        this._store.dispatch(requestPhoneVerification({ phoneNumber, locale: this.localeToInclude }));
        this.codeRequestSuccessful$.pipe(takeUntil(this._unsubscribe$)).subscribe((success) => {
            if (success) {
                this._closeVerifyOptionsModal();
                this.securityCodeModal.open();
                this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'overlay:securitycode' }));
            }
        });
    }

    private _listenForLangChange() {
        this._store
            .select(getLanguage)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe(() => (this.radioIDInvalid = false));
    }

    onVerifyOptionsModalClosed() {
        this.verifyOptionsModalClosed.emit();
    }

    onHelpFindingRadioBackButtonClick() {
        this.helpFindingRadioModal.close();
        this.verifyOptionsModal.open();
    }

    onOpenDeviceHelpModalClicked() {
        this.deviceHelpModal.open();
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'overlay:marineaviationhelp' }));
    }
}
