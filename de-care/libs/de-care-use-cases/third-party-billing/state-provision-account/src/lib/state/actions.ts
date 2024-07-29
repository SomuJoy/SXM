import { createAction, props } from '@ngrx/store';
import { ThirdPatyBillingEntitlementData } from '@de-care/domains/identity/state-third-party-billing-entitlement';
export const setEntitlementResults = createAction(
    '[Third Party Billing Entitlement] Set entitlement Results',
    props<{ entitlementResults: ThirdPatyBillingEntitlementData }>()
);
export const setEntitlementId = createAction('[Third Party Billing Entitlement] Set Entitlement Id', props<{ entitlementId: string }>());
export const setEntitlementError = createAction('[Third Party Billing Entitlement] Set entitlement error', props<{ error: Error }>());
export const setLoginInfo = createAction('[Third Party Billing Entitlement] Set Login Info', props<{ loginInfo: { email: string; password: string } }>());
export const clearLoginInfo = createAction('[Third Party Billing Entitlement] Clear Login Info');
export const setSelectedPartner = createAction('[Third Party Billing Entitlement] Set Selected Partner', props<{ partnerName: string }>());
