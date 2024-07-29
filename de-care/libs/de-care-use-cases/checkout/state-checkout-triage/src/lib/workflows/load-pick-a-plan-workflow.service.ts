import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { concatMap, map, take, tap, withLatestFrom } from 'rxjs/operators';
import { last4DigitsOfRadioId, normalizeAccountNumber } from '@de-care/domains/account/state-account';
import { behaviorEventReactionLookupByAccountNumberAndRadioIdSuccess } from '@de-care/shared/state-behavior-events';
import { UpdateCheckoutAccount } from '@de-care/checkout-state';
import { LoadCustomerPlansWorkflowService } from './load-customer-plans-workflow.service';
import { OfferTypeEnum } from '@de-care/domains/offers/state-offers';
import { AccountFromTokenWorkflow, NonPiiLookupWorkflow } from '@de-care/data-workflows';
import { getLandingPageInboundUrlParams } from '../state/checkout-triage.selectors';
import { TokenPayloadType } from '@de-care/data-services';
import { getIsCanadaMode, provinceChanged } from '@de-care/domains/customer/state-locale';
import { UserSettingsService } from '@de-care/settings';

@Injectable({ providedIn: 'root' })
export class LoadPickAPlanWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadCustomerPlansWorkflowService: LoadCustomerPlansWorkflowService,
        private _nonPiiSrv: NonPiiLookupWorkflow,
        private _accountTokenSrv: AccountFromTokenWorkflow,
        private readonly _userSettingsSrv: UserSettingsService
    ) {}

    build(request: void): Observable<boolean> {
        return this._store.pipe(
            select(getLandingPageInboundUrlParams),
            take(1),
            concatMap(({ programCode, radioId, accountNumber, tkn, lname, promocode }) => {
                const normalizedAccountNumber = normalizeAccountNumber(accountNumber);
                let radioIdLast4 = last4DigitsOfRadioId(radioId);
                let obs$: Observable<any>;
                if (accountNumber) {
                    obs$ = this._nonPiiSrv.build({ accountNumber: normalizedAccountNumber, radioId });
                } else if (lname) {
                    obs$ = this._nonPiiSrv.build({ radioId, lastName: lname });
                } else if (tkn) {
                    obs$ = this._accountTokenSrv.build({ token: tkn, tokenType: TokenPayloadType.SalesAudio });
                } else {
                    return throwError('Invalid params supplied');
                }
                return obs$.pipe(
                    tap(_ => this._store.dispatch(behaviorEventReactionLookupByAccountNumberAndRadioIdSuccess())),
                    withLatestFrom(this._store.pipe(select(getIsCanadaMode))),
                    take(1),
                    concatMap(([account, isCanada]) => {
                        if (this._containsSelfPaidSubscriptions(account)) {
                            return throwError('ERROR_ACTIVE_SUBSCRIPTION');
                        } else {
                            if (!radioId && account && account.nonPIIAccount) {
                                radioIdLast4 = this._getRadioId(account);
                            }
                            this._store.dispatch(UpdateCheckoutAccount({ payload: account }));
                            if (isCanada) {
                                const state = account && account.serviceAddress && account.serviceAddress.state;
                                this._store.dispatch(provinceChanged({ province: state }));
                                this._userSettingsSrv.setSelectedCanadianProvince(state);
                            }

                            return this._loadCustomerPlansWorkflowService.build({ programCode, radioId: radioIdLast4, marketingPromoCode: promocode }).pipe(map(() => true));
                        }
                    })
                );
            })
        );
    }

    private _getRadioId(account) {
        if (account.nonPIIAccount.subscriptions && account.nonPIIAccount.subscriptions[0]) {
            return account.nonPIIAccount.subscriptions[0].radioService.last4DigitsOfRadioId;
        } else if (account.nonPIIAccount.closedDevices && account.nonPIIAccount.closedDevices[0]) {
            return account.nonPIIAccount.closedDevices[0].last4DigitsOfRadioId;
        }
        return null;
    }

    private _containsSelfPaidSubscriptions(account): boolean {
        return (
            account?.subscriptions &&
            Array.isArray(account?.subscriptions) &&
            account?.subscriptions.length > 0 &&
            !!account?.subscriptions[0].plans.find(plan => plan && plan.type && plan.type === OfferTypeEnum.SelfPaid)
        );
    }
}
