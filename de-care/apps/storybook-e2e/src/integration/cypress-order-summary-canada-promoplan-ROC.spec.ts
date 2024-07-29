import { checkQuotes } from '../support/order-summary-helpers';

const runTest = () =>
    checkQuotes(
        {
            currentQuote: {
                presented: true,
                content: {
                    accordionCollapsed: false,
                    packageName: 'Sirius Select',
                    termAndPrice: '6 Months for $29.94',
                    amount: '$29.94',
                    expandedFeesAndTaxes: true,
                    feesAndTaxesAmount: '$9.95',
                    fees: [
                        {
                            text: 'Music Royalty and Administrative Fee',
                            amount: '$5.36'
                        }
                    ],
                    taxes: [
                        {
                            text: 'Harmonized Sales Tax (HST)',
                            amount: '$4.59'
                        }
                    ],
                    linkTotalDueText: 'Total - Due Now',
                    linkTotalDue: '$39.89'
                }
            },
            futureQuote: {
                presented: false
            },
            proRatedRenewalQuote: {
                presented: false
            },
            promoRenewalQuote: {
                presented: false
            },
            renewalQuote: {
                presented: true,
                header: {
                    price: '$22.63',
                    date: 'May 16, 2022'
                },
                content: {
                    accordionCollapsed: false,
                    packageName: 'Sirius Select',
                    termAndPrice: 'Monthly Plan',
                    amount: '$16.99',
                    feesAndTaxesAmount: '$5.64',
                    expandedFeesAndTaxes: true,
                    fees: [
                        {
                            text: 'Music Royalty and Administrative Fee',
                            amount: '$3.04'
                        }
                    ],
                    taxes: [
                        {
                            text: 'Harmonized Sales Tax (HST)',
                            amount: '$2.60'
                        }
                    ],
                    linkTotalDueText: 'Total Due - May 16, 2022',
                    linkTotalDue: '$22.63'
                }
            }
        },
        {
            gst: true
        }
    );

describe('Order summary: Promo plan in Canada ROC', () => {
    it('original', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-promoplan-in-canada-roc').then(() => {
            runTest();
        });
    });
    it('refactored', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-promoplan-in-canada-roc-refactored').then(() => {
            runTest();
        });
    });
});
