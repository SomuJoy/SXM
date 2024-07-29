import { ActionReducerMap } from '@ngrx/store';
import { PurchaseState } from '../states/purchase.state';
import { dataReducer } from './data.reducer';
import { upsellReducer } from './package-upgrades.reducers';
import { paymentFormReducer } from './payment-form.reducers';
import { paymentInfoReducer } from './payment-info.reducers';
import { prepaidReducer } from './prepaid-redeem.reducers';
import { reviewOrderReducer } from './review-order.reducers';
import { serviceErrorReducer } from './service-error.reducer';

export const PurchaseReducers: ActionReducerMap<PurchaseState, any> = {
    paymentInfo: paymentInfoReducer,
    prepaidCard: prepaidReducer,
    packageUpgrades: upsellReducer,
    reviewOrder: reviewOrderReducer,
    formStatus: paymentFormReducer,
    data: dataReducer,
    serviceError: serviceErrorReducer
};
