import {
    cyGetOneStepNewAccountFormAddressLine1Field,
    cyGetOneStepNewAccountFormAddressLine1Label,
    cyGetOneStepNewAccountFormCityField,
    cyGetOneStepNewAccountFormCityLabel,
    cyGetOneStepNewAccountFormInteractiveEmailField,
    cyGetOneStepNewAccountFormInteractiveEmailLabel,
    cyGetOneStepNewAccountFormPhoneNumberField,
    cyGetOneStepNewAccountFormPhoneNumberLabel,
    cyGetOneStepNewAccountFormPostalCodeField,
    cyGetOneStepNewAccountFormProvince,
    cyGetOneStepNewAccountFormStepVehicleEligibilityText,
    cyGetOneStepNewAccountFormSubmitButton,
    cyGetSxmDropDownItem,
    mockOneStepNOUVRoutesNoVehicle,
    mockOneStepNOUVRoutesWithVehicle
} from '@de-care/de-care-use-cases/trial-activation/e2e';
import {
    cyGetE2eVerifyAddressRetainButton,
    cyGetSendRefreshSignalButton,
    getAliasForURL,
    mockRouteForAllPackageDescriptions,
    mockRouteForCardBinRanges,
    sxmCheckPageLocation,
    sxmEnsureNoMissingTranslations,
    sxmIsCanadaMode,
    sxmWaitForSpinner
} from '@de-care/shared/e2e';
import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

let mockRoutes: any;

Given('the customer has no vehicle info but valid radioId in token', () => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
    mockOneStepNOUVRoutesNoVehicle();
});

Given('the customer has valid vehicle info and valid radioId in token', () => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
    mockRoutes = mockOneStepNOUVRoutesWithVehicle();
});

When('they visit the PHX landing page', () => {
    cy.visit('/activate/trial?radioId=000W&usedCarBrandingType=SERVICE_LANE&redirectUrl=http%3A%2F%2Fmachine-name.local.corp.siriusxm.com%3A4205%2F');
    sxmWaitForSpinner();
    sxmEnsureNoMissingTranslations();
});

Then('they should see the default eligibility message', () => {
    cyGetOneStepNewAccountFormStepVehicleEligibilityText().should('contain', `Your ${sxmIsCanadaMode() ? 'vehicle' : 'car'} is eligible`);
});

Then('they should see their vehicle info in the eligibility message', () => {
    cyGetOneStepNewAccountFormStepVehicleEligibilityText().should('contain', 'Your 2016 Ford Explorer is eligible');
});

And('they fill out the form correctly', () => {
    // Advance non-pii because we landed on the page
    const nonPiiRoute = getAliasForURL('POST', '/services/account/non-pii');
    cy.sxmReplaceMockFromHAR(mockRoutes, nonPiiRoute, 1);

    cyGetOneStepNewAccountFormPostalCodeField()
        .invoke('val')
        .should('equal', '10020');

    // Fill out email
    cyGetOneStepNewAccountFormInteractiveEmailLabel().click();
    cyGetOneStepNewAccountFormInteractiveEmailField()
        .type('paula.myo@siriusxm.com')
        .blur();

    // Email validation
    const customerInfoRoute = getAliasForURL('POST', '/services/validate/customer-info');

    cy.wait(`@${customerInfoRoute}`);

    // Fill out remaining fields
    cyGetOneStepNewAccountFormPhoneNumberLabel().click();
    cyGetOneStepNewAccountFormPhoneNumberField().type('9994445555');

    cyGetOneStepNewAccountFormAddressLine1Label().click();
    cyGetOneStepNewAccountFormAddressLine1Field().type('1221 6th Ave');

    cyGetOneStepNewAccountFormCityLabel().click();
    cyGetOneStepNewAccountFormCityField().type('New York');

    cyGetOneStepNewAccountFormProvince()
        .click()
        .within(() => {
            cyGetSxmDropDownItem()
                .contains('NY')
                .scrollIntoView()
                .click();
        });

    cy.sxmReplaceMockFromHAR(mockRoutes, customerInfoRoute, 1);

    cyGetOneStepNewAccountFormSubmitButton().click('topLeft', { force: true });

    cyGetE2eVerifyAddressRetainButton().click('topLeft', { force: true });

    cyGetSendRefreshSignalButton().click('topLeft', { force: true });
});

Then('they should see the confirmation page', () => {
    sxmCheckPageLocation('/activate/trial/one-step-thanks');
    cy.location().should(loc => {
        const params = new URLSearchParams(loc.search);
        expect(params.has('thanksToken')).to.be.true; // we don't need to check contents for this flow
    });
});
