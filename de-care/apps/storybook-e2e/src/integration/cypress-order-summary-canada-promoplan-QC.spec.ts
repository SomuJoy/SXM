import { checkQuotes } from '../support/order-summary-helpers';

const runTest = () =>
    checkQuotes(
        {
            currentQuote: {
                presented: true,
                content: {
                    accordionCollapsed: false,
                    packageName: 'Sirius Select',
                    termAndPrice: '6 Months for $35.30',
                    amount: '$35.30',
                    expandedFeesAndTaxes: true,
                    feesAndTaxesAmount: '$5.29',
                    taxes: [
                        {
                            text: 'Goods and Services Tax (GST)',
                            amount: '$1.77'
                        },
                        {
                            text: 'Quebec Sales Tax (QST)',
                            amount: '$3.52'
                        }
                    ],
                    linkTotalDueText: 'Total - Due Now',
                    linkTotalDue: '$40.59'
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
                    price: '$23.03',
                    date: 'May 16, 2022'
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
                    linkTotalDueText: 'Total Due - May 16, 2022',
                    linkTotalDue: '$23.03'
                }
            }
        },
        {
            gst: true,
            qst: true
        }
    );

describe('Order summary: Promo plan in Canada: QC', () => {
    it('original', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-promoplan-in-canada-qc').then(() => {
            runTest();
        });
    });
    it('refactored', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-promoplan-in-canada-qc-refactored').then(() => {
            runTest();
        });
    });
});
