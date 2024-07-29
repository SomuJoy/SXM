import { checkQuotes } from '../support/order-summary-helpers';

const runTest = () =>
    checkQuotes({
        currentQuote: {
            presented: true,
            content: {
                accordionCollapsed: false,
                packageName: 'XM Select',
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
                previousBalance: {
                    amount: '$199.99',
                    text: 'Previous Balance'
                },
                linkTotalDueText: 'Total - Due Now',
                linkTotalDue: '$236.34'
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
                price: '$20.63',
                date: '02/28/2021'
            },
            content: {
                accordionCollapsed: false,
                packageName: 'XM Select',
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
                linkTotalDueText: 'Total Due - 02/28/2021',
                linkTotalDue: '$20.63'
            }
        }
    });

describe('Order summary: account balance', () => {
    it('original', () => {
        cy.visit('/iframe.html?id=quotes--cypress-order-summary-accountbalance').then(() => {
            runTest();
        });
    });
    it('refactored', () => {
        cy.visit('/iframe.html?id=quotes--cypress-order-summary-accountbalance-refactored').then(() => {
            runTest();
        });
    });
});
