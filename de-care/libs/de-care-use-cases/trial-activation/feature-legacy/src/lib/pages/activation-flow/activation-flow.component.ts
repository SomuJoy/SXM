import { CdkStepper } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { SxmLanguages, UrlHelperService } from '@de-care/app-common';
import { YourDeviceInfo } from '@de-care/customer-info';
import {
    PackageModel,
    packagesAreOnDifferentPlatforms,
    ActivationProspectModel,
    SweepstakesModel,
    OfferNotAvailableReasonEnum,
    DataLayerDataTypeEnum,
    ComponentNameEnum,
    FlowNameEnum
} from '@de-care/data-services';
import { SettingsService, sxmCountries, UserSettingsService } from '@de-care/settings';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { AccountFormStepValue } from '../../page-parts/account-form-step/account-form-step.component';
import { RadioInfo } from '../../page-parts/identification-step/identification-step.component';
import { AccountData } from '../../page-parts/new-account-form-step/new-account-form-step.component';
import { ActivationFlowService } from './activation-flow.service';
import { Store, select } from '@ngrx/store';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { DataLayerService } from '@de-care/data-layer';
import { trialActivationLegacyVM, LoadCustomerOfferInfoWorkflowService } from '@de-care/de-care-use-cases/trial-activation/state-legacy';

@Component({
    selector: 'activation-flow',
    templateUrl: './activation-flow.component.html',
    styleUrls: ['./activation-flow.component.scss'],
    providers: [ActivationFlowService]
})
export class ActivationFlowComponent implements OnInit, OnDestroy, AfterViewInit {
    offer: PackageModel = null;
    isNewAccount = false;
    prospectData$: Observable<ActivationProspectModel>;
    yourDeviceInfo: YourDeviceInfo;
    programCode: string;
    country: sxmCountries = 'us';
    lang: SxmLanguages = 'en-US';
    planCode: string;
    username: string;
    isLoading = false;
    accountRegistered = false;
    sweepstakesInfo: SweepstakesModel | undefined;
    vm$ = this._store.pipe(select(trialActivationLegacyVM));

    isOfferNotAvailable;

    @ViewChild('stepper') _stepper: CdkStepper;

    private _mainOffer: PackageModel;
    private _radioId: string;

    private readonly _destroy$ = new Subject<boolean>();

    constructor(
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _urlHelperService: UrlHelperService,
        private readonly _settingsSrv: SettingsService,
        private readonly _translateSrv: TranslateService,
        private readonly _userSettingsService: UserSettingsService,
        private readonly _activationFlowService: ActivationFlowService,
        private readonly _router: Router,
        private readonly _store: Store,
        private _dataLayerSrv: DataLayerService,
        private readonly _loadCustomerOfferInfoWorkflowService: LoadCustomerOfferInfoWorkflowService
    ) {}

    ngOnInit(): void {
        this.country = this._settingsSrv.settings.country;
        this.lang = this._translateSrv.currentLang as SxmLanguages;
        this._translateSrv.onLangChange.pipe(takeUntil(this._destroy$)).subscribe(ev => {
            this.lang = ev.lang as SxmLanguages;
        });

        this._activatedRoute.data
            .pipe(
                tap<Data>(data => {
                    this.sweepstakesInfo = data.sweepstakesInfo;

                    if (data.prospectInfo) {
                        if (data.prospectInfo.offer) {
                            this._mainOffer = data.prospectInfo.offer;
                            this.offer = this._mainOffer;

                            // [TODO] Move this to a shareable utility in the offers domain
                            this.isOfferNotAvailable =
                                this._mainOffer?.fallback && this._mainOffer?.fallbackReason && OfferNotAvailableReasonEnum[this._mainOffer.fallbackReason] !== undefined;
                        }

                        if (!!data.prospectInfo.prospectData) {
                            this.username = data.prospectInfo.prospectData.username;
                        }
                    }
                }),
                takeUntil(this._destroy$)
            )
            .subscribe();

        this.prospectData$ = this._activatedRoute.data.pipe(
            filter(data => !!data.prospectInfo.prospectData),
            map<Data, ActivationProspectModel>(data => data.prospectInfo && data.prospectInfo.prospectData)
        );

        this.programCode = this._urlHelperService.getCaseInsensitiveParam(this._activatedRoute.snapshot.queryParamMap, 'programCode');
    }

    ngAfterViewInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
        this._dataLayerSrv.updateAndSendPageTrackEvent(DataLayerDataTypeEnum.PageInfo, ComponentNameEnum.FlepzSearch, {
            flowName: FlowNameEnum.Authenticate,
            componentName: ComponentNameEnum.FlepzSearch
        });
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    onRadioSelected(radioInfo: RadioInfo) {
        this.isNewAccount = radioInfo.isNewAccount;
        this.accountRegistered = radioInfo.accountRegistered;
        this._radioId = radioInfo.last4DigitsOfRadioId;
        this.yourDeviceInfo = {
            vehicleInfo: radioInfo.vehicleInfo,
            plans: null, // we do not want to show the existing plans, so we send in null here
            ...(radioInfo.closedDevice && { closedDate: radioInfo.closedDevice.closedDate })
        };
        const radioPackage = radioInfo.radioOffer.offers[0];
        this.planCode = radioPackage.planCode;

        this._loadCustomerOfferInfoWorkflowService
            .build({
                planCodes: [{ leadOfferPlanCode: radioInfo.radioOffer.offers[0].planCode }],
                province: radioInfo.state,
                radioId: radioInfo.last4DigitsOfRadioId,
                offers: radioInfo.radioOffer.offers
            })
            .subscribe(_ => {});
        if (packagesAreOnDifferentPlatforms(radioPackage.packageName, this._mainOffer.packageName)) {
            this.offer = radioPackage;
        }
        if (radioInfo.state) {
            this._userSettingsService.setSelectedCanadianProvince(radioInfo.state);
        }
        if (!this.isNewAccount) {
            this._dataLayerSrv.updateAndSendPageTrackEvent(DataLayerDataTypeEnum.PageInfo, ComponentNameEnum.CustomerInfo, {
                flowName: FlowNameEnum.TrialActivation,
                componentName: ComponentNameEnum.CustomerInfo
            });
        }
        // TODO: store radio info
    }

    onAccountFormSubmit(payload: AccountFormStepValue) {
        this.isLoading = true;
        const username = payload.email ? payload.email : this.username;
        this._activationFlowService.activateExistingAccount(this.offer, payload.password, this.planCode, this._radioId, username, this.sweepstakesInfo).subscribe({
            next: () => (this.isLoading = false),
            error: () => (this.isLoading = false)
        });
    }

    onNewAccountFormSubmit(accountData: AccountData) {
        this.isLoading = true;
        this._activationFlowService.activateNewAccount(accountData, this.lang, this.offer, this._radioId, this.sweepstakesInfo).subscribe({
            next: () => {
                this.isLoading = false;
            },
            error: () => (this.isLoading = false)
        });
    }

    onEditIdentificationStep(): void {
        this.offer = this._mainOffer;
    }

    redirectToErrorPage() {
        this._router.navigate(['/error']);
    }
}
