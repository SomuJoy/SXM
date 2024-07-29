import { Injectable } from '@angular/core';
import { filter, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DataAccountService, TokenPayload, AccountFromTokenModel } from '@de-care/data-services';
import { DataLayerService } from '@de-care/data-layer';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { updateDataLayerOnClosedRadio, updateDataLayerWithMarketingId, getDevicePromoCode } from '../functions/workflow-helpers';
import { Store } from '@ngrx/store';
import { behaviorEventReactionDeviceInfo, behaviorEventReactionDevicePromoCode } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class AccountFromTokenWorkflow implements DataWorkflow<TokenPayload, AccountFromTokenModel> {
    constructor(private _dataAccountService: DataAccountService, private _dataLayerService: DataLayerService, private _store: Store) {}

    /**
     * @deprecated Use workflows from @de-care/domains/account/state-account
     */
    build(token: TokenPayload): Observable<AccountFromTokenModel> {
        return this._dataAccountService.getFromToken(token, false).pipe(
            tap((response) => {
                updateDataLayerWithMarketingId(response.marketingId, response.marketingAcctId, this._dataLayerService);
                updateDataLayerOnClosedRadio(response.nonPIIAccount, this._dataLayerService);
            }),

            //TODO: This action is dispatched from a deprecated workflow because it is used instead of the domain workflow. The sales token flow needs to be refactored.
            tap((response) => this._store.dispatch(behaviorEventReactionDevicePromoCode({ devicePromoCode: getDevicePromoCode(response?.nonPIIAccount) }))),
            tap((response) => {
                const account = response.nonPIIAccount as any;
                const deviceInfo = account?.subscriptions[0]?.radioService || account?.closedDevices[0];
                if (deviceInfo) {
                    this._store.dispatch(behaviorEventReactionDeviceInfo({ esn: deviceInfo.last4DigitsOfRadioId, vehicleInfo: deviceInfo.vehicleInfo }));
                }
            })
        );
    }
}
