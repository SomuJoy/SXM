import { checkQuotes } from '../support/order-summary-helpers';

const runTest = () =>
    checkQuotes({
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
                price: '$7.27',
                date: '08/21/2021'
            },
            content: {
                accordionCollapsed: false,
                packageName: 'Sirius Select',
                termAndPrice: '12 Months for $5.99/mo',
                amount: '$5.99',
                feesAndTaxesAmount: '$1.28',
                expandedFeesAndTaxes: false,
                fees: [
                    {
                        text: 'U.S. Music Royalty Fee',
                        amount: '$1.28'
                    }
                ],
                linkTotalDueText: 'Total Due - 08/21/2021',
                linkTotalDue: '$7.27'
            }
        },
        renewalQuote: {
            presented: true,
            header: {
                price: '$20.63',
                date: '08/21/2022'
            },
            content: {
                accordionCollapsed: true,
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
                linkTotalDueText: 'Total Due - 08/21/2022',
                linkTotalDue: '$20.63'
            }
        }
    });

describe('Order summary: MCP', () => {
    it('original', () => {
        cy.visit('/iframe.html?id=quotes--cypress-order-summary-mcp').then(() => {
            runTest();
        });
    });
    it('refactored', () => {
        cy.visit('/iframe.html?id=quotes--cypress-order-summary-mcp-refactored').then(() => {
            runTest();
        });
    });
});
