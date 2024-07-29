import { checkQuotes } from '../support/order-summary-helpers';

const runTest = () =>
    checkQuotes({
        currentQuote: {
            presented: true,
            content: {
                accordionCollapsed: false,
                packageName: 'Sirius Select',
                termAndPrice: '6 Months for $4.99/mo',
                amount: '$29.94',
                feesAndTaxesAmount: '$6.41',
                expandedFeesAndTaxes: false,
                fees: [
                    {
                        text: 'U.S. Music Royalty Fee',
                        amount: '$6.41'
                    }
                ],
                linkTotalDueText: 'Total - Due Now',
                linkTotalDue: '$36.35'
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
                price: '$14.56',
                date: '02/27/2021'
            },
            content: {
                accordionCollapsed: false,
                packageName: 'Sirius Select',
                termAndPrice: 'Monthly Plan - Family Discount',
                amount: '$11.99',
                feesAndTaxesAmount: '$2.57',
                expandedFeesAndTaxes: false,
                fees: [
                    {
                        text: 'U.S. Music Royalty Fee',
                        amount: '$2.57'
                    }
                ],
                linkTotalDueText: 'Total Due - 02/27/2021',
                linkTotalDue: '$14.56'
            }
        }
    });

describe('Order summary: MRD', () => {
    it('original', () => {
        cy.visit('/iframe.html?id=quotes--cypress-order-summary-mrd').then(() => {
            runTest();
        });
    });
    it('refactored', () => {
        cy.visit('/iframe.html?id=quotes--cypress-order-summary-mrd-refactored').then(() => {
            runTest();
        });
    });
});
