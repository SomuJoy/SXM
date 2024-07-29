import {
    cyGetCCAddress,
    cyGetCCCardNumberTextfield,
    cyGetCCCity,
    cyGetCCExpDateOnCardTextfield,
    cyGetCCNameOnCardTextfield,
    cyGetCCState,
    cyGetCCZipCode,
    cyGetChargeAgreementCheckbox,
    cyGetContentCardOrderDetailsAmount,
    cyGetContentCardOrderDetailsFeesAndTaxesAmount,
    cyGetContentCardOrderDetailsTermAndPrice,
    cyGetContentCardOrderDetailsTotalDue,
    cyGetContentCardStudentCurrentQuoteRecurringCharge,
    cyGetCreateLoginEmailTextfield,
    cyGetFlepzFirstNameTextfield,
    cyGetFlepzLastNameTextfield,
    cyGetFlepzPhoneNumberTextfield,
    cyGetOfferDescriptionFooter,
    cyGetOfferDetails,
    cyGetOfferPromoPriceAndTerm,
    cyGetOrderSummary,
    cyGetOrderSummaryAccordionContentCard,
    cyGetPaymentConfirmationButton,
    cyGetPaymentFormComponent,
    cyGetPersonalInfo,
    cyGetPurchaseAccordionItem,
    cyGetPurchaseAccordionItemContent,
    cyGetPurchaseAccordionItemTitle,
    cyGetPurchasePaymentInfoComponent,
    cyGetPurchaseReviewOrderComponent,
    cyGetReviewOrderCompleteButton,
    cyGetSxmUIPassword,
    getAliasForURL,
    getIsCanada,
    mockResponseAllPackageDesc,
    mockResponseCustomerInfoAddressCCAdressNotFound,
    mockResponseEnvInfo,
    mockResponseStudentStreamingUSSuccess,
    mockRoutesFromHAR,
    sxmCheckPageLocation
} from '@de-care/shared/e2e';
import { e2eSxmDropDownItem } from '@de-care/shared/sxm-ui/ui-dropdown-form-field';

// TODO: We need to avoid using { force: true } but this requires more work on the styling of the pages.

const fillOutForm = () => {
    cyGetFlepzPhoneNumberTextfield()
        .should('be.visible')
        .clear({ force: true })
        .type('2222222222', { force: true });

    cyGetFlepzFirstNameTextfield()
        .clear({ force: true })
        .type('john', { force: true });

    cyGetFlepzLastNameTextfield().type('smith', { force: true });

    cyGetCCAddress()
        .first()
        .type('1525 Drury Lane', { force: true });

    cyGetCCCity()
        .first()
        .type('Colorado Springs', { force: true });

    cyGetCCState()
        .first()
        .click({ force: true })
        .find(e2eSxmDropDownItem)
        .first()
        .click({ force: true });

    cyGetCCZipCode()
        .first()
        .type('81914', { force: true });

    cyGetCCNameOnCardTextfield().type('john smith', { force: true });

    cyGetCCCardNumberTextfield().type('4111111111111111', { force: true });

    cyGetCCExpDateOnCardTextfield().type('05/25', { force: true });

    cyGetCreateLoginEmailTextfield()
        .clear({ force: true })
        .type(`htodd${+Date.now()}@siriusxm.com`, { force: true });

    cyGetSxmUIPassword().type('coFF33=C0D3', { force: true });
};

function verifyPreFillData() {
    cyGetFlepzFirstNameTextfield().should('have.value', mockResponseStudentStreamingUSSuccess.data.firstName);
    cyGetFlepzLastNameTextfield().should('have.value', mockResponseStudentStreamingUSSuccess.data.lastName);
    cyGetCreateLoginEmailTextfield().should('have.value', mockResponseStudentStreamingUSSuccess.data.email);
}

function checkReviewPage() {
    cyGetPurchaseAccordionItemContent()
        .first()
        .should('be.hidden');

    cyGetOfferPromoPriceAndTerm().should(elem => expect(elem.text()).to.equal('6 months for $1'));
    cyGetOfferDescriptionFooter().should(elem => expect(elem.text()).to.equal(''));

    cyGetPurchaseAccordionItem().within(accordionItems => {
        expect(accordionItems.children.length).to.equal(2);

        const step1 = accordionItems.eq(0);
        expect(step1.find('[data-e2e="purchaseAccordionItemTitle"]').text()).to.contain('1. Your billing information');

        // This next one will execute async
        cy.wrap(step1.find('[data-e2e="purchaseAccordionItemContent"]')).then(content => {
            expect(content.attr('aria-hidden')).to.equal('true');
            expect(content.attr('aria-expanded')).to.equal('false');
        });

        const step2 = accordionItems.eq(1);
        expect(step2.find('[data-e2e="purchaseAccordionItemTitle"]').text()).to.contain('2. Review and complete your order');

        // This next one will execute async
        cy.wrap(step2.find('[data-e2e="purchaseAccordionItemContent"]')).then(content => {
            expect(content.attr('aria-hidden')).to.equal('false');
            expect(content.attr('aria-expanded')).to.equal('true');
        });
    });

    cy.sxmEnsureNoMissingTranslations();
}

