import { checkQuotes } from '../support/order-summary-helpers';

const runTest = () =>
    checkQuotes(
        {
            currentQuote: {
                presented: false
            },
            futureQuote: {
                presented: false
            },
            proRatedRenewalQuote: {
                presented: false
            },
            promoRenewalQuote: {
                presented: true,
                header: {
                    price: '$6.64',
                    date: 'August 24, 2021'
                },
                content: {
                    accordionCollapsed: false,
                    packageName: 'Sirius Select',
                    termAndPrice: '6 Months for $4.99/mo',
                    amount: '$4.99',
                    expandedFeesAndTaxes: true,
                    feesAndTaxesAmount: '$1.65',
                    fees: [
                        {
                            text: 'Music Royalty and Administrative Fee',
                            amount: '$0.89'
                        }
                    ],
                    taxes: [
                        {
                            text: 'Harmonized Sales Tax (HST)',
                            amount: '$0.76'
                        }
                    ],
                    linkTotalDueText: 'Total Due - August 24, 2021',
                    linkTotalDue: '$6.64'
                }
            },
            renewalQuote: {
                presented: true,
                header: {
                    price: '$22.63',
                    date: 'February 24, 2022'
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
                    linkTotalDueText: 'Total Due - February 24, 2022',
                    linkTotalDue: '$22.63'
                }
            }
        },
        {
            gst: true
        }
    );

describe('Order summary: Canada ROC', () => {
    it('original', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-in-canada-roc').then(() => {
            runTest();
        });
    });
    it('refactored', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-in-canada-roc-refactored').then(() => {
            runTest();
        });
    });
});
