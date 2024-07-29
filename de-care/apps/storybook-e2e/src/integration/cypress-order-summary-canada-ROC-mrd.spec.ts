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
                    feesAndTaxesAmount: '$9.95',
                    expandedFeesAndTaxes: true,
                    fees: [
                        {
                            text: 'Music Royalty and Administrative Fee',
                            amount: '$5.36'
                        }
                    ],
                    taxes: [
                        {
                            text: 'Harmonized Sales Tax',
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
                    price: '$15.98',
                    date: 'May 16, 2022'
                },
                content: {
                    accordionCollapsed: false,
                    packageName: 'Sirius Select',
                    termAndPrice: 'Monthly Plan - Family Discount',
                    amount: '$11.99',
                    feesAndTaxesAmount: '$3.99',
                    expandedFeesAndTaxes: true,
                    fees: [
                        {
                            text: 'Music Royalty and Administrative Fee ',
                            amount: '$2.15'
                        }
                    ],
                    taxes: [
                        {
                            text: 'Harmonized Sales Tax (HST)',
                            amount: '$1.84'
                        }
                    ],
                    linkTotalDueText: 'Total Due - May 16, 2022',
                    linkTotalDue: '$15.98'
                }
            }
        },
        {
            gst: true
        }
    );

describe('Order summary: MRD in Canada: ROC', () => {
    it('original', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-mrd-in-canada-roc').then(() => {
            runTest();
        });
    });
    it('refactored', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-mrd-in-canada-roc-refactored').then(() => {
            runTest();
        });
    });
});
