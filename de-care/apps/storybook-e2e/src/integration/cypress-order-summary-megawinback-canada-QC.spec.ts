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
                    date: 'October 19, 2022',
                    price: '$81.34'
                },
                content: {
                    accordionCollapsed: false,
                    packageName: 'Sirius Select',
                    dealType: '+ Amazon Echo Dot',
                    termAndPrice: '12 Months for $70.74',
                    amount: '$70.74',
                    feesAndTaxesAmount: '$10.60',
                    expandedFeesAndTaxes: true,
                    taxes: [
                        {
                            text: 'Goods and Services Tax (GST)',
                            amount: '$3.54'
                        },
                        {
                            text: 'Quebec Sales Tax (QST)',
                            amount: '$7.06'
                        }
                    ],
                    linkTotalDueText: 'Total Due - October 19, 2022',
                    linkTotalDue: '$81.34'
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
                    price: '$23.03',
                    date: 'October 19, 2023'
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
                    linkTotalDueText: 'Total Due - October 19, 2023',
                    linkTotalDue: '$23.03'
                }
            }
        },
        {
            gst: true,
            qst: true
        }
    );

describe('Order summary: megawinback Canada QC', () => {
    it('original', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-megawinback-in-canada-qc').then(() => {
            runTest();
        });
    });
    it('refactored', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-megawinback-in-canada-qc-refactored').then(() => {
            runTest();
        });
    });
});
