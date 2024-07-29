import {
    e2eOrderSummary,
    e2eOrderSummarySummmaryCard,
    e2eSummaryCardNonStudentRecurringCharge,
    e2eOrderSummaryAccordion,
    e2eOrderSummaryAccordionContentCard,
    e2eContentCardStudentCurrentQuoteRecurringCharge,
    e2eOrderSummaryImportantInfo,
    e2eContentCardOrderDetailsPackageName,
    e2eContentCardOrderDetailsTermAndPrice,
    e2eContentCardOrderDetailsAmount,
    e2eContentCardOrderDetailsFeesAndTaxesAmount,
    e2eContentCardOrderDetailsTotalDue,
    e2eContentCardOrderDetailsDetailsLink,
    e2eContentCardOrderDetailsDetailsLinkFeeAmount,
    e2eContentCardOrderDetailsDetailsLinkTaxAmount,
    e2eContentCardOrderDetailsTotalDueText
} from '@de-care/domains/quotes/ui-order-summary';

export const cyGetOrderSummary = () => cy.get(e2eOrderSummary);
export const cyGetOrderSummarySummmaryCard = () => cy.get(e2eOrderSummarySummmaryCard);
export const cyGetSummaryCardNonStudentRecurringCharge = () => cy.get(e2eSummaryCardNonStudentRecurringCharge);
export const cyGetOrderSummaryAccordion = () => cy.get(e2eOrderSummaryAccordion);
export const cyGetOrderSummaryAccordionContentCard = () => cy.get(e2eOrderSummaryAccordionContentCard);
export const cyGetContentCardStudentCurrentQuoteRecurringCharge = () => cy.get(e2eContentCardStudentCurrentQuoteRecurringCharge);
export const cyGetOrderSummaryImportantInfo = () => cy.get(e2eOrderSummaryImportantInfo);
export const cyGetContentCardOrderDetailsPackageName = () => cy.get(e2eContentCardOrderDetailsPackageName);
export const cyGetContentCardOrderDetailsTermAndPrice = () => cy.get(e2eContentCardOrderDetailsTermAndPrice);
export const cyGetContentCardOrderDetailsAmount = () => cy.get(e2eContentCardOrderDetailsAmount);
export const cyGetContentCardOrderDetailsFeesAndTaxesAmount = () => cy.get(e2eContentCardOrderDetailsFeesAndTaxesAmount);
export const cyGetContentCardOrderDetailsTotalDue = () => cy.get(e2eContentCardOrderDetailsTotalDue);
export const cyGetContentCardOrderDetailsTotalDueText = () => cy.get(e2eContentCardOrderDetailsTotalDueText);
export const cyGetContentCardOrderDetailsDetailsLink = () => cy.get(e2eContentCardOrderDetailsDetailsLink);
export const cyGetContentCardOrderDetailsDetailsLinkFeeAmount = () => cy.get(e2eContentCardOrderDetailsDetailsLinkFeeAmount);
export const cyGetContentCardOrderDetailsDetailsLinkTaxAmount = () => cy.get(e2eContentCardOrderDetailsDetailsLinkTaxAmount);
