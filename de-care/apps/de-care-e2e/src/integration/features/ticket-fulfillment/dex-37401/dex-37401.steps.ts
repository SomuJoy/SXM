import { assertUrlPathMatch } from '@de-care/shared/e2e';
import { Before, Given, Then } from 'cypress-cucumber-preprocessor/steps';

type ProgramCode = 'CASA3FOR2PYP';
type Province = 'QUEBEC' | 'ONTARIO';
type Language = 'EN' | 'FR';
type ROCPrices = 7.99 | 12.99 | 17.99 | 22.99;
type QCPrices = 9.6 | 15.6 | 21.6 | 27.6;

const rocPrices = (): ROCPrices[] => [7.99, 12.99, 17.99, 22.99];
const qcPrices = (): QCPrices[] => [9.6, 15.6, 21.6, 27.6];

const canadaPrices = (province: Province): QCPrices[] | ROCPrices[] => (province === 'QUEBEC' ? qcPrices() : rocPrices());

const formatFrenchPrice = (price: ROCPrices | QCPrices): string => `${price.toString().replace('.', ',')}`;

const prices = (language: Language, province: Province) => canadaPrices(province).map(price => (language === 'EN' ? `${price}` : formatFrenchPrice(price)));

function changeProvinceTo(province: Province) {
    mockOffers('QUEBEC');
    cy.get('[data-e2e="provinceChangeEditButton"]').click();
    cy.get('[data-e2e="proviceSelectorDropDown"]').click();
    cy.get('ul#droplist')
        .children('li')
        .contains(province)
        .click();
    cy.get('[data-e2e="provinceChangeSaveButton"]').click();
}

const mockOffers = (province: Province) =>
    province === 'QUEBEC'
        ? cy.route('POST', '**/services/offers', require('../../../../fixtures/features/ticket-fulfillment/dex-37401/offers-qc.json'))
        : cy.route('POST', '**/services/offers', require('../../../../fixtures/features/ticket-fulfillment/dex-37401/offers-roc.json'));

const mockCustomerOffers = (province: Province) =>
    province === 'QUEBEC'
        ? cy.route('POST', '**/services/offers/customer', require('../../../../fixtures/features/ticket-fulfillment/dex-37401/customers-qc.json'))
        : cy.route('POST', '**/services/offers/customer', require('../../../../fixtures/features/ticket-fulfillment/dex-37401/customers-roc.json'));

function assertGridPricing(province: Province, language: Language) {
    const element = cy.get('[data-e2e="gridRowColumnFeatureLabel"]');
    const patchedPrices = prices(language, province);
    element.should('contain.text', patchedPrices[0]);
    element.should('contain.text', patchedPrices[2]);
    element.should('contain.text', patchedPrices[3]);
}

function assertOfferDetailsPricing(province: Province, language: Language) {
    const element = cy.get('[data-e2e="offerDetails"]');
    const patchedPrices = prices(language, province);
    element.should('contain.text', patchedPrices[0]);
    element.should('contain.text', patchedPrices[2]);
    element.should('contain.text', patchedPrices[3]);
}

function assertUpdatedPricing(province: Province, language: Language = 'EN') {
    assertOfferDetailsPricing(province, language);
    assertGridPricing(province, language);
}

function findYourAccount() {
    cy.route('POST', '**/services/device/validate', require('../../../../fixtures/features/ticket-fulfillment/dex-37401/validate.json'));
    cy.route('POST', '**/services/account/non-pii', require('../../../../fixtures/features/ticket-fulfillment/dex-37401/non-pii.json'));
    cy.route('POST', '**/services/account/verify', require('../../../../fixtures/features/ticket-fulfillment/dex-37401/verify.json'));
    cy.get('find-your-account-card')
        .wait(1000)
        .invoke('css', 'opacity', '1')
        .should('have.css', 'opacity', '1')
        .scrollIntoView();

    cy.get('[data-e2e="radioLookupOptions.carInfoContinueButton"]')
        .last()
        .click({ force: true });
    cy.get('[data-e2e="lookupRadioId.input"]').type('123456789');
    cy.get('[data-e2e="lookupRadioId.button"]').click({ force: true });
    cy.get('[data-e2e="validateLastNameInput"]').type('Mayfield');
    cy.get('[data-e2e="validatePhoneInput"]').type('1234567890');
    cy.get('[data-e2e="validateZipInput"]').type('M6K1A7');
    cy.get('[data-e2e="validateSubmissionButton"]').click();
}

const continueButton = () => cy.get('[data-e2e="planComparisonGridButton"]').click({ force: true });

Before(() => {
    cy.server();
    cy.sxmMockCardBinRanges();
    cy.sxmMockEnvInfo();
    cy.route('POST', '**/services/offers/all-package-desc', require('../../../../fixtures/features/ticket-fulfillment/dex-37401/package-description.json'));
    cy.route('POST', '**/services/utility/ip2location', require('../../../../fixtures/features/ticket-fulfillment/dex-37401/ip2location.json'));
});

Given('a customer from Canada ROC visits FLEPZ with a PYOP programCode', () => {
    mockOffers('ONTARIO');
    mockCustomerOffers('ONTARIO');
    cy.visit('/subscribe/checkout/offer/flepz?programCode=CASA3FOR2PYP');
});

Then('the updated ROC price displays in the Offer Details and Grid', () => {
    assertUpdatedPricing('ONTARIO');
    findYourAccount();
    mockCustomerOffers('ONTARIO');
    continueButton();
    assertUrlPathMatch('/subscribe/checkout;proactiveFlag=true?programcode=CASA3FOR2PYP&radioId=9820&act=9996');
    assertOfferDetailsPricing('ONTARIO', 'FR');
});

Given('a customer from Canada QC visits FLEPZ with a PYOP programCode', () => {
    mockOffers('ONTARIO');
    mockCustomerOffers('QUEBEC');
    cy.visit('/subscribe/checkout/offer/flepz?programCode=CASA3FOR2PYP').then(() => changeProvinceTo('QUEBEC'));
});

Then('the updated QC price displays in the Offer Details and Grid', () => {
    assertUpdatedPricing('QUEBEC');
    findYourAccount();
    mockCustomerOffers('QUEBEC');
    continueButton();
    assertUrlPathMatch('/subscribe/checkout;proactiveFlag=true?programcode=CASA3FOR2PYP&radioId=9820&act=9996');
    assertOfferDetailsPricing('QUEBEC', 'FR');
});
