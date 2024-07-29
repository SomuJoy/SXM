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
                    termAndPrice: '12 Months for $5.88/mo',
                    amount: '$5.88',
                    feesAndTaxesAmount: '$0.89',
                    expandedFeesAndTaxes: true,
                    taxes: [
                        {
                            text: 'Goods and Services Tax (GST)',
                            amount: '$0.30'
                        },
                        {
                            text: 'Quebec Sales Tax (QST)',
                            amount: '$0.59'
                        }
                    ],
                    linkTotalDueText: 'Total - Due Now',
                    linkTotalDue: '$6.77'
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
                    price: '$6.77',
                    date: 'November 19, 2021'
                },
                content: {
                    accordionCollapsed: false,
                    packageName: 'Sirius Select',
                    termAndPrice: '12 Months for $5.88/mo',
                    amount: '$5.88',
                    feesAndTaxesAmount: '$0.89',
                    expandedFeesAndTaxes: true,
                    taxes: [
                        {
                            text: 'Goods and Services Tax (GST)',
                            amount: '$0.30'
                        },
                        {
                            text: 'Quebec Sales Tax (QST)',
                            amount: '$0.59'
                        }
                    ],
                    linkTotalDueText: 'Total Due - November 19, 2021',
                    linkTotalDue: '$6.77'
                }
            },
            renewalQuote: {
                presented: true,
                header: {
                    price: '$23.03',
                    date: 'October 19, 2022'
                },
                content: {
                    accordionCollapsed: false,
                    packageName: 'Sirius Select',
                    termAndPrice: 'Monthly Plan',
                    amount: '$20.03',
                    feesAndTaxesAmount: '$3.00',
                    expandedFeesAndTaxes: true,
                    taxes: [
                        {
                            text: 'Goods and Services Tax (GST)',
                            amount: '$1.00'
                        },
                        {
                            text: 'Quebec Sales Tax (QST)',
                            amount: '$2.00'
                        }
                    ],
                    linkTotalDueText: 'Total Due - October 19, 2022',
                    linkTotalDue: '$23.03'
                }
            }
        },
        {
            gst: true,
            qst: true
        }
    );

describe('Order summary: megawinback MCP Canada QC', () => {
    it('original', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-megawinback-mcp-in-canada-qc').then(() => {
            runTest();
        });
    });
    it('refactored', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-megawinback-mcp-in-canada-qc-refactored').then(() => {
            runTest();
        });
    });
});
