import {
    e2ePurchasePaymentInfoComponent,
    e2ePurchaseReviewOrderComponent,
    e2ePurchaseAccordionItem,
    e2ePurchaseAccordionItemTitle,
    e2ePurchaseAccordionItemContent,
    e2ePurchaseAccordionContent
} from '@de-care/purchase';

export const cyGetPurchasePaymentInfoComponent = () => cy.get(e2ePurchasePaymentInfoComponent);
export const cyGetPurchaseReviewOrderComponent = () => cy.get(e2ePurchaseReviewOrderComponent);
export const cyGetPurchaseAccordionItem = () => cy.get(e2ePurchaseAccordionItem);
export const cyGetPurchaseAccordionItemTitle = () => cy.get(e2ePurchaseAccordionItemTitle);
export const cyGetPurchaseAccordionItemContent = () => cy.get(e2ePurchaseAccordionItemContent);
export const cyGetPurchaseAccordionContent = () => cy.get(e2ePurchaseAccordionContent);
