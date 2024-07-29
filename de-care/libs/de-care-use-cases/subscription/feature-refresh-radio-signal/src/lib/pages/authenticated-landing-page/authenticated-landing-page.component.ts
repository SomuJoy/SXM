import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Component, EventEmitter, OnInit, Output, OnDestroy, ChangeDetectionStrategy, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { getSxmValidator } from '@de-care/shared/validation';
import { TabInfo } from '@de-care/shared/sxm-ui/ui-tabs';
import * as uuid from 'uuid/v4';
import { BehaviorSubject, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { setPhoneNumber, SendRefreshAuthenticatedWorkflowService, setReceiverIdFromURL, TextInstructionsWorkflowService, RefreshSignalWorkflowService, selectMarketingAccountId, selectAccountBillingSummaryIsInCollection, isCanadaMode } from '@de-care/de-care-use-cases/subscription/state-refresh-radio-signal';
import { TranslateService } from '@ngx-translate/core';
import { map, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-authenticated-landing-page',
    templateUrl: './authenticated-landing-page.component.html',
    styleUrls: ['./authenticated-landing-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticatedLandingPageComponent implements ComponentWithLocale, OnInit, OnDestroy {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    textInstructionsForm: FormGroup;
    loading$ = new BehaviorSubject<boolean>(false);
    successMessage$ = new BehaviorSubject<boolean>(false);
    loadingInstructions$ = new BehaviorSubject<boolean>(false);
    systemError$ = new BehaviorSubject<boolean>(false);
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
    receiverId: any;
    submitted = false;

    @Output() userInCar = new EventEmitter<boolean>();
    @Output() activeComponentUpdate = new EventEmitter<string>();

    readonly outsideCarLegalId = uuid();
    readonly phoneId = uuid();
    refreshTypeUseInCar: boolean;
    get formControls(): {
        [key: string]: AbstractControl;
    } {
        return this.textInstructionsForm.controls;
    }
    private unsubscribe$: Subject<void> = new Subject();
    showInactiveError$ = new BehaviorSubject<boolean>(false);
    showNonPayError$ = new BehaviorSubject<boolean>(false);
    showInvalidvRadioError$ = new BehaviorSubject<boolean>(false);
    accId: any;
    radioId: any;
    isInCollection = false;
    isCanada = this._store.pipe(select(isCanadaMode)) ;
   

    private readonly _window: Window;
    currentLanguage$ = this.translationsForComponentService.currentLang$;
    isCanadaFrench$ = this.currentLanguage$.pipe(map((lang) => (lang === 'fr-CA' ? true : false)));


    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private formBuilder: FormBuilder,
        private _sendRefreshSignalService: RefreshSignalWorkflowService,
        private _store: Store,
        private _textInstructionsWorkflowService: TextInstructionsWorkflowService,
        private readonly _translateService: TranslateService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _sendRefreshAuthenticatedWorkflowService: SendRefreshAuthenticatedWorkflowService,
        public translate: TranslateService,
        @Inject(DOCUMENT) document: Document
    ) {
        translationsForComponentService.init(this);
        this._window = document?.defaultView;
    }

    ngOnInit() {
        this.textInstructionsForm = this.startTextInstructionsForm();
        // Notify parent that userInCar tab is selected by default
        this.userInCar.emit(true);
        this.refreshTypeUseInCar = true;
        this.receiverId = this._activatedRoute.snapshot.queryParamMap.get('receiver');
        this.radioId = this.receiverId?.slice(-4);
        this._store.dispatch(setReceiverIdFromURL({ receiverId: this.receiverId }));
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

    private startTextInstructionsForm(): FormGroup {
        return this.formBuilder.group({
            phoneNumber: this.formBuilder.control('', {
                updateOn: 'blur',
                validators: getSxmValidator('phoneNumber'),
            }),
            checkbox: this.formBuilder.control('', {
                updateOn: 'change',
                validators: getSxmValidator('agreement'),
            }),
        });
    }

    sendRefreshSignal() {
        this.loading$.next(true);
        this.successMessage$.next(false);
        this.showInactiveError$.next(false);
        this.showNonPayError$.next(false);
        this.systemError$.next(false);
        this.showInvalidvRadioError$.next(false);
        this._sendRefreshSignalService.build({ radioId: this.receiverId }).subscribe({
            next: () => {
                this.loading$.next(false);
                this.successMessage$.next(true);
            },
            error: (error) => {
                if (error?.error?.error?.fieldErrors && error?.error?.error?.fieldErrors.length > 0) {
                    const errors = error?.error?.error?.fieldErrors[0];
                    if (errors.errorCode === 'INVALID_VIRTUAL_RADIO_ID') {
                        this.showInvalidvRadioError$.next(true);
                        this.loading$.next(false);
                    } else if (errors.errorCode === 'NO_ACTIVE_SUBSCRIPTION' || errors.errorCode === 'PHONE_OR_VIN_NO_ACTIVE_SUBSCRIPTION') {
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
                            error: () => {
                                this.loading$.next(false);
                            },
                        });
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

    private _normalizeLangToLocale(locale: string): string {
        return locale?.replace('-', '_');
    }

    sendRefreshSignalInstructions() {
        this.textInstructionsForm.get('phoneNumber').markAsTouched();
        this.textInstructionsForm.get('checkbox').markAsTouched();
        this.submitted = true;
        this.loadingInstructions$.next(true);
        if (this.textInstructionsForm.valid) {
            const phone = this.textInstructionsForm.value.phoneNumber;
            const languagePreference = this._normalizeLangToLocale(this._translateService.currentLang);

            this._store.dispatch(setPhoneNumber({ phoneNumber: phone }));
            this._textInstructionsWorkflowService
                .build({ phone, radioId: this.receiverId, languagePreference })
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(
                    (response) => {
                        if (response) {
                            this.loadingInstructions$.next(false);
                            return this._navigateTo('../text-message-sent-confirmation');
                        } else {
                            this.loadingInstructions$.next(false);
                        }
                    },
                    () => this._handleTextServiceError()
                );
        } else {
            this.loadingInstructions$.next(false);
        }
    }

    private _handleTextServiceError() {
        this.loadingInstructions$.next(false);
    }

    private _navigateTo(destination: string): void {
        this._router.navigate([destination], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' });
    }

    onReactivate(url) {
        const translateUrl = this.translate.instant(url);
        this._window.location.href = translateUrl + `?RadioID=${this.radioId}&act=${this.accId}&isIdentifiedUser=true`;
    }

    onMakeAPayment() {
        this._router.navigate(['account', 'pay', 'make-payment']);
    }
}
