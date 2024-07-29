import { checkQuotes } from '../support/order-summary-helpers';

const runTest = () =>
    checkQuotes(
        {
            currentQuote: {
                presented: true,
                content: {
                    accordionCollapsed: false,
                    packageName: 'Sirius Select',
                    dealType: '+ Amazon Echo Dot',
                    termAndPrice: '12 Months for $4.99/mo',
                    amount: '$4.99',
                    feesAndTaxesAmount: '$1.66',
                    expandedFeesAndTaxes: true,
                    fees: [
                        {
                            text: 'Music Royalty and Administrative Fee',
                            amount: '$0.89'
                        }
                    ],
                    taxes: [
                        {
                            text: 'Harmonized Sales Tax (HST)',
                            amount: '$0.77'
                        }
                    ],
                    linkTotalDueText: 'Total - Due Now',
                    linkTotalDue: '$6.65'
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
                    price: '$6.65',
                    date: 'November 19, 2021'
                },
                content: {
                    accordionCollapsed: false,
                    packageName: 'Sirius Select',
                    termAndPrice: '12 Months for $4.99/mo',
                    amount: '$4.99',
                    feesAndTaxesAmount: '$1.66',
                    expandedFeesAndTaxes: true,
                    fees: [
                        {
                            text: 'Music Royalty and Administrative Fee',
                            amount: '$0.89'
                        }
                    ],
                    taxes: [
                        {
                            text: 'Harmonized Sales Tax (HST)',
                            amount: '$0.77'
                        }
                    ],
                    linkTotalDueText: 'Total Due - November 19, 2021',
                    linkTotalDue: '$6.65'
                }
            },
            renewalQuote: {
                presented: true,
                header: {
                    price: '$22.63',
                    date: 'October 19, 2022'
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
                    linkTotalDueText: 'Total Due - October 19, 2022',
                    linkTotalDue: '$22.63'
                }
            }
        },
        {
            gst: true,
            qst: false
        }
    );

describe('Order summary: megawinback MCP Canada ROC', () => {
    it('original', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-megawinback-mcp-in-canada-roc').then(() => {
            runTest();
        });
    });
    it('refactored', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-megawinback-mcp-in-canada-roc-refactored').then(() => {
            runTest();
        });
    });
});
