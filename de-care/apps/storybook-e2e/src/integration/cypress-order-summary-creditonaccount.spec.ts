import { checkQuotes } from '../support/order-summary-helpers';

const runTest = () =>
    checkQuotes(
        {
            currentQuote: {
                presented: false
            },
            futureQuote: {
                presented: true,
                header: {
                    price: '$36.35',
                    date: '08/24/2021'
                },
                content: {
                    accordionCollapsed: false,
                    packageName: 'Sirius Select',
                    termAndPrice: '6 Months for $4.99/mo',
                    amount: '$29.94',
                    feesAndTaxesAmount: '$6.41',
                    expandedFeesAndTaxes: false,
                    fees: [
                        {
                            text: 'U.S. Music Royalty Fee',
                            amount: '$6.41'
                        }
                    ],
                    linkTotalDueText: 'Total Due - 08/24/2021',
                    linkTotalDue: '$36.35'
                }
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
                    price: '$20.63',
                    date: '02/24/2022'
                },
                content: {
                    accordionCollapsed: false,
                    packageName: 'Sirius Select',
                    termAndPrice: 'Monthly Plan',
                    amount: '$16.99',
                    feesAndTaxesAmount: '$3.64',
                    expandedFeesAndTaxes: false,
                    fees: [
                        {
                            text: 'U.S. Music Royalty Fee',
                            amount: '$3.64'
                        }
                    ],
                    linkTotalDueText: 'Total Due - 02/24/2022',
                    linkTotalDue: '$20.63'
                }
            }
        },
        {
            creditOnAccount: {
                text: 'Credit on Account',
                amount: '$50.00'
            }
        }
    );

describe('Order summary: credit on account', () => {
    it('original', () => {
        cy.visit('/iframe.html?id=quotes--cypress-order-summary-creditonaccount').then(() => {
            runTest();
        });
    });
    it('refactored', () => {
        cy.visit('/iframe.html?id=quotes--cypress-order-summary-creditonaccount-refactored').then(() => {
            runTest();
        });
    });
});
