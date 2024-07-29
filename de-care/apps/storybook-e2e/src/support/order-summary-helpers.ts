import { sxmEnsureNoMissingTranslations } from '@de-care/shared/e2e';
import {
    cyGetOrderDetailsPackageName,
    cyGetOrderDetailsTermAndPrice,
    cyGetOrderDetailsAmount,
    cyGetOrderDetailsFeesAndTaxesAmount,
    cyGetOrderDetailsQuoteFeeAmountText,
    cyGetOrderDetailsLinkButton,
    cyGetOrderDetailsLinkFeeAmount,
    cyGetOrderDetailsTotalDueText,
    cyGetOrderDetailsTotalDue,
    cyGetOrderDetailsGiftCardText,
    cyGetOrderDetailsQuoteTaxAmountText,
    cyGetOrderDetailsLinkTaxAmount,
    cyGetOrderDetailsLinkContent,
    cyGetSummaryAccordionContentCard,
    cyGetNonSudentRecurringCharge,
    cyGetOrderSummaryAccordion,
    cyGetOrderPreviousBalance,
    cyGetOrderDealTypeText,
    cyGetOrderSummary,
    cyGetOrderSummaryGST,
    cyGetOrderSummaryQST,
    cyGetOderDetailsCreditOnAccount
} from './order-summary-po';

interface QuoteContentHeader {
    price?: string;
    date?: string;
}

interface QuoteItemContents {
    text: string;
    amount: string;
}

interface QuoteContent {
    dealType?: string;
    accordionCollapsed: boolean;
    packageName: string;
    termAndPrice: string;
    amount: string;
    expandedFeesAndTaxes: boolean;
    fees?: QuoteItemContents[];
    taxes?: QuoteItemContents[];
    giftCard?: QuoteItemContents;
    previousBalance?: QuoteItemContents;
    feesAndTaxesAmount: string;
    linkTotalDueText: string;
    linkTotalDue: string;
}

interface QuoteParamsPresented {
    presented: true;
    header?: QuoteContentHeader;
    content: QuoteContent;
}

interface QuoteParamsNonPresented {
    presented: false;
}

type QuoteParams = QuoteParamsPresented | QuoteParamsNonPresented;

export function checkQuotes(
    quotes: {
        currentQuote: QuoteParams;
        futureQuote: QuoteParams;
        proRatedRenewalQuote: QuoteParams;
        promoRenewalQuote: QuoteParams;
        renewalQuote: QuoteParams;
    },
    options?: {
        qst?: boolean;
        gst?: boolean;
        creditOnAccount?: QuoteItemContents;
    }
): void {
    cyGetOrderSummary()
        .should('be.visible')
        .then(() => {
            sxmEnsureNoMissingTranslations();
            for (const quoteType in quotes) {
                if (quotes[quoteType]) {
                    checkSpecificQuote(quoteType, quotes[quoteType]);
                }
            }
            checkCreditOnAccount(options?.creditOnAccount);
            checkQstGst(options?.qst, options?.gst);
        });
}

function checkSpecificQuote(quoteType: string, quoteParams: QuoteParams): void {
    const quote = cy.get(`[data-e2e="${quoteType}"]`);
    if (quoteParams.presented) {
        quote
            .should('exist')
            .should('be.visible')
            .within(() => {
                checkTitle(quoteParams.header);
                checkQuoteContent(quoteParams.content);
            });
    } else {
        quote.should('not.exist');
    }
}

function checkQstGst(qst: boolean, gst: boolean): void {
    if (qst) {
        cyGetOrderSummaryQST()
            .should('exist')
            .should('be.visible');
    } else {
        cyGetOrderSummaryQST().should('not.be.visible');
    }

    if (gst) {
        cyGetOrderSummaryGST()
            .should('exist')
            .should('be.visible');
    } else {
        cyGetOrderSummaryGST().should('not.be.visible');
    }
}

