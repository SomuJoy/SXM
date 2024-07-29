import { ServerResponseStudentVerificationErrorFailedValidation, ServerResponseStudentVerificationErrorInvalidToken } from '@de-care/domains/identity/state-verify-student';
import {
    cyGetActiveSubscriptionPageHeading,
    cyGetActiveSubscriptionPageMaskedUserName,
    cyGetActiveSubscriptionPagePackageName,
    cyGetActiveSubscriptionPagePageComponent,
    cyGetContentCardOrderDetailsAmount,
    cyGetContentCardOrderDetailsFeesAndTaxesAmount,
    cyGetContentCardOrderDetailsTermAndPrice,
    cyGetContentCardOrderDetailsTotalDue,
    cyGetContentCardStudentCurrentQuoteRecurringCharge,
    cyGetOrderSummary,
    cyGetOrderSummaryAccordionContentCard,
    cyGetRegisterYourAccountSecurityQuestions,
    getIsCanada,
    mockResponseAllPackageDesc,
    mockResponseEnvInfo,
    mockRoutesFromHAR
} from '@de-care/shared/e2e';

function checkRolloverConfirmationPageOrderDetails() {
    cyGetOrderSummary().should('be.visible');

    cyGetOrderSummaryAccordionContentCard()
        .should('have.length', 2)
        .first()
        .within(() => {
            cyGetContentCardOrderDetailsAmount().should('contain', '$4.00');
            cyGetContentCardOrderDetailsTermAndPrice().should('contain', '12 Months for $4.00/mo');
            cyGetContentCardOrderDetailsFeesAndTaxesAmount().should('contain', '$0.35');
            cyGetContentCardOrderDetailsTotalDue().should('contain', '$59.04');
        });
    cyGetContentCardStudentCurrentQuoteRecurringCharge().should('contain', '$4.35 starting on 11/16/2021');

    cyGetOrderSummaryAccordionContentCard()
        .eq(1)
        .should(getIsCanada() ? 'be.visible' : 'not.be.visible')
        .within(() => {
            cyGetContentCardOrderDetailsAmount().should('contain', '$4.00');
            cyGetContentCardOrderDetailsTermAndPrice().should('contain', '12 Months for $4.00/mo');
            cyGetContentCardOrderDetailsFeesAndTaxesAmount().should('contain', '$0.35');
            cyGetContentCardOrderDetailsTotalDue().should('contain', '$4.35');
        });

    cyGetRegisterYourAccountSecurityQuestions().should('be.visible');
}

function checkActiveSubscriptionPageDetails() {
    cyGetActiveSubscriptionPagePageComponent().should('be.visible');

    cyGetActiveSubscriptionPageHeading().should('contain', 'Looks like you already reverified your subscription.');
    cyGetActiveSubscriptionPageMaskedUserName().should('contain', 'tes******@siriusxm.com');
    cyGetActiveSubscriptionPagePackageName().should('contain', 'SiriusXM Premier Streaming');
}

function registerMockRouteIp2location() {
    cy.fixture('student-streaming-ip2location-default.response').as('ip2location');
    cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/utility/ip2location`, '@ip2location');
}

function registerMockRouteSecurityQuestions() {
    cy.fixture('security-questions.response').as('securityQuestions');
    cy.route('GET', `${Cypress.env('microservicesEndpoint')}/services/utility/security-questions`, '@securityQuestions').as('securityQuestionsRoute');
}

function registerMockRoute5ed94dd5e308831aa70b9a21() {
    cy.fixture('student-re-verify-verify-student-5ed94dd5e308831aa70b9a21.response').as('5ed94dd5e308831aa70b9a21');
    cy.route('GET', `${Cypress.env('microservicesEndpoint')}/services/identity/verify-student/5ed94dd5e308831aa70b9a21`, '@5ed94dd5e308831aa70b9a21').as(
        '5ed94dd5e308831aa70b9a21'
    );
}

function registerMockRouteAccountToken() {
    cy.fixture('student-re-verify-token.response').as('accountToken');
    cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/account/token`, '@accountToken').as('accountToken');
}

function registerMockRouteCustomer() {
    cy.fixture('student-re-verify-customer.response').as('customer');
    cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers/customer`, '@customer').as('customer');
}

function registerMockRouteQuote() {
    cy.fixture('student-re-verify-quote.response').as('quote');
    cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/quotes/quote`, '@quote').as('quote');
}

function registerMockRoutes() {
    registerMockRouteIp2location();
    registerMockRouteSecurityQuestions();
}

