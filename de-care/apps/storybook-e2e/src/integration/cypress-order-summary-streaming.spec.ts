import { checkQuotes } from '../support/order-summary-helpers';

const runTest = () =>
    checkQuotes({
        currentQuote: {
            presented: true,
            content: {
                accordionCollapsed: false,
                packageName: 'SiriusXM Essential Streaming',
                termAndPrice: '3 Months for $0.33/mo',
                amount: '$0.99',
                feesAndTaxesAmount: '$0.09',
                expandedFeesAndTaxes: false,
                fees: [
                    {
                        text: 'U.S. Music Royalty Fee',
                        amount: '$0.09'
                    }
                ],
                linkTotalDueText: 'Total - Due Now',
                linkTotalDue: '$1.08'
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
                price: '$8.70',
                date: '11/24/2020'
            },
            content: {
                accordionCollapsed: false,
                packageName: 'SiriusXM Essential Streaming',
                termAndPrice: 'Monthly Plan',
                amount: '$8.00',
                feesAndTaxesAmount: '$0.70',
                expandedFeesAndTaxes: false,
                fees: [
                    {
                        text: 'U.S. Music Royalty Fee',
                        amount: '$0.70'
                    }
                ],
                linkTotalDueText: 'Total Due - 11/24/2020',
                linkTotalDue: '$8.70'
            }
        }
    });

describe('Order summary: streaming', () => {
    it('original', () => {
        cy.visit('/iframe.html?id=quotes--cypress-order-summary-streaming').then(() => {
            runTest();
        });
    });
    it('refactored', () => {
        cy.visit('/iframe.html?id=quotes--cypress-order-summary-streaming-refactored').then(() => {
            runTest();
        });
    });
});
