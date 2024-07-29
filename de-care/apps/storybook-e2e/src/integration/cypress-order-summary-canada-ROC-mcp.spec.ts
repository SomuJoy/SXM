import { checkQuotes } from '../support/order-summary-helpers';

const runTest = () =>
    checkQuotes(
        {
            currentQuote: {
                presented: true,
                content: {
                    accordionCollapsed: false,
                    packageName: 'Sirius Select',
                    termAndPrice: '6 Months for $4.99/mo',
                    amount: '$4.99',
                    feesAndTaxesAmount: '$1.65',
                    expandedFeesAndTaxes: true,
                    fees: [
                        {
                            text: 'Music Royalty and Administrative Fee',
                            amount: '$0.89'
                        }
                    ],
                    taxes: [
                        {
                            text: 'Harmonized Sales Tax',
                            amount: '$0.76'
                        }
                    ],
                    linkTotalDueText: 'Total - Due Now',
                    linkTotalDue: '$6.64'
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
                    price: '$6.64',
                    date: 'December 16, 2021'
                },
                content: {
                    accordionCollapsed: false,
                    packageName: 'Sirius Select',
                    termAndPrice: '6 Months for $4.99/mo',
                    amount: '$4.99',
                    feesAndTaxesAmount: '$1.65',
                    expandedFeesAndTaxes: true,
                    fees: [
                        {
                            text: 'Music Royalty and Administrative Fee ',
                            amount: '$0.89'
                        }
                    ],
                    taxes: [
                        {
                            text: 'Harmonized Sales Tax (HST)',
                            amount: '$0.76'
                        }
                    ],
                    linkTotalDueText: 'Total Due - December 16, 2021',
                    linkTotalDue: '$6.64'
                }
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

describe('Order summary: MCP in Canada: ROC', () => {
    it('original', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-mcp-in-canada-roc').then(() => {
            runTest();
        });
    });
    it('refactored', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-mcp-in-canada-roc-refactored').then(() => {
            runTest();
        });
    });
});
