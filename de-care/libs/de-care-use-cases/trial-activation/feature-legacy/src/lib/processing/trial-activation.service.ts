import { Injectable } from '@angular/core';
import { ObjectTokenizerService } from '@de-care/app-common';
import { DataPurchaseService, PackageModel, SweepstakesModel, DataLayerDataTypeEnum } from '@de-care/data-services';
import { Observable } from 'rxjs';
import { concatMap, filter, tap } from 'rxjs/operators';
import { AccountData } from '../page-parts/new-account-form-step/new-account-form-step.component';
import { TrialAccountNavigationService } from '../trial-account-navigation.service';
import { TrialActivationThanksData } from '../trial-activation-thanks.resolver';
import { createNewSubscriptionAccount, createTrialActivationTokenInfo, createTrialSubscriptionAccount } from './trial-activation.helpers';
import { UserSettingsService } from '@de-care/settings';
import { DataLayerService } from '@de-care/data-layer';
import { NonPiiLookupTrialActivationWorkflow } from './workflows/nonpii-trial-activation-workflow.service';
import { Account } from '@de-care/domains/account/state-account';

export const enum ActivationFlowtype {
    'oneStepActivation' = 'oneStepActivation',
    'default' = 'default',
}

@Injectable()
export class TrialActivationService {
    constructor(
        private _nonPiiSrv: NonPiiLookupTrialActivationWorkflow,
        private _dataPurchaseService: DataPurchaseService,
        private _dataLayerService: DataLayerService,
        private _objectTokenizerService: ObjectTokenizerService,
        private _trialAccountNavigationService: TrialAccountNavigationService,
        private _userSettingsService: UserSettingsService
    ) {}

    private _buildDataLayerPlanInfoProducts(offer: PackageModel): void {
        const planInfoObj: any = this._dataLayerService.getData(DataLayerDataTypeEnum.PlanInfo) || {};
        const planProductsData = (planInfoObj.products = planInfoObj.products || {});

        planProductsData.purchasePlan = {
            marketType: offer.marketType,
            termLength: offer.termLength,
        };

        this._dataLayerService.update(DataLayerDataTypeEnum.PlanInfo, planInfoObj);
    }

    activateExistingAccount(
        offer: PackageModel,
        password: string,
        planCode: string,
        radioId: string,
        username: string,
        sweepstakesInfo?: SweepstakesModel
    ): Observable<Account> {
        const trialSubscriptionAccount = createTrialSubscriptionAccount(radioId, planCode, username, password);

        return this._dataPurchaseService.activateTrialExistingAccount(trialSubscriptionAccount).pipe(
            filter((response) => !!response),
            tap(() => {
                this._buildDataLayerPlanInfoProducts(offer);
            }),
            concatMap((trialSubscriptionResponse) =>
                this._nonPiiSrv.build({ radioId: trialSubscriptionAccount.radioId }).pipe(
                    tap((account) => {
                        const tokenInfo = createTrialActivationTokenInfo(
                            offer,
                            username,
                            radioId,
                            trialSubscriptionResponse.isEligibleForRegistration,
                            trialSubscriptionResponse.isOfferStreamingEligible,
                            account.subscriptions[0].plans[0].endDate.toString(),
                            undefined,
                            undefined,
                            sweepstakesInfo
                        );

                        !!account && !!account.serviceAddress && this._userSettingsService.setSelectedCanadianProvince(account.serviceAddress.state);

                        const token = this._objectTokenizerService.tokenize(tokenInfo);

                        this._trialAccountNavigationService.gotoTrialThanksPage(token);
                    })
                )
            )
        );
    }

    activateNewAccount(
        accountData: AccountData,
        radioId: string,
        offer: PackageModel,
        lang: string,
        sweepstakesInfo?: SweepstakesModel,
        flowType: ActivationFlowtype = ActivationFlowtype.default
    ): Observable<Account> {
        const newTrialSubscriptionAccount = createNewSubscriptionAccount(accountData, radioId, offer.planCode, lang);

        return this._dataPurchaseService.activateTrialAccount(newTrialSubscriptionAccount).pipe(
            filter((response) => !!response),
            tap(() => {
                this._buildDataLayerPlanInfoProducts(offer);
            }),
            concatMap((purchaseSubscriptionResponse) =>
                this._nonPiiSrv.build({ radioId: newTrialSubscriptionAccount.radioId }).pipe(
                    tap((account) => {
                        const tokenInfo = createTrialActivationTokenInfo(
                            offer,
                            newTrialSubscriptionAccount.streamingInfo.emailAddress || accountData.username,
                            radioId,
                            purchaseSubscriptionResponse.isEligibleForRegistration,
                            purchaseSubscriptionResponse.isOfferStreamingEligible,
                            new Date(account.subscriptions[0].plans[0].endDate).toISOString(),
                            account.subscriptions ? account.subscriptions[0].id : undefined,
                            account.subscriptions && account.subscriptions[0].plans ? account.subscriptions[0].plans : undefined,
                            sweepstakesInfo
                        );

                        this._userSettingsService.setSelectedCanadianProvince(accountData.state);

                        const token = this._objectTokenizerService.tokenize<TrialActivationThanksData>(tokenInfo);

                        if (flowType === ActivationFlowtype.oneStepActivation) {
                            this._trialAccountNavigationService.gotoOneStepActivationConfirmationPage(token);
                        } else {
                            this._trialAccountNavigationService.gotoTrialThanksPage(token);
                        }
                    })
                )
            )
        );
    }
}
