import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Component, EventEmitter, OnInit, Output, OnDestroy, ChangeDetectionStrategy, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TabInfo } from '@de-care/shared/sxm-ui/ui-tabs';
import * as uuid from 'uuid/v4';
import { BehaviorSubject, Subject } from 'rxjs';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { select, Store } from '@ngrx/store';
import { isCanadaMode, RefreshSignalWorkflowService, selectAccountBillingSummaryIsInCollection, selectMarketingAccountId, SendRefreshAuthenticatedWorkflowService, setReceiverIdFromURL } from '@de-care/de-care-use-cases/subscription/state-refresh-radio-signal';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { map } from 'rxjs/operators';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-unauthenticated-landing-page',
    templateUrl: './unauthenticated-landing-page.component.html',
    styleUrls: ['./unauthenticated-landing-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthenticatedLandingPageComponent implements ComponentWithLocale, OnInit, OnDestroy {
    @ViewChild('helpFindingRadioModal') private readonly _helpFindingRadioModal: SxmUiModalComponent;

    languageResources: LanguageResources;
    translateKeyPrefix: string;

    // textInstructionsForm: FormGroup;
    sendSignalForm: FormGroup;

    submitted = false;
    isInvalidPhone = false;
    tabInfoYes: TabInfo = {
        id: 'yes-tab',
        qaTag: 'YesTabLink',
        index: 0,
        isSelected: true,
    };
    tabInfoNo: TabInfo = {
        id: 'no-tab',
        qaTag: 'NoTabLink',
        index: 1,
        isSelected: false,
    };

    @Output() userInCar = new EventEmitter<boolean>();
    @Output() activeComponentUpdate = new EventEmitter<string>();

    readonly outsideCarLegalId = uuid();
    readonly phoneId = uuid();
    deviceHelpModalAriaDescribedbyTextId = uuid();

    refreshTypeUseInCar: boolean;
    loading$ = new BehaviorSubject<boolean>(false);
    loadingInstructions$ = new BehaviorSubject<boolean>(false);
    showInactiveError$ = new BehaviorSubject<boolean>(false);
    successMessage$ = new BehaviorSubject<boolean>(false);
    systemError$ = new BehaviorSubject<boolean>(false);
    showInvalidvRadioError$ = new BehaviorSubject<boolean>(false);
    private unsubscribe$: Subject<void> = new Subject();
    isRadioId = false;
    isVin = false;
    isPhone = false;
    showNonPayError$ = new BehaviorSubject<boolean>(false);
    accId: any;
    radioId: any;
    isInCollection = false;
    private readonly _window: Window;
    showDeviceNotFoundError$ = new BehaviorSubject<boolean>(false);
    isCanada = this._store.pipe(select(isCanadaMode)) ;

    isShowMultipleRadioError$ = new BehaviorSubject<boolean>(false);
    currentLanguage$ = this.translationsForComponentService.currentLang$;
    isCanadaFrench$ = this.currentLanguage$.pipe(map((lang) => (lang === 'fr-CA' ? true : false)));

    vinLike = /^[A-Za-z0-9]{17}$/;
    phoneNumberLike = /^[0-9]{10}$/;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private formBuilder: FormBuilder,
        private _refreshSignalWorkflowService: RefreshSignalWorkflowService,
        private _store: Store,
        private _sendRefreshAuthenticatedWorkflowService: SendRefreshAuthenticatedWorkflowService,
        public translate: TranslateService,
        @Inject(DOCUMENT) document: Document,
        private readonly _sxmValidators: SxmValidators,
    ) {
        this._window = document?.defaultView;
        translationsForComponentService.init(this);
    }

    ngOnInit() {
        // this.textInstructionsForm = this.startTextInstructionsForm();
        this.sendSignalForm = this.startSendSignalForm();
        // Notify parent that userInCar tab is selected by default
        this.userInCar.emit(true);
        this.refreshTypeUseInCar = true;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    tabSelected($event: TabInfo) {
        // If user the "Yes Tab" (ie the "In Car Tab), return true
        this.refreshTypeUseInCar = $event.id === 'yes-tab';
        this.userInCar.emit($event.id === 'yes-tab');
    }

    private startSendSignalForm(): FormGroup {
        return this.formBuilder.group({
            radioIdVinOrPhoneNumber: new FormControl('', { validators: this._sxmValidators.radioIdOrVinOrPhoneNummber, updateOn: 'blur' }),
        });
    }

    openFindradioIdModal() {
        this._helpFindingRadioModal.open();
    }

    sendRefreshSignal() {
        this.sendSignalForm.get('radioIdVinOrPhoneNumber').markAsTouched();
        this.successMessage$.next(false);
        this.showInactiveError$.next(false);
        this.showNonPayError$.next(false);
        this.showDeviceNotFoundError$.next(false);
        this.isShowMultipleRadioError$.next(false);
        this.showInvalidvRadioError$.next(false);
        this.systemError$.next(false);
        if (this.sendSignalForm.valid) {
            this.loading$.next(true);
            this.sendSignalForm.get('radioIdVinOrPhoneNumber').markAsTouched();
            const param = this.checkIdentifier(this.sendSignalForm.controls.radioIdVinOrPhoneNumber.value);
            this._refreshSignalWorkflowService.build(param).subscribe({
                next: () => {
                    this.loading$.next(false);
                    this.successMessage$.next(true);
                },
                error: (error) => {
                    if (error?.error?.error?.fieldErrors && error?.error?.error?.fieldErrors.length > 0) {
                        const errors = error?.error?.error?.fieldErrors[0];
                        if(errors.errorCode === 'INVALID_VIRTUAL_RADIO_ID') {
                            this.showInvalidvRadioError$.next(true);
                            this.loading$.next(false);
                        } else if (errors.errorCode === 'NO_ACTIVE_SUBSCRIPTION' || errors.errorCode === 'PHONE_OR_VIN_NO_ACTIVE_SUBSCRIPTION') {
                            if (this.isRadioId) {
                                this._sendRefreshAuthenticatedWorkflowService.build().subscribe({
                                    next: (res) => {
                                        if (res) {
                                            this._store.select(selectAccountBillingSummaryIsInCollection).subscribe((isInCollection) => {
                                                this.isInCollection = isInCollection;
                                            });
                                            this._store.select(selectMarketingAccountId).subscribe((accId) => {
                                                this.accId = accId;
                                            });
                                            if (this.isInCollection) {
                                                this.showNonPayError$.next(true);
                                            } else {
                                                this.showInactiveError$.next(true);
                                            }
                                            this.loading$.next(false);
                                        } else {
                                            this.loading$.next(false);
                                        }
                                    },
                                });
                            } else if (this.isVin) {
                                this._sendRefreshAuthenticatedWorkflowService.buildVin().subscribe({
                                    next: (res) => {
                                        if (res) {
                                            this._store.select(selectAccountBillingSummaryIsInCollection).subscribe((isInCollection) => {
                                                this.isInCollection = isInCollection;
                                            });
                                            this._store.select(selectMarketingAccountId).subscribe((accId) => {
                                                this.accId = accId;
                                            });
                                            if (this.isInCollection) {
                                                this.showNonPayError$.next(true);
                                            } else {
                                                this.showInactiveError$.next(true);
                                            }
                                            this.loading$.next(false);
                                        } else {
                                            this.loading$.next(false);
                                        }
                                    },
                                });
                            } else {
                                this._sendRefreshAuthenticatedWorkflowService.buildContact().subscribe({
                                    next: (res) => {
                                        if (res) {
                                            this._store.select(selectAccountBillingSummaryIsInCollection).subscribe((isInCollection) => {
                                                this.isInCollection = isInCollection;
                                            });
                                            this._store.select(selectMarketingAccountId).subscribe((accId) => {
                                                this.accId = accId;
                                            });
                                            if (this.isInCollection) {
                                                this.showNonPayError$.next(true);
                                            } else {
                                                this.showInactiveError$.next(true);
                                            }
                                            this.loading$.next(false);
                                        } else {
                                            this.loading$.next(false);
                                        }
                                    },
                                    error: (error) => {
                                        if (error === 'CLOSED_RADIO') {
                                            this.showInactiveError$.next(true);
                                        }
                                        this.loading$.next(false);
                                    },
                                });
                            }
                        } else if (
                            errors.errorCode === 'INVALID_DEVICE_ID' ||
                            errors.errorCode === 'DEVICE_NOT_FOUND' ||
                            errors.errorCode === 'DEVICE_NOT_FOUND_FOR_VIN' ||
                            errors.errorCode === 'PHONE_NOT_FOUND'
                        ) {
                            this.showDeviceNotFoundError$.next(true);
                            this.loading$.next(false);
                        } else if (errors.errorCode === 'PHONE_HAS_MORE_THAN_FIVE_RADIOS') {
                            this.isShowMultipleRadioError$.next(true);
                            this.loading$.next(false);
                        } else {
                            this.loading$.next(false);
                        }
                    } else {
                        this.systemError$.next(true);
                        this.loading$.next(false);
                    }
                },
            });
        }
    }

    checkIdentifier(value) {
        this.isRadioId = false;
        this.isVin = false;
        this.isPhone = false;
        value = value?.toString();
        value = value.replaceAll('-', '');
        this._store.dispatch(setReceiverIdFromURL({ receiverId: value }));
        if (this.phoneNumberLike.test(value)) {
            value = parseInt(value);
            this.isPhone = true;
            return { phone: value };
        } else if (this.vinLike.test(value)) {
            this.isVin = true;
            return { vin: value };
        } else {
            this.isRadioId = true;
            return { radioId: value };
        }
    }

    onReactivate(url) {
        const translateUrl = this.translate.instant(url);
        this._window.location.href = translateUrl;
    }

    onMakeAPayment(url) {
        const translateUrl = this.translate.instant(url);
        this._window.location.href = translateUrl;
    }
}
