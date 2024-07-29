import { checkQuotes } from '../support/order-summary-helpers';

const runTest = () =>
    checkQuotes({
        currentQuote: {
            presented: false
        },
        futureQuote: {
            presented: true,
            header: {
                date: '09/07/2021',
                price: '$72.84'
            },
            content: {
                accordionCollapsed: false,
                packageName: 'Sirius Select',
                dealType: '+ Echo Dot',
                termAndPrice: '12 Months for $5.00/mo',
                amount: '$60.00',
                feesAndTaxesAmount: '$12.84',
                expandedFeesAndTaxes: false,
                fees: [
                    {
                        text: 'U.S. Music Royalty Fee',
                        amount: '$12.84'
                    }
                ],
                linkTotalDueText: 'Total Due - 09/07/2021',
                linkTotalDue: '$72.84'
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
                price: '$20.63',
                date: '09/07/2022'
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
                linkTotalDueText: 'Total Due - 09/07/2022',
                linkTotalDue: '$20.63'
            }
        }
    });

describe('Order summary: megawinback', () => {
    it('original', () => {
        cy.visit('/iframe.html?id=quotes--cypress-order-summary-megawinback').then(() => {
            runTest();
        });
    });
    it('refactored', () => {
        cy.visit('/iframe.html?id=quotes--cypress-order-summary-megawinback-refactored').then(() => {
            runTest();
        });
    });
});