function checkCreditOnAccount(creditOnAccount?: QuoteItemContents) {
    if (creditOnAccount) {
        cyGetOderDetailsCreditOnAccount()
            .should('exist')
            .should('be.visible')
            .should('contain', creditOnAccount.text)
            .should('contain', creditOnAccount.amount);
    } else {
        cyGetOderDetailsCreditOnAccount().should('not.exist');
    }
}

function checkTitle(header?: QuoteContentHeader): void {
    const title = cyGetNonSudentRecurringCharge();
    if (header) {
        title
            .should('be.visible')
            .should('contain', header.price)
            .should('contain', header.date);
    } else {
        title.should('not.be.visible');
    }
}

function checkQuoteContent(params: QuoteContent): void {
    let contentCard = cyGetSummaryAccordionContentCard();

    if (params.accordionCollapsed) {
        contentCard.should('not.be.visible');
        cyGetOrderSummaryAccordion()
            .should('exist')
            .within(() => {
                cy.get('button')
                    .eq(2)
                    .click({ force: true });
            });
        // element didnt exist at this point, we need to search it again
        contentCard = cyGetSummaryAccordionContentCard();
    } else {
        contentCard.should('be.visible');
    }

    contentCard.within(() => {
        cyGetOrderDetailsPackageName().should('contain', params.packageName);

        checkDealType(params.dealType);

        cyGetOrderDetailsTermAndPrice().should('contain', params.termAndPrice);

        cyGetOrderDetailsAmount()
            .eq(0)
            .should('contain', params.amount);

        cyGetOrderDetailsFeesAndTaxesAmount().should('contain', params.feesAndTaxesAmount);

        if (!params.expandedFeesAndTaxes) {
            cyGetOrderDetailsLinkContent().should('not.be.visible');
            cyGetOrderDetailsLinkButton(1).click({ force: true });
        }
        cyGetOrderDetailsLinkContent()
            .should('be.visible')
            .then(() => {
                if (params.fees) {
                    cyGetOrderDetailsQuoteFeeAmountText().should('have.length', params.fees.length);
                    cyGetOrderDetailsLinkFeeAmount().should('have.length', params.fees.length);
                    params.fees.forEach((fee, index) => {
                        cyGetOrderDetailsQuoteFeeAmountText()
                            .eq(index)
                            .should('contain', fee.text);
                        cyGetOrderDetailsLinkFeeAmount()
                            .eq(index)
                            .should('contain', fee.amount);
                    });
                }
                if (params.taxes) {
                    cyGetOrderDetailsQuoteTaxAmountText().should('have.length', params.taxes.length);
                    cyGetOrderDetailsLinkTaxAmount().should('have.length', params.taxes.length);
                    params.taxes.forEach((tax, index) => {
                        cyGetOrderDetailsQuoteTaxAmountText()
                            .eq(index)
                            .should('contain', tax.text);
                        cyGetOrderDetailsLinkTaxAmount()
                            .eq(index)
                            .should('contain', tax.amount);
                    });
                }
            });

        checkGiftCard(params.giftCard);

        checkPrevBalance(params.previousBalance);

        cyGetOrderDetailsTotalDueText().should('contain', params.linkTotalDueText);
        cyGetOrderDetailsTotalDue().should('contain', params.linkTotalDue);
    });
}

function checkDealType(dealType: string): void {
    if (dealType) {
        cyGetOrderDealTypeText().should('contain', dealType);
    } else {
        cyGetOrderDealTypeText().should('not.be.visible');
    }
}

function checkGiftCard(giftCard: QuoteItemContents): void {
    if (giftCard) {
        cyGetOrderDetailsGiftCardText().should('contain', giftCard.text);
        cyGetOrderDetailsAmount()
            .eq(1)
            .should('contain', giftCard.amount);
    } else {
        cyGetOrderDetailsGiftCardText().should('not.be.visible');
    }
}

function checkPrevBalance(previousBalance: QuoteItemContents): void {
    if (previousBalance) {
        cyGetOrderPreviousBalance().should('contain', previousBalance.text);
        cyGetOrderDetailsAmount()
            .eq(1)
            .should('contain', previousBalance.amount);
    } else {
        cyGetOrderPreviousBalance().should('not.be.visible');
    }
}
