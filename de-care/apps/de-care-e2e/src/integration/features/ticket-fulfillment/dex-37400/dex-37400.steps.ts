import { Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

type ProgramCode = 'CAMORESELECT' | 'CAMOREALLACCESS' | 'CAMOREMUSIC';

function mockOffers(programCode?: ProgramCode) {
    switch (programCode) {
        case 'CAMORESELECT':
            return cy.route('POST', '**/services/offers', require('../../../../fixtures/features/ticket-fulfillment/dex-37400/offers-qc-select.json'));

        case 'CAMOREALLACCESS':
            return cy.route('POST', '**/services/offers', require('../../../../fixtures/features/ticket-fulfillment/dex-37400/offers-qc-all-access.json'));

        case 'CAMOREMUSIC':
            return cy.route('POST', '**/services/offers', require('../../../../fixtures/features/ticket-fulfillment/dex-37400/offers-qc-music.json'));

        default:
            return cy.route('POST', '**/services/offers', require('../../../../fixtures/features/ticket-fulfillment/dex-37400/offers-roc-select.json'));
    }
}

function mockCustomerOffers(programCode?: ProgramCode) {
    switch (programCode) {
        case 'CAMORESELECT':
            return cy.route('POST', '**/services/offers/customer', require('../../../../fixtures/features/ticket-fulfillment/dex-37400/customer-offers-qc-select.json'));

        case 'CAMOREALLACCESS':
            return cy.route('POST', '**/services/offers/customer', require('../../../../fixtures/features/ticket-fulfillment/dex-37400/customer-offers-qc-all-access.json'));

        case 'CAMOREMUSIC':
            return cy.route('POST', '**/services/offers/customer', require('../../../../fixtures/features/ticket-fulfillment/dex-37400/customer-offers-qc-music.json'));

        default:
            return cy.route('POST', '**/services/offers/customer', require('../../../../fixtures/features/ticket-fulfillment/dex-37400/customer-offers-qc-select.json'));
    }
}

function mockUpsells(programCode?: ProgramCode) {
    switch (programCode) {
        case 'CAMORESELECT':
        case 'CAMOREMUSIC':
        case 'CAMOREALLACCESS':
            return cy.route('POST', '**/services/upsells', require('../../../../fixtures/features/ticket-fulfillment/dex-37400/upsell-qc-all-access.json'));

        default:
            return cy.route('POST', '**/services/offers/upsell', require('../../../../fixtures/features/ticket-fulfillment/dex-37400/upsell.json'));
    }
}

function mockAllOffersByProgramCode(programCode: ProgramCode) {
    mockOffers(programCode);
    mockCustomerOffers(programCode);
    mockUpsells(programCode);
}

function changeProvinceTo(province: string) {
    cy.get('[data-e2e="provinceChangeEditButton"]').click();
    cy.get('[data-e2e="proviceSelectorDropDown"]').click();
    cy.get('ul#droplist')
        .children('li')
        .contains('QUEBEC')
        .click();
    cy.get('[data-e2e="provinceChangeSaveButton"]').click();
    cy.get('[data-e2e="currentProvince"]').should('contain', 'Province: Quebec');
}

type Language = 'EN' | 'FR';

function getPrice(programCode: ProgramCode, language: Language) {
    switch (programCode) {
        case 'CAMOREALLACCESS':
            return language === 'FR' ? '$27.60' : '27,60 $';
        case 'CAMORESELECT':
            return language === 'FR' ? '$21.60' : '21,60 $';
        case 'CAMOREMUSIC':
            return language === 'FR' ? '$15.60' : '15,60 $';
    }
}

function assertUpdatedPricing(programCode: ProgramCode) {
    const element = cy.get('[data-e2e="offerDetails"]');
    element.should('contain.text', getPrice(programCode, 'FR'));
}

function verifyDevice(programCode: ProgramCode) {
    mockCustomerOffers(programCode);
    cy.get('ul')
        .children('li')
        .contains('Vehicle Info')
        .click();
    cy.get('[data-e2e="radioLookupOptions.carInfoContinueButton"]')
        .contains('Continue')
        .click();

    cy.get('[data-e2e="lookupRadioId.input"]').type('123456890');
    cy.get('[data-e2e="lookupRadioId.button"]').click();
    cy.get('[data-e2e="validateLastNameInput"]').type('Mayfield');
    cy.get('[data-e2e="validatePhoneInput"]').type('2123333331');
    cy.get('[data-e2e="validateZipInput"]').type('M6K1A7');
    cy.get('[data-e2e="validateSubmissionButton"]').click();
}

Before(() => {
    cy.server();
    cy.sxmMockCardBinRanges();
    cy.sxmMockAllPackageDesc();
    cy.sxmMockEnvInfo();
    mockOffers();
    cy.route('POST', '**/services/device/validate', require('../../../../fixtures/features/ticket-fulfillment/dex-37400/validate.json'));
    cy.route('POST', '**/services/account/non-pii', require('../../../../fixtures/features/ticket-fulfillment/dex-37400/non-pii.json'));
    cy.route('POST', '**/services/utility/ip2location', require('../../../../fixtures/features/ticket-fulfillment/dex-37400/ip2location.json'));
    cy.route('POST', '**/services/account/verify', require('../../../../fixtures/features/ticket-fulfillment/dex-37400/verify.json'));
    cy.route('POST', '**/services/offers/upsell', require('../../../../fixtures/features/ticket-fulfillment/dex-37400/upsell.json'));
});

Given('a customer from Canada QC visits the organic FLEPZ flow', () => {});

When('the users route has a programCode of CAMORESELECT', () => {
    cy.visit(`/subscribe/checkout/flepz?programCode=CAMORESELECT`);
});

Then('the correct price of 21.60 should be displayed in the Offer Details', () => {
    mockOffers('CAMORESELECT');
    changeProvinceTo('QC');
    assertUpdatedPricing('CAMORESELECT');
    verifyDevice('CAMORESELECT');
    assertUpdatedPricing('CAMORESELECT');
});

When('the users route has a programCode of CAMOREALLACCESS', () => {
    cy.visit(`/subscribe/checkout/flepz?programCode=CAMOREALLACCESS`);
});

Then('the correct price of 27.60 should be displayed in the Offer Details', () => {
    mockOffers('CAMOREALLACCESS');
    changeProvinceTo('QC');
    assertUpdatedPricing('CAMOREALLACCESS');
    verifyDevice('CAMOREALLACCESS');
    assertUpdatedPricing('CAMOREALLACCESS');
});

When('the users route has a programCode of CAMOREMUSIC', () => {
    cy.visit(`/subscribe/checkout/flepz?programCode=CAMOREMUSIC`);
});

Then('the correct price of 15.60 should be displayed in the Offer Details', () => {
    mockOffers('CAMOREMUSIC');
    changeProvinceTo('QC');
    assertUpdatedPricing('CAMOREMUSIC');
    verifyDevice('CAMOREMUSIC');
    assertUpdatedPricing('CAMOREMUSIC');
});

Given('a customer from Canada QC visits the targeted FLEPZ flow', () => {});

When('the users route has a programCode of CAMORESELECT and radioId and lname', () => {
    mockAllOffersByProgramCode('CAMORESELECT');
    cy.visit('/subscribe/checkout?radioId=1234567890&lname=Smith&programCode=CAMORESELECT');
});

When('the users route has a programCode of CAMOREALLACCESS and radioId and lname', () => {
    mockAllOffersByProgramCode('CAMOREALLACCESS');
    cy.visit('/subscribe/checkout?radioId=1234567890&lname=Smith&programCode=CAMOREALLACCESS');
});

When('the users route has a programCode of CAMOREMUSIC and radioId and lname', () => {
    mockAllOffersByProgramCode('CAMOREMUSIC');
    cy.visit('/subscribe/checkout?radioId=1234567890&lname=Smith&programCode=CAMOREMUSIC');
});

Then('the correct price of 21.60 should be displayed in the Targeted Offer Details', () => {
    mockAllOffersByProgramCode('CAMORESELECT');
    assertUpdatedPricing('CAMORESELECT');
});

Then('the correct price of 27.60 should be displayed in the Targeted Offer Details', () => {
    mockAllOffersByProgramCode('CAMOREALLACCESS');
    assertUpdatedPricing('CAMOREALLACCESS');
});

Then('the correct price of 15.60 should be displayed in the Targeted Offer Details', () => {
    mockAllOffersByProgramCode('CAMOREMUSIC');
    assertUpdatedPricing('CAMOREMUSIC');
});
