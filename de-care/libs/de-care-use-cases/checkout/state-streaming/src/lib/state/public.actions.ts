import { createAction, props } from '@ngrx/store';

export const loadOrganicPurchaseDataIfNotAlreadyLoadedAsync = createAction('[Checkout Streaming] Load organic purchase data asynchronously if not already loaded');
export const loadConfirmationPageData = createAction('[Checkout Streaming] Load data for confirmation page');
export const setMrdSelectedPlanCode = createAction('[Checkout Streaming] Set Selected MRD PlanCode', props<{ planCode: string }>());
export const allowAmexTransactions = createAction('[Checkout Streaming] Allow Amex transactions');
export const skipUpdateOfferOnProvinceChange = createAction('[Checkout Streaming] Skip update offer on province change');
export const updateOfferOnProvinceChange = createAction('[Checkout Streaming] update offer on province change');

export {
    setSelectedPlanCode,
    resetSelectedPlanCodeToLeadOffer,
    setUserEnteredCredentials,
    clearPaymentInfoCvv,
    clearUserEnteredUsername,
} from '@de-care/de-care-use-cases/checkout/state-common';
