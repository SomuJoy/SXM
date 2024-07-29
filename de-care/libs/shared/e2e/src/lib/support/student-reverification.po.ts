import {
    e2eActiveSubscriptionPagePageComponent,
    e2eActiveSubscriptionPageHeading,
    e2eActiveSubscriptionPageMaskedUserName,
    e2eActiveSubscriptionPagePackageName
} from '@de-care/de-care-use-cases/student-verification/feature-confirm-re-verify';

export const cyGetActiveSubscriptionPagePageComponent = () => cy.get(e2eActiveSubscriptionPagePageComponent);
export const cyGetActiveSubscriptionPageHeading = () => cy.get(e2eActiveSubscriptionPageHeading);
export const cyGetActiveSubscriptionPageMaskedUserName = () => cy.get(e2eActiveSubscriptionPageMaskedUserName);
export const cyGetActiveSubscriptionPagePackageName = () => cy.get(e2eActiveSubscriptionPagePackageName);
