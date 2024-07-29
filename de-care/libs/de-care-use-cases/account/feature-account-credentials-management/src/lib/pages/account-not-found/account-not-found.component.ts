import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { getSxmValidator } from '@de-care/shared/validation';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { behaviorEventErrorFromBusinessLogic, behaviorEventErrorsFromUserInteraction, behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
    getIsRecoverUsernameFlow,
    getSrcQueryParam,
    LoadAccountFromCredentialRecoveryLookupWorkflowService,
} from '@de-care/de-care-use-cases/account/state-account-credentials-management';
import { take } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import * as uuid from 'uuid/v4';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-account-not-found',
    templateUrl: './account-not-found.component.html',
    styleUrls: ['./account-not-found.component.scss'],
})
export class AccountNotFoundComponent implements OnInit, ComponentWithLocale, AfterViewInit {
    @ViewChild('helpFindingRadioModal') private readonly _helpFindingRadioModal: SxmUiModalComponent;
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    form: FormGroup;
    loading$ = new BehaviorSubject<boolean>(false);
    showRadioIdError = false;
    showSystemError = false;
    showAccountError = false;
    private _radioIdControl: AbstractControl;
    private _accountControl: AbstractControl;
    private _translateSubscription: Subscription;
    isRecoveryUserName = false;
    isThirdPartyError = false;
    deviceHelpModalAriaDescribedbyTextId = uuid();

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private _formBuilder: FormBuilder,
        private readonly _store: Store,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _loadAccountFromCredentialRecoveryLookupWorkflowService: LoadAccountFromCredentialRecoveryLookupWorkflowService,
        private _titleService: Title
    ) {
        translationsForComponentService.init(this);
        this._store.select(getIsRecoverUsernameFlow).subscribe((isRecoverUsername) => {
            if (isRecoverUsername) {
                this.isRecoveryUserName = true;
                this._translateSubscription = this.translationsForComponentService.stream(`${this.translateKeyPrefix}.FORGOT_USERNAME_PAGE_TITLE`).subscribe((pageTitle) => {
                    this._titleService.setTitle(pageTitle);
                });
            } else {
                this._translateSubscription = this.translationsForComponentService.stream(`${this.translateKeyPrefix}.FORGOT_PASSWORD_PAGE_TITLE`).subscribe((pageTitle) => {
                    this._titleService.setTitle(pageTitle);
                });
            }
        });
    }
    ngOnInit(): void {
        this.form = this._formBuilder.group({
            lookupType: 'radioId',
            radioId: '',
            accountNumber: '',
        });
        this._radioIdControl = this.form.get('radioId');
        this._accountControl = this.form.get('accountNumber');
    }
    ngAfterViewInit(): void {
        this._dispatchImpressionForComponent();
    }
    openFindradioIdModal() {
        this._helpFindingRadioModal.open();
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'overlay:howdoifindmyradioid' }));
    }

    handleModalClosed() {
        this._dispatchImpressionForComponent();
    }
    private _dispatchImpressionForComponent(): void {
        this._store.select(getIsRecoverUsernameFlow).subscribe((isRecoverUsername) => {
            if (isRecoverUsername) {
                this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'recoverunusernotfoundtryrid' }));
            } else {
                this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'usernotfoundtryrid' }));
            }
        });
    }

    onSubmit() {
        this.showRadioIdError = false;
        this.showSystemError = false;
        this.showAccountError = false;
        this.isThirdPartyError = false;
        this.form.markAllAsTouched();
        const param = {
            radioId: null,
            accountNumber: null,
            source: '',
        };
        if (this.form.value.lookupType === 'radioId') {
            this._radioIdControl.markAsTouched();
            this._accountControl.markAsUntouched();
            this._radioIdControl.setValidators(getSxmValidator('radioId'));
            this._radioIdControl.updateValueAndValidity();
            param.radioId = this.form.value.radioId;
        } else if (this.form.value.lookupType === 'accountNumber') {
            this._radioIdControl.markAsUntouched();
            this._accountControl.markAsTouched();
            this._accountControl.setValidators(getSxmValidator('accountNumber'));
            this._accountControl.updateValueAndValidity();
            param.accountNumber = this.form.value.accountNumber;
        }
        this._store
            .select(getSrcQueryParam)
            .pipe(take(1))
            .subscribe((queryParams) => {
                param.source = queryParams;
            });
        if (this.form.valid) {
            this.loading$.next(true);
            this._loadAccountFromCredentialRecoveryLookupWorkflowService.build(param).subscribe({
                next: (account) => {
                    if (account.length > 0) {
                        let subscriptionLength = 0;
                        account.forEach((element) => {
                            if (element && element.subscriptions) {
                                subscriptionLength += element.subscriptions.length;
                            }
                        });
                        if (subscriptionLength !== 0) {
                            this.isRecoveryUserName ? this._navigateTo('../multiple-page-username') : this._navigateTo('../multiple-page');
                        } else if (param.source === 'oac' || !param.source || param.source === 'sclogin') {
                            this.isRecoveryUserName ? this._navigateTo('../multiple-page-username') : this._navigateTo('../multiple-page');
                        } else {
                            this._store.dispatch(
                                behaviorEventErrorFromBusinessLogic({
                                    message: 'The number entered does not match our records. Please try again.',
                                    errorCode: 'ACCOUNT_OR_USERNAME_NOT_FOUND',
                                })
                            );
                            this.form.value.lookupType === 'radioId' ? (this.showRadioIdError = true) : (this.showAccountError = true);
                        }
                    } else {
                        this._store.dispatch(
                            behaviorEventErrorFromBusinessLogic({
                                message: 'The number entered does not match our records. Please try again.',
                                errorCode: 'ACCOUNT_OR_USERNAME_NOT_FOUND',
                            })
                        );
                        this.form.value.lookupType === 'radioId' ? (this.showRadioIdError = true) : (this.showAccountError = true);
                    }
                    this.loading$.next(false);
                },
                error: (error) => {
                    if (error?.error?.error?.errorType === 'SYSTEM') {
                        if (error?.error?.error?.errorCode === 'ACCOUNT_OR_USERNAME_NOT_FOUND') {
                            this._store.dispatch(
                                behaviorEventErrorFromBusinessLogic({
                                    message: 'The number entered does not match our records. Please try again.',
                                    errorCode: error?.error?.error?.errorCode,
                                })
                            );
                            this.form.value.lookupType === 'radioId' ? (this.showRadioIdError = true) : (this.showAccountError = true);
                        } else {
                            this.showSystemError = true;
                        }
                    } else if (error?.error?.error?.errorType === 'BUSINESS') {
                        if (error?.error?.error?.errorCode === 'CUSTOMER_TYPE_NOT_SUPPORTED') {
                            this.isThirdPartyError = true;
                        } else {
                            this.form.value.lookupType === 'radioId' ? (this.showRadioIdError = true) : (this.showAccountError = true);
                        } this._store.dispatch(
                            behaviorEventErrorFromBusinessLogic({
                                message: 'The number entered does not match our records. Please try again.',
                                errorCode: 'ACCOUNT_OR_USERNAME_NOT_FOUND',
                            })
                        );
                    } else if (error?.error?.error?.fieldErrors[0]?.errorCode === 'ACCOUNT_NOT_FOUND') {
                        this._store.dispatch(
                            behaviorEventErrorFromBusinessLogic({
                                message: 'The number entered does not match our records. Please try again.',
                                errorCode: 'ACCOUNT_OR_USERNAME_NOT_FOUND',
                            })
                        );
                        this.form.value.lookupType === 'radioId' ? (this.showRadioIdError = true) : (this.showAccountError = true);
                    } else {
                        this.showSystemError = true;
                    }
                    this.loading$.next(false);
                },
                complete: () => {
                    this.loading$.next(false);
                },
            });
        } else {
            const errors = [];

            if (this.form.get('radioId').errors) {
                errors.push('Auth - Missing or invalid radio ID/VIN');
            }
            if (this.form.get('accountNumber').errors) {
                errors.push('Auth - Missing or invalid radio ID/VIN');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
        }
    }

    private _navigateTo(destination: string): void {
        this._router.navigate([destination], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' });
    }
}
