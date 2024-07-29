import { assertUrlPathMatch } from '@de-care/shared/e2e';
import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

export const mockResponses = {
    account: require('../../../../../fixtures/use-cases/upgrade-vip/add-second-radio-pvip-via-oac-account.json'),
    allPackageDescriptions: require('../../../../../fixtures/use-cases/upgrade-vip/add-second-radio-pvip-via-oac-all-package-desc.json'),
    customer: require('../../../../../fixtures/use-cases/upgrade-vip/add-second-radio-pvip-via-oac-customer.json'),
    nonPii: require('../../../../../fixtures/use-cases/upgrade-vip/add-second-radio-pvip-via-oac-non-pii.json'),
    quote: require('../../../../../fixtures/use-cases/upgrade-vip/add-second-radio-pvip-via-oac-quote.json'),
    validate: require('../../../../../fixtures/use-cases/upgrade-vip/add-second-radio-pvip-via-oac-validate.json'),
    vipEligibleRaidos: require('../../../../../fixtures/use-cases/upgrade-vip/add-second-radio-pvip-via-oac-vip-eligible-radios.json'),
};

Before(() => {
    cy.viewport(900, 1200);
    cy.server();
    cy.sxmMockCardBinRanges();
    cy.route('POST', '**/offers/all-package-desc', mockResponses.allPackageDescriptions);
    cy.route('POST', '**/services/account', mockResponses.account);
    cy.route('POST', '**/services/account/vip-eligible-radios', mockResponses.vipEligibleRaidos);
    cy.route('POST', '**/account/non-pii', mockResponses.nonPii);
    cy.route('POST', '**/services/device/validate', mockResponses.validate);
    cy.route('POST', '**/services/offers/customer', mockResponses.customer);
    cy.route('POST', '**/services/quotes/quote', mockResponses.quote);
});

Given(/^a customer visits the page with subscription Id and account number$/, () => {
    cy.visit('/subscribe/upgrade-vip/add-second-radio?subscriptionId=10000242144&act=10000242912');
    cy.wait(5500);
});

Then(/^they should be presented with the list of radios and option to find a second radio$/, () => {
    cy.get('sxm-ui-stepper-accordion').get('section').should('have.class', 'active');
    cy.get('sxm-ui-stepper-accordion').get('header p').first().should('have.text', '1. Choose your second Platinum VIP listening option');
    cy.get('sxm-ui-accordion-chevron').get('button#accordion-btn').should('have.text', ' View more radios ');
});

Given(/^a customer click on the 'View more radios' option to 'Find second radio'$/, () => {
    cy.get('sxm-ui-accordion-chevron').get('button#accordion-btn').click({ force: true });
});

Then(/^they should be presented with the 'Find second radio' option in the form of radio button$/, () => {
    cy.get('sxm-ui-radio-option-form-field').get('[data-e2e="radioOptionLabel"]').last().should('have.text', 'Find second radio');
});

When(/^a customer notice select radio button with labeled 'Find second radio'$/, () => {
    cy.get('sxm-ui-radio-option-form-field').get('[data-e2e="radioOptionLabel"]').last().click({ force: true });
    cy.get('button').get('[data-e2e="firstStepForm.continueButton"]').last().click({ force: true });
});

Then(/^they should be presented with modal popup with options to find with 'Radio ID'$/, () => {
    cy.get('de-care-second-radio-lookup').get('radio-lookup-options').get('input[qatag="CarInfoRadioIDRadioButton"]').should('exist');
    cy.get('button[data-e2e="radioLookupOptions.carInfoContinueButton"]').should('exist');
});

And(/^a customer choose search by Radio ID option and click continue$/, () => {
    cy.get('de-care-second-radio-lookup').get('radio-lookup-options').get('[qatag="CarInfoRadioIDRadioButton"]').click({ force: true });
    cy.get('button[data-e2e="radioLookupOptions.carInfoContinueButton"]').click({ force: true });
});

Then(/^they should be presented with modal popup with options to enter 'Radio ID' in Input$/, () => {
    cy.get('lookup-radio-id').get('input[data-e2e="lookupRadioId.input"]').should('exist');
});

Given(/^a customer will enter closed radio id in the modal and click continue to search radio$/, () => {
    cy.get('lookup-radio-id').get('[data-e2e="lookupRadioId.input"]').type('990005118011');
    cy.get('[data-e2e="lookupRadioId.button"]').click({ force: true });
});

Then(/^they should be presented with modal popup with search result of radio information$/, () => {
    cy.get('sxm-ui-modal[data-e2e="confirmRadioModal"]').should('contain.text', 'Is this the second radio you want upgraded to Platinum VIP?');
    cy.get('sxm-ui-modal[data-e2e="confirmRadioModal"]').should('contain.text', '***8011');
});

Given(/^a customer click continue button on the searched radio$/, () => {
    cy.get('[data-e2e="confirmRadioModal.submitButton"]').click({ force: true });
});

Then(/^they should be presented with review stepper with quote summary$/, () => {
    cy.get('sxm-ui-stepper-accordion').get('header p').last().should('have.text', '2. Review');
    cy.get('add-second-radio-order-summary').first().should('include.text', 'Your Radio ID: (****8011)');
});

Given(/^a customer click continue button on the review component with new closed second radio$/, () => {
    cy.get('button[sxm-proceed-button]').click({ force: true });
    cy.wait(1000);
});

Then(/^they should be presented with confirmation page$/, () => {
    assertUrlPathMatch('/subscribe/upgrade-vip/add-second-radio/thanks');
    cy.get('de-care-add-second-radio-confirmation-page').should('exist');
    cy.get('setup-login-credentials').get('p').first().should('include.text', 'Radio ID: ****8011');
    cy.get('add-second-radio-order-summary').first().should('include.text', 'Your Radio ID: (****8011)');
});
