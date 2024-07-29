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
                    price: '$6.76',
                    date: 'August 24, 2021'
                },
                content: {
                    accordionCollapsed: false,
                    packageName: 'Sirius Select',
                    termAndPrice: '6 Months for $5.88/mo',
                    amount: '$5.88',
                    expandedFeesAndTaxes: true,
                    feesAndTaxesAmount: '$0.88',
                    taxes: [
                        {
                            text: 'Goods and Services Tax (GST)',
                            amount: '$0.29'
                        },
                        {
                            text: 'Quebec Sales Tax (QST)',
                            amount: '$0.59'
                        }
                    ],
                    linkTotalDueText: 'Total Due - August 24, 2021',
                    linkTotalDue: '$6.76'
                }
            },
            renewalQuote: {
                presented: true,
                header: {
                    price: '$23.03',
                    date: 'February 24, 2022'
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
                    linkTotalDueText: 'Total Due - February 24, 2022',
                    linkTotalDue: '$23.03'
                }
            }
        },
        {
            gst: true,
            qst: true
        }
    );

describe('Order summary: Canada QC', () => {
    it('original', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-in-canada-qc').then(() => {
            runTest();
        });
    });
    it('refactored', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-in-canada-qc-refactored').then(() => {
            runTest();
        });
    });
});
