import { checkQuotes } from '../support/order-summary-helpers';

const runTest = () =>
    checkQuotes(
        {
            currentQuote: {
                presented: true,
                content: {
                    accordionCollapsed: false,
                    packageName: 'Sirius Select',
                    termAndPrice: 'Trial Upgrade Fee',
                    amount: '$16.99',
                    feesAndTaxesAmount: '$18.64',
                    expandedFeesAndTaxes: false,
                    fees: [
                        {
                            text: 'U.S. Music Royalty Fee',
                            amount: '$3.64'
                        },
                        {
                            text: 'Activation Fees',
                            amount: '$15.00'
                        }
                    ],
                    giftCard: {
                        text: 'Prepaid or Gift Card',
                        amount: '-$150.00'
                    },
                    linkTotalDueText: 'Total - Due Now',
                    linkTotalDue: '$0.00'
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
                    price: '$20.63',
                    date: '09/24/2020'
                },
                content: {
                    accordionCollapsed: false,
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
                    linkTotalDueText: 'Total Due - 09/24/2020',
                    linkTotalDue: '$20.63'
                }
            }
        },
        {
            creditOnAccount: {
                text: 'Credit on Account',
                amount: '$114.37'
            }
        }
    );

describe('Order summary: giftcard', () => {
    it('original', () => {
        cy.visit('/iframe.html?id=quotes--cypress-order-summary-giftcard').then(() => {
            runTest();
        });
    });
    it('refactored', () => {
        cy.visit('/iframe.html?id=quotes--cypress-order-summary-giftcard-refactored').then(() => {
            runTest();
        });
    });
});
