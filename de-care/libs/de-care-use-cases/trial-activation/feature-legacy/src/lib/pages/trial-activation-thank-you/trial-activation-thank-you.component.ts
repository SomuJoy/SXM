import { ChangeDetectorRef, Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { CoreLoggerService, DataLayerService, SharedEventTrackService } from '@de-care/data-layer';
import {
    DataRegisterService,
    DataUtilityService,
    RegisterDataModel,
    SecurityQuestionsModel,
    DataLayerDataTypeEnum,
    FlowNameEnum,
    ComponentNameEnum,
    DataLayerActionEnum,
    SweepstakesModel,
} from '@de-care/data-services';
import { PasswordError, RegisterCredentialsState } from '@de-care/domains/account/ui-register';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Observable, of, Subject, race, BehaviorSubject } from 'rxjs';
import { catchError, concatMap, filter, map, startWith, takeUntil, tap, distinctUntilChanged } from 'rxjs/operators';
import { TrialActivationThanksData } from '../../trial-activation-thanks.resolver';
import { SweepstakesInfo } from '@de-care/sweepstakes';
import { Store } from '@ngrx/store';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { getFirstAccountSubscriptionId } from '@de-care/domains/account/state-account';

interface RegisterCompDataParams {
    email?: string;
    useEmailAsUsername?: boolean;
    isOfferStreamingEligible?: boolean;
}

@Component({
    selector: 'one-step-activation-flow-thank-you',
    templateUrl: './trial-activation-thank-you.component.html',
    styleUrls: ['./trial-activation-thank-you.component.scss'],
})
export class TrialActivationThankYouComponent implements OnDestroy, OnInit, AfterViewInit {
    private _logPrefix: string = '[One Step Trial Activation Thank You]:';

    destroy$ = new Subject();
    subscriptionID$ = this._store.select(getFirstAccountSubscriptionId).pipe(map((subscriptionId) => ({ subscriptionId })));

    private _registrationCompleted$ = new BehaviorSubject(false);
    registrationCompleted$ = this._registrationCompleted$.pipe(takeUntil(this.destroy$), distinctUntilChanged());

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
    refreshComplete = false;
    registerCredentialState: RegisterCredentialsState = RegisterCredentialsState.QuestionsOnly;
    registerCompData: RegisterCompDataParams = {};
    securityQuestions: SecurityQuestionsModel[] = [];
    passwordError: PasswordError = null;
    sweepstakesInfo: SweepstakesInfo;
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
                tap((flowData) => {
                    this.radioId = flowData.radioId;
                    this.trialEndDate = flowData.trialEndDate;
                }),
                filter((flowData) => flowData.isEligibleForRegistration),
                tap((flowData) => {
                    this.registerCompData = {
                        email: flowData.email,
                        useEmailAsUsername: true,
                        isOfferStreamingEligible: flowData.isOfferStreamingEligible,
                    };
                    this.isEligibleForRegistration = flowData.isEligibleForRegistration;
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

        this._dataLayerSrv.updateAndSendPageTrackEvent(DataLayerDataTypeEnum.PageInfo, ComponentNameEnum.TrialConfirmation, {
            flowName: FlowNameEnum.TrialActivation,
            componentName: ComponentNameEnum.TrialConfirmation,
        });
    }

    ngAfterViewInit() {
        // TODO: change this so there is not a dependency on the app to trigger this
        this._store.dispatch(pageDataFinishedLoading());
    }

    signalCompleted() {
        this.refreshComplete = true;
    }

    onRegisterAccount($event: RegisterDataModel): void {
        this.dataRegisterService
            .registerAccount($event)
            .pipe(
                catchError((err) => {
                    this._logger.error(`${this._logPrefix} ${err}`);
                    this._eventTrackingService.track(DataLayerActionEnum.FailedRegistration, { componentName: ComponentNameEnum.TrialConfirmation });
                    return of(err);
                })
            )
            .subscribe((resp) => {
                this._registrationCompleted$.next(resp.status === 'SUCCESS');
                this._changeDetectorRef.markForCheck();
                this._eventTrackingService.track(DataLayerActionEnum.SuccessfullRegistration, { componentName: ComponentNameEnum.TrialConfirmation });
            });
    }

    onSubmit(): void {
        this._dataLayerSrv.sendExplicitEventTrackEvent(DataLayerActionEnum.RegisterClicked, { componentName: ComponentNameEnum.TrialConfirmation });
    }
}