function checkOrderDetails(opts: { isReviewPage: boolean }) {
    cyGetOrderSummary().should('be.visible');

    cyGetOrderSummaryAccordionContentCard()
        .should('have.length', 2)
        .first()
        .within(() => {
            cyGetContentCardOrderDetailsAmount().should('contain', '$1.00');
            cyGetContentCardOrderDetailsTermAndPrice().should('contain', '6 Months for $0.17/mo');
            cyGetContentCardOrderDetailsFeesAndTaxesAmount().should('contain', '$0.09');
            cyGetContentCardOrderDetailsTotalDue().should('contain', '$1.09');
        });
    cyGetContentCardStudentCurrentQuoteRecurringCharge().should('contain', '$4.35 starting on 03/03/2021');
    cyGetOrderSummaryAccordionContentCard()
        .eq(1)
        .should(opts.isReviewPage && !getIsCanada() ? 'not.be.visible' : 'be.visible')
        .within(() => {
            cyGetContentCardOrderDetailsAmount().should('contain', '$4.00');
            cyGetContentCardOrderDetailsTermAndPrice().should('contain', '12 Months for $4.00/mo');
            cyGetContentCardOrderDetailsFeesAndTaxesAmount().should('contain', '$0.35');
            cyGetContentCardOrderDetailsTotalDue().should('contain', '$4.35');
        });
}

function checkConfirmationPage() {
    sxmCheckPageLocation('/subscribe/checkout/thanks');

    cy.get('app-thanks').should('be.visible');
    cy.sxmEnsureNoMissingTranslations();

    cyGetPersonalInfo().should('contain', 'Username: (hto******@siriusxm.com)');
}

describe('Student Streaming', () => {
    let mocksFromHAR: any;

    beforeEach(() => {
        cy.server();
        cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers/all-package-desc`, mockResponseAllPackageDesc);
        cy.route('GET', `${Cypress.env('microservicesEndpoint')}/services/utility/env-info`, mockResponseEnvInfo);

        mocksFromHAR = mockRoutesFromHAR(require('../../../fixtures/student-streaming-smoke-test.har.json'));
    });
    describe('landing - successful verification', () => {
        describe('Full-price', () => {
            it('Fallback offer', () => {
                const customerInfoRoute = getAliasForURL('POST', '/services/validate/customer-info');
                const customerRoute = getAliasForURL('POST', '/services/offers/customer');
                const quoteRoute = getAliasForURL('POST', '/services/quotes/quote');
                const createAccountRoute = getAliasForURL('POST', '/services/purchase/new-account');

                cy.visit('/subscribe/checkout/streaming?verificationid=5eba6ab41418bc1c59a8550d&programCode=USTSTUDENTPSRTP6MO1');

                cy.sxmWaitForSpinner();

                // Step 1 is visible
                cyGetPurchaseAccordionItemTitle()
                    .first()
                    .then(elem => expect(elem.text()).to.contain('1. Your billing information'));

                cyGetPurchaseAccordionItemContent()
                    .first()
                    .should('not.be.hidden');

                cyGetPurchasePaymentInfoComponent().should('be.visible');

                cy.sxmEnsureNoMissingTranslations();

                cyGetOfferPromoPriceAndTerm().should(elem => expect(elem.text()).to.equal('6 months for $1'));
                cyGetOfferDescriptionFooter().should(elem => expect(elem.text()).to.equal(''));

                cyGetPaymentFormComponent().should('be.visible');
                cyGetPaymentFormComponent().scrollIntoView();

                // because this same endpoint is called twice with different request/response, we wait for the first one so that we can override it with the next `cy.route`
                cy.wait(`@${customerInfoRoute}`);

                verifyPreFillData();

                fillOutForm();

                // this is where we override that endpoint call from above
                cy.route('GET', `${Cypress.env('microservicesEndpoint')}/services/validate/customer-info`, mockResponseCustomerInfoAddressCCAdressNotFound);

                // Submit the form!
                cyGetPaymentConfirmationButton().click({ force: true });

                cy.wait(`@${customerRoute}`);
                cy.wait(`@${quoteRoute}`);

                cyGetPurchaseReviewOrderComponent().should('be.visible');

                // Check the text on the review page
                checkOrderDetails({ isReviewPage: true });

                // check over the offer details
                cyGetOfferDetails().should(elem => {
                    expect(elem).to.contain('receive the first 6 months for $1.00 plus tax');
                    expect(elem).to.contain('currently $4.00/month'); // follow-on
                });

                checkReviewPage();

                // accept payment
                cyGetChargeAgreementCheckbox().check({ force: true });

                // Submit confirmation
                cyGetReviewOrderCompleteButton().click({ force: true });

                cy.wait(`@${createAccountRoute}`);

                checkConfirmationPage();

                checkOrderDetails({ isReviewPage: false }); // check it again because it's the same component but on a different page
            });
        });
    });
});
