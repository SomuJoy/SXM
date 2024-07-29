import { Injectable } from '@angular/core';
import { IngressStudentVerificationIdValidateSuccess, IngressStudentVerificationNameAndEmail, IngressStudnetVerificationWithAccountModel } from '@de-care/checkout-state';
import { DataLayerService } from '@de-care/data-layer';
import { CustomerInfoData, DataLayerDataTypeEnum, DataUtilityService, generateEmptyAccount, convertAccountToAccountModel } from '@de-care/data-services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { BrowserSessionTrackerService } from '@de-care/shared/browser-common/state-session-tracker';
import { ChangeStep } from '../actions/purchase.actions';
import { getData } from '../selectors/purchase.selectors';
import { LoadFlepzDataSuccess } from './../actions/purchase.actions';
import { CustomerTypeEnum } from '@de-care/domains/account/state-account';

@Injectable()
export class PaymentEffects {
    changeStep$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(ChangeStep),
                withLatestFrom(this._browserSessionTrackerService.apiPingNeeded$),
                filter(([_, apiPingNeeded]) => apiPingNeeded),
                tap(() => {
                    this._dataUtilityService.pingApi().subscribe();
                })
            ),
        { dispatch: false }
    );

    createStudentAccount$ = createEffect(() =>
        this._actions$.pipe(
            ofType(IngressStudentVerificationIdValidateSuccess),
            withLatestFrom(this._store.pipe(select(getData))),
            map(([action, purchaseData]) => {
                const account = action.account;
                const customerInfoObj: CustomerInfoData = this._dataLayerSrv.getData(DataLayerDataTypeEnum.CustomerInfo);
                customerInfoObj.customerType = CustomerTypeEnum.NewSxirStudent;
                this._dataLayerSrv.update(DataLayerDataTypeEnum.CustomerInfo, customerInfoObj);

                return LoadFlepzDataSuccess({ payload: { account, programCode: purchaseData.programCode, offer: purchaseData.offer } });
            })
        )
    );

    createEmptyStudentAccount$ = createEffect(() =>
        this._actions$.pipe(
            ofType(IngressStudentVerificationNameAndEmail),
            map(action => {
                const emptyAccount = generateEmptyAccount();
                const account = {
                    ...emptyAccount,
                    firstName: action.firstName,
                    lastName: action.lastName,
                    email: action.email,
                    customerInfo: { firstName: action.firstName, email: action.email }
                };
                return IngressStudentVerificationIdValidateSuccess({ account });
            })
        )
    );

    convertAccountToAccountModel$ = createEffect(() =>
        this._actions$.pipe(
            ofType(IngressStudnetVerificationWithAccountModel),
            map(action => {
                const accountModelObj = convertAccountToAccountModel(action.account);
                return IngressStudentVerificationIdValidateSuccess({ account: accountModelObj });
            })
        )
    );

    constructor(
        private _actions$: Actions,
        private _store: Store<{}>,
        private _browserSessionTrackerService: BrowserSessionTrackerService,
        private _dataUtilityService: DataUtilityService,
        private _dataLayerSrv: DataLayerService
    ) {}
}
