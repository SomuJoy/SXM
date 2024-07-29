import { createFeatureSelector, createSelector } from '@ngrx/store';
import { customerFeatureKey } from './customer.reducer';
import { CustomerInfo } from './customer.models';

export const customerFeature = createFeatureSelector<CustomerInfo>(customerFeatureKey);

export const getCustomerPersonalInfo = createSelector(customerFeature, customerInfo => customerInfo.personalInfo);

export const getCustomerName = createSelector(getCustomerPersonalInfo, personalInfo => {
    if (personalInfo === null) {
        return null;
    }

    return {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName
    };
});

export const getCustomerEmail = createSelector(getCustomerPersonalInfo, personalInfo => {
    if (personalInfo === null) {
        return null;
    }

    return personalInfo.email;
});
