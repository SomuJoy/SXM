import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, race, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { MinimumAccountData, PasswordError, RegisterCredentialsState } from '@de-care/domains/account/ui-register';
import {
    ComponentNameEnum,
    DataLayerActionEnum,
    DataLayerDataTypeEnum,
    DataRegisterService,
    DataUtilityService,
    FlowNameEnum,
    RegisterDataModel,
    SecurityQuestionsModel,
} from '@de-care/data-services';
import { SweepstakesInfo } from '@de-care/sweepstakes';
import { ActivatedRoute, Data } from '@angular/router';
import { CoreLoggerService, DataLayerService, SharedEventTrackService } from '@de-care/data-layer';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { TrialActivationThanksData } from '../../trial-activation-thanks.resolver';
import { select, Store } from '@ngrx/store';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { changeTrialFlowLang, isTrialFlowInCanada } from '@de-care/de-care-use-cases/trial-activation/state-legacy';
import { getFirstAccountSubscriptionId } from '@de-care/domains/account/state-account';

@Component({
    selector: 'service-lane-one-click-confirmation',
    templateUrl: './service-lane-one-click-confirmation.component.html',
    styleUrls: ['./service-lane-one-click-confirmation.component.scss'],
})
export class ServiceLaneOneClickConfirmationComponent implements OnDestroy, OnInit, AfterViewInit {
    private _logPrefix: string = '[SLOC Thank You]:';
    languageSelectionEnabled$ = this._store.pipe(select(isTrialFlowInCanada));
    destroy$ = new Subject();

    private _registrationCompleted$ = new BehaviorSubject(false);
    registrationCompleted$ = this._registrationCompleted$.pipe(takeUntil(this.destroy$), distinctUntilChanged());
    subscriptionID$ = this._store.select(getFirstAccountSubscriptionId).pipe(map((subscriptionId) => ({ subscriptionId })));

    dateFormat$: Observable<string> = this._userSettingsService.dateFormat$;
    isQuebec$: Observable<boolean> = this._userSettingsService.isQuebec$;
    locale$: Observable<string> = this._translateService.onLangChange.pipe(
        // auto-complete when component is destroyed or registration is completed
        // because we don't care about the security questions in both cases
        takeUntil(race(this.destroy$, this.registrationCompleted$.pipe(filter((val) => val === true)))),
        map((changes: LangChangeEvent) => changes.lang),
        startWith(this._translateService.currentLang),
        tap(() => {
            this._dataUtilityService.securityQuestions().subscribe((securityQuestions) => {
                this.securityQuestions = securityQuestions;
                this._changeDetectorRef.markForCheck();
            });
        })
    );

    radioId: string;
    isEligibleForRegistration = false;
    trialEndDate = '';
    registerCredentialState: RegisterCredentialsState = RegisterCredentialsState.PasswordOnly;
    registerCompData: MinimumAccountData;
    securityQuestions: SecurityQuestionsModel[] = [];
    passwordError: PasswordError = null;
    sweepstakesInfo: SweepstakesInfo;

    // TODO: This is temporary to hide the the registration form until the businsess defines the ux (which requires a phone number).
    canRegister: boolean = false;
    isCanadaMode: boolean;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _dataUtilityService: DataUtilityService,
        private _logger: CoreLoggerService,
        private dataRegisterService: DataRegisterService,
        private _userSettingsService: UserSettingsService,
        private _translateService: TranslateService,
        private _dataLayerSrv: DataLayerService,
        private _eventTrackingService: SharedEventTrackService,
        private readonly _store: Store,
        private readonly _settingsSrv: SettingsService
    ) {}

    ngOnDestroy() {
        this.destroy$.next();
    }

    ngOnInit() {
        this.isCanadaMode = this._settingsSrv.isCanadaMode;
        this._activatedRoute.data
            .pipe(
                filter((data) => {
                    return !!data.flowData;
                }),
                map<Data, TrialActivationThanksData>((data) => data.flowData),
                filter((flowData) => flowData.isEligibleForRegistration),
                tap((flowData) => {
                    this.registerCompData = {
                        email: flowData.email,
                        useEmailAsUsername: true,
                        firstName: flowData.firstName,
                        hasUserCredentials: flowData.hasUserCredentials,
                        hasExistingAccount: flowData.hasExistingAccount,
                        isOfferStreamingEligible: flowData.isOfferStreamingEligible,
                        isEligibleForRegistration: flowData.isEligibleForRegistration,
                        subscriptionId: flowData.subscriptionId,
                    };
                    this.radioId = flowData.radioId;
                    this.isEligibleForRegistration = flowData.isEligibleForRegistration;
                    this.trialEndDate = flowData.trialEndDate;
                    this._dataLayerSrv.update(DataLayerDataTypeEnum.AccountData, {
                        subscriptions: [
                            {
                                id: flowData.subscriptionId,
                                plans: flowData.plans,
                                radioService: flowData.radioService,
                            },
                        ],
                    });
                    this.sweepstakesInfo = { ...flowData.sweepstakesInfo, radioId: this.radioId || null };
                    if (flowData.radioService) {
                        this._dataLayerSrv.update(DataLayerDataTypeEnum.DeviceInfo, {
                            serviceId: flowData.radioService.id,
                        });
                    }
                })
            )
            .subscribe(() => this._changeDetectorRef.markForCheck());

        this._dataLayerSrv.updateAndSendPageTrackEvent(DataLayerDataTypeEnum.PageInfo, ComponentNameEnum.SlocTrialConfirmation, {
            flowName: FlowNameEnum.TrialActivation,
            componentName: ComponentNameEnum.SlocTrialConfirmation,
        });
    }

    ngAfterViewInit() {
        // TODO: change this so there is not a dependency on the app to trigger this
        this._store.dispatch(pageDataFinishedLoading());
    }

    onRegisterAccount($event: RegisterDataModel): void {
        const registerData = $event.userName ? $event : { ...$event, userName: this.registerCompData.email };

        this.dataRegisterService
            .registerAccount(registerData)
            .pipe(
                catchError((err) => {
                    this._logger.error(`${this._logPrefix} ${err}`);
                    this._eventTrackingService.track(DataLayerActionEnum.FailedRegistration, { componentName: ComponentNameEnum.SlocTrialConfirmation });
                    return of(err);
                })
            )
            .subscribe((resp) => {
                this._registrationCompleted$.next(resp.status === 'SUCCESS');
                this._changeDetectorRef.markForCheck();
                this._eventTrackingService.track(DataLayerActionEnum.SuccessfullRegistration, { componentName: ComponentNameEnum.SlocTrialConfirmation });
            });
    }

    onSubmit(): void {
        this._dataLayerSrv.sendExplicitEventTrackEvent(DataLayerActionEnum.RegisterClicked, { componentName: ComponentNameEnum.SlocTrialConfirmation });
    }

    changeLanguage(lang: string) {
        this._store.dispatch(changeTrialFlowLang({ lang }));
    }
}
