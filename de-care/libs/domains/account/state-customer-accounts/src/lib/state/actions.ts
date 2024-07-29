import { createAction, props } from '@ngrx/store';
import { CustomerAccountListAccount, CustomerAccountsListRequest } from '../data-services/customer-accounts-list.interface';
import { LoadCustomerAccountsListWorkflowStatus } from './constants';

export const loadCustomerAccounts = createAction('[Customer Accounts] Load customer accounts', props<{ customerInfo: CustomerAccountsListRequest }>());
export const setAllCustomerAccounts = createAction('[Customer Accounts] Set all customer accounts', props<{ customerAccounts: CustomerAccountListAccount[] }>());

export const setCustomerAccountsRequestStatus = createAction(
    '[Customer Accounts] Set Customer Accunt List request status',
    props<{ status: LoadCustomerAccountsListWorkflowStatus }>()
);

export const setSuccessfulCustomerAccountRequest = createAction('[Customer Accounts] Successful Account List request');
export const setFailedCustomerAccountRequest = createAction('[Customer Accounts] Failed Account List request', props<{ errorCode: string }>());
export const setSystemErrorInAccountRequest = createAction('[Customer Accounts] System Error in Account Request');
export const setInvalidPhoneNumberInAccountRequest = createAction('[Customer Accounts] Invalid Phone Number in Account Request');
