import {
    e2eContentCardOrderDetailsPackageName,
    e2eContentCardOrderDetailsTermAndPrice,
    e2eContentCardOrderDetailsAmount,
    e2eContentCardOrderDetailsFeesAndTaxesAmount,
    e2eContentCardOrderDetailsDetailsLink,
    e2eContentCardQuoteFeeAmountText,
    e2eContentCardOrderDetailsDetailsLinkFeeAmount,
    e2eContentCardOrderDetailsTotalDueText,
    e2eContentCardOrderDetailsTotalDue,
    e2eOrderSummary,
    e2eSummaryCardNonStudentRecurringCharge,
    e2eOrderSummaryAccordionContentCard,
    e2eContentCreditOnAccount,
    e2eContentGiftCardText,
    e2eContentCardQuoteTaxAmountText,
    e2eContentCardQuoteTaxAmount,
    e2eOrderSummaryGST,
    e2eOrderSummaryQST,
    e2eOrderSummaryAccordion,
    e2eContentPreviousBalance,
    e2eContentDealTypeText,
    e2eContentCurrentQuote,
    e2eContentRenewalQuote,
    e2eContentFutureQuote,
    e2eContentProRatedRenewalQuote,
    e2eContentPromoRenewalQuote
} from '@de-care/domains/quotes/ui-order-summary';

export const cyGetOrderSummary = () => cy.get(e2eOrderSummary);
export const cyGetOrderSummaryGST = () => cy.get(e2eOrderSummaryGST);
export const cyGetOrderSummaryQST = () => cy.get(e2eOrderSummaryQST);
export const cyGetOrderSummaryAccordion = () => cy.get(e2eOrderSummaryAccordion);
export const cyGetNonSudentRecurringCharge = () => cy.get(e2eSummaryCardNonStudentRecurringCharge);
export const cyGetSummaryAccordionContentCard = () => cy.get(e2eOrderSummaryAccordionContentCard);
export const cyGetOrderDetailsPackageName = () => cy.get(e2eContentCardOrderDetailsPackageName);
export const cyGetOrderDetailsTermAndPrice = () => cy.get(e2eContentCardOrderDetailsTermAndPrice);
export const cyGetOrderDetailsAmount = () => cy.get(e2eContentCardOrderDetailsAmount);
export const cyGetOrderDetailsFeesAndTaxesAmount = () => cy.get(e2eContentCardOrderDetailsFeesAndTaxesAmount);
export const cyGetOrderDetailsLinkContent = () => cy.get(e2eContentCardOrderDetailsDetailsLink).get('.accordion-content-wrapper');
export const cyGetOrderDetailsLinkButton = (index: number) =>
    cy
        .get(e2eContentCardOrderDetailsDetailsLink)
        .get('button')
        .eq(index);

export const cyGetOrderDetailsQuoteFeeAmountText = () => cy.get(e2eContentCardQuoteFeeAmountText);
export const cyGetOrderDetailsLinkFeeAmount = () => cy.get(e2eContentCardOrderDetailsDetailsLinkFeeAmount);
export const cyGetOrderDetailsQuoteTaxAmountText = () => cy.get(e2eContentCardQuoteTaxAmountText);
export const cyGetOrderDetailsLinkTaxAmount = () => cy.get(e2eContentCardQuoteTaxAmount);
export const cyGetOrderDetailsTotalDueText = () => cy.get(e2eContentCardOrderDetailsTotalDueText);
export const cyGetOrderDetailsTotalDue = () => cy.get(e2eContentCardOrderDetailsTotalDue);
export const cyGetOderDetailsCreditOnAccount = () => cy.get(e2eContentCreditOnAccount);
export const cyGetOrderDetailsGiftCardText = () => cy.get(e2eContentGiftCardText);
export const cyGetOrderPreviousBalance = () => cy.get(e2eContentPreviousBalance);
export const cyGetOrderDealTypeText = () => cy.get(e2eContentDealTypeText);
export const cyGetCurrentQuote = () => cy.get(e2eContentCurrentQuote);
export const cyGetRenewalQuote = () => cy.get(e2eContentRenewalQuote);
export const cyGetFutureQuote = () => cy.get(e2eContentFutureQuote);
export const cyGetProRatedRenewalQuote = () => cy.get(e2eContentProRatedRenewalQuote);
export const cyGetPromoRenewalQuote = () => cy.get(e2eContentPromoRenewalQuote);
