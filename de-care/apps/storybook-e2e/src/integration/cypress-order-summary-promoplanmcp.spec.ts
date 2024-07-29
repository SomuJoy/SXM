import { checkQuotes } from '../support/order-summary-helpers';

const runTest = () =>
    checkQuotes({
        currentQuote: {
            presented: true,
            content: {
                accordionCollapsed: false,
                packageName: 'Sirius Select Lite',
                termAndPrice: '12 Months for $5.99/mo',
                amount: '$5.99',
                feesAndTaxesAmount: '$1.76',
                expandedFeesAndTaxes: false,
                fees: [
                    {
                        text: 'U.S. Music Royalty Fee',
                        amount: '$1.28'
                    }
                ],
                taxes: [
                    {
                        text: 'State Tax',
                        amount: '$0.48'
                    }
                ],
                linkTotalDueText: 'Total - Due Now',
                linkTotalDue: '$7.75'
            }
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
                price: '$7.75',
                date: '09/27/2020'
            },
            content: {
                accordionCollapsed: true,
                packageName: 'Sirius Select Lite',
                termAndPrice: '12 Months for $5.99/mo',
                amount: '$5.99',
                feesAndTaxesAmount: '$1.76',
                expandedFeesAndTaxes: false,
                fees: [
                    {
                        text: 'U.S. Music Royalty Fee',
                        amount: '$1.28'
                    }
                ],
                taxes: [
                    {
                        text: 'State Tax',
                        amount: '0.48'
                    }
                ],
                linkTotalDueText: 'Total Due - 09/27/2020',
                linkTotalDue: '$7.75'
            }
        },
        renewalQuote: {
            presented: true,
            header: {
                price: '$22.00',
                date: '08/27/2021'
            },
            content: {
                accordionCollapsed: false,
                packageName: 'Sirius Select',
                termAndPrice: 'Monthly Plan',
                amount: '$16.99',
                feesAndTaxesAmount: '$5.01',
                expandedFeesAndTaxes: false,
                fees: [
                    {
                        text: 'U.S. Music Royalty Fee',
                        amount: '$3.64'
                    }
                ],
                taxes: [
                    {
                        text: 'State Tax',
                        amount: '$1.37'
                    }
                ],
                linkTotalDueText: 'Total Due - 08/27/2021',
                linkTotalDue: '$22.00'
            }
        }
    });

describe('Order summary: promo MCP', () => {
    it('original', () => {
        cy.visit('/iframe.html?id=quotes--cypress-order-summary-promomcp').then(() => {
            runTest();
        });
    });
    it('refactored', () => {
        cy.visit('/iframe.html?id=quotes--cypress-order-summary-promomcp-refactored').then(() => {
            runTest();
        });
    });
});