describe('Student Reverification', () => {
    beforeEach(() => {
        cy.server();
        cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers/all-package-desc`, mockResponseAllPackageDesc);
        cy.route('GET', `${Cypress.env('microservicesEndpoint')}/services/utility/env-info`, mockResponseEnvInfo);
        registerMockRoutes();
    });
    describe('CHANGE_PLAN_ELIGIBLE', () => {
        it.only('Should land on confirmation page on successful change subscription call', () => {
            mockRoutesFromHAR(require('../../../fixtures/student-reverification-change-subscription.har.json'));

            cy.visit('/student/re-verify/confirm?programCode=STUDENTPS12MO&tkn=1403169b-8208-4abc-8c37-8485fff2f2eb&verificationId=5f51209c07bf2f19d7d3f5c1');

            cy.sxmWaitForSpinner();

            cy.sxmCheckPageLocation('/student/re-verify/confirm/roll-over-complete');

            checkRolloverConfirmationPageOrderDetails();
        });

        it('Should land on error page on unsuccessful change subscription call', () => {
            registerMockRoute5ed94dd5e308831aa70b9a21();
            registerMockRouteAccountToken();
            registerMockRouteCustomer();
            registerMockRouteQuote();

            const changeSubscriptionURL = `${Cypress.env('microservicesEndpoint')}/services/purchase/change-subscription`;

            cy.route({
                method: 'POST',
                url: changeSubscriptionURL,
                status: 500,
                response: {
                    error: {}
                }
            });

            cy.fixture('student-re-verify-check-eligibility-CHANGE_PLAN_ELIGIBLE.response').as('checkEligibility');
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/check-eligibility/student`, '@checkEligibility').as('checkEligibility');

            cy.visit('/student/re-verify/confirm?programCode=STUDENTPS12MO&tkn=c7052e8b-eec0-45dd-bc85-d3802f374cf7&verificationId=5ed94dd5e308831aa70b9a21');

            cy.sxmWaitForSpinner();

            cy.sxmCheckPageLocation('/error');
        });
    });

    describe('O2O_ELIGIBLE', () => {
        it('Should TEMPORARILY land on active subscription page', () => {
            registerMockRoute5ed94dd5e308831aa70b9a21();
            registerMockRouteAccountToken();
            registerMockRouteCustomer();
            registerMockRouteQuote();

            cy.fixture('student-re-verify-check-eligibility-O2O_ELIGIBLE.response').as('checkEligibility');
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/check-eligibility/student`, '@checkEligibility').as('checkEligibility');

            cy.fixture('student-re-verify-offer-to-offer.response').as('o2o');
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/purchase/offer2offer`, '@o2o').as('o2o');

            cy.visit('/student/re-verify/confirm?programCode=STUDENTPS12MO&tkn=c7052e8b-eec0-45dd-bc85-d3802f374cf7&verificationId=5ed94dd5e308831aa70b9a21');

            cy.sxmWaitForSpinner();

            cy.sxmCheckPageLocation('/student/re-verify/confirm/complete');
        });
    });

    describe('ALREADY_EXTENDED', () => {
        it('Should land on active subscription page', () => {
            registerMockRoute5ed94dd5e308831aa70b9a21();
            registerMockRouteAccountToken();
            registerMockRouteCustomer();
            registerMockRouteQuote();

            cy.fixture('student-re-verify-check-eligibility-ALREADY_EXTENDED.response').as('checkEligibility');
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/check-eligibility/student`, '@checkEligibility').as('checkEligibility');

            cy.visit('/student/re-verify/confirm?programCode=STUDENTPS12MO&tkn=c7052e8b-eec0-45dd-bc85-d3802f374cf7&verificationId=5ed94dd5e308831aa70b9a21');

            cy.sxmWaitForSpinner();

            cy.sxmCheckPageLocation('/student/re-verify/confirm/active-subscription');
            checkActiveSubscriptionPageDetails();
        });
    });

    describe('INELIGIBLE', () => {
        it('Should go to global error page', () => {
            registerMockRoute5ed94dd5e308831aa70b9a21();
            registerMockRouteAccountToken();
            registerMockRouteCustomer();
            registerMockRouteQuote();

            cy.fixture('student-re-verify-check-eligibility-INELIGIBLE.response').as('checkEligibility');
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/check-eligibility/student`, '@checkEligibility').as('checkEligibility');

            cy.visit('/student/re-verify/confirm?programCode=STUDENTPS12MO&tkn=c7052e8b-eec0-45dd-bc85-d3802f374cf7&verificationId=5ed94dd5e308831aa70b9a21');

            cy.sxmWaitForSpinner();

            cy.sxmCheckPageLocation('/student/re-verify/confirm/error');
        });
    });

    describe('Verification fails', () => {
        it('Should redirect to re-verify landing page for invalid token', () => {
            registerMockRouteAccountToken();
            registerMockRouteCustomer();
            registerMockRouteQuote();

            cy.fixture('student-re-verify-check-eligibility-CHANGE_PLAN_ELIGIBLE.response').as('checkEligibility');
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/check-eligibility/student`, '@checkEligibility').as('checkEligibility');

            cy.route({
                method: 'GET',
                url: `${Cypress.env('microservicesEndpoint')}/services/identity/verify-student/5ed94dd5e308831aa70b9a21`,
                status: 500,
                response: {
                    error: {
                        errorCode: ServerResponseStudentVerificationErrorInvalidToken
                    }
                }
            });

            cy.visit('/student/re-verify/confirm?programCode=STUDENTPS12MO&tkn=c7052e8b-eec0-45dd-bc85-d3802f374cf7&verificationId=5ed94dd5e308831aa70b9a21');

            cy.sxmWaitForSpinner();

            cy.sxmCheckPageLocation('/student/re-verify');
        });

        it('Should redirect to global error page for failed verification', () => {
            registerMockRouteAccountToken();
            registerMockRouteCustomer();
            registerMockRouteQuote();

            cy.fixture('student-re-verify-check-eligibility-CHANGE_PLAN_ELIGIBLE.response').as('checkEligibility');
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/check-eligibility/student`, '@checkEligibility').as('checkEligibility');

            cy.route({
                method: 'GET',
                url: `${Cypress.env('microservicesEndpoint')}/services/identity/verify-student/5ed94dd5e308831aa70b9a21`,
                status: 500,
                response: {
                    error: {
                        errorCode: ServerResponseStudentVerificationErrorFailedValidation
                    }
                }
            });

            cy.visit('/student/re-verify/confirm?programCode=STUDENTPS12MO&tkn=c7052e8b-eec0-45dd-bc85-d3802f374cf7&verificationId=5ed94dd5e308831aa70b9a21');

            cy.sxmWaitForSpinner();

            cy.sxmCheckPageLocation('/error');
        });
    });
});
/*
if (accountRegistered === true && isUserNameInTokenSameAsAccount === true && subscriptions is empty) -> /subscribe/checkout/streaming
else new account -> /subscribe/checkout/streaming
*/
