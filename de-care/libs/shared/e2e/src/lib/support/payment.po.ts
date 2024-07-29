import { e2eBillingAddressModal, e2ePaymentInfoUseExistingCard } from '@de-care/customer-info';

export const cyGetPaymentInfoUseExistingCard = () => cy.get(e2ePaymentInfoUseExistingCard);
export const cyGetE2EBillingAddressModal = () => cy.get(e2eBillingAddressModal);
