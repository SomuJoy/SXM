import { checkQuotes } from '../support/order-summary-helpers';

const runTest = () =>
    checkQuotes({
        currentQuote: {
            presented: true,
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
                linkTotalDueText: 'Total - Due Now',
                linkTotalDue: '$36.35'
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
                date: '02/27/2021'
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
                linkTotalDueText: 'Total Due - 02/27/2021',
                linkTotalDue: '$20.63'
            }
        }
    });

describe('Order summary: promo plan', () => {
    it('original', () => {
        cy.visit('/iframe.html?id=quotes--cypress-order-summary-promoplan').then(() => {
            runTest();
        });
    });
    it('refactored', () => {
        cy.visit('/iframe.html?id=quotes--cypress-order-summary-promoplan-refactored').then(() => {
            runTest();
        });
    });
});
