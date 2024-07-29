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
                    price: '$79.93'
                },
                content: {
                    accordionCollapsed: false,
                    packageName: 'Sirius Select',
                    dealType: '+ Amazon Echo Dot',
                    termAndPrice: '12 Months for $60.00',
                    amount: '$60.00',
                    feesAndTaxesAmount: '$19.93',
                    expandedFeesAndTaxes: true,
                    fees: [
                        {
                            text: 'Music Royalty and Administrative Fee',
                            amount: '$10.74'
                        }
                    ],
                    taxes: [
                        {
                            text: 'Harmonized Sales Tax (HST)',
                            amount: '$9.19'
                        }
                    ],
                    linkTotalDueText: 'Total Due - October 19, 2022',
                    linkTotalDue: '$79.93'
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
                    price: '$22.63',
                    date: 'October 19, 2023'
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
                    linkTotalDueText: 'Total Due - October 19, 2023',
                    linkTotalDue: '$22.63'
                }
            }
        },
        {
            gst: true,
            qst: false
        }
    );

describe('Order summary: megawinback Canada ROC', () => {
    it('original', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-megawinback-in-canada-roc').then(() => {
            runTest();
        });
    });
    it('refactored', () => {
        cy.visit('/iframe.html?id=quotes-ca--cypress-order-summary-megawinback-in-canada-roc-refactored').then(() => {
            runTest();
        });
    });
});
