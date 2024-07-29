import {
    cyGetAddress,
    cyGetCcExp,
    cyGetCcName,
    cyGetCcNum,
    cyGetCity,
    cyGetCreateAccountSubmitButton,
    cyGetEmailField,
    cyGetPaymentInfoFormGroup,
    cyGetPhoneNumberField,
    cyGetState,
    cyGetTrialActivationRtpCreateAccountComponent,
    cyGetTrialActivationRtpCreateAccountVehicleEligibilityText,
    cyGetTrialActivationRtpNotYourCarLink,
    mockNOUVRtp
} from '@de-care/de-care-use-cases/trial-activation/e2e';
import {
    cyGetSxmUIEmail,
    cyGetSxmUIEmailLabel,
    cyGetSxmUIPhoneNumber,
    cyGetSxmUIPhoneNumberLabel,
    cyGetSxmUITextFormField,
    cyGetSxmUITextFormFieldLabel,
    mockRouteForAllPackageDescriptions,
    mockRouteForCardBinRanges,
    sxmCheckPageLocation,
    sxmEnsureNoMissingTranslations,
    cyGetE2ECreditCardNumberInputUnmasked,
    cyGetSxmDropDownItem,
    mockRoutesFromHAR
} from '@de-care/shared/e2e';
import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('the customer has a trial rtp offer on their account', () => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
    mockNOUVRtp();
});

When('they enter PHX with a valid radioId', () => {
    cy.visit(
        `/activate/trial/rtp/?radioId=3556&usedCarBrandingType=OTHERS&programCode=3MOAAFREE&redirectUrl=https:%2F%2Fdex-dev.corp.siriusxm.com%2Fdvgllvdexoac05-17564-care%2F%3Fprogramcode%3D3MOAAFREE`
    );
});

Then('they should reach step 2 of 3', () => {
    sxmCheckPageLocation('/activate/trial/rtp');
    sxmEnsureNoMissingTranslations();

    cyGetTrialActivationRtpCreateAccountComponent().within(() => {
        cyGetTrialActivationRtpCreateAccountVehicleEligibilityText().should('contain', 'Your car is eligible');
    });
});

When('they choose the link for incorrect vehicle', () => {
    cyGetTrialActivationRtpCreateAccountComponent().within(() => {
        cyGetTrialActivationRtpNotYourCarLink().click();
    });
});

Then('they should see a placeholder redirect page', () => {
    cy.location().should(loc => {
        expect(loc.pathname).to.eq('/dvgllvdexoac05-17564-care/');
        expect(loc.search).to.eq('?programcode=3MOAAFREE');
    });
});

When('they submit the create-account form with valid data', () => {
    cyGetTrialActivationRtpCreateAccountComponent().within(() => {
        cyGetEmailField().within(() => {
            cyGetSxmUIEmailLabel().click();
            cyGetSxmUIEmail().type('paula.myo@siriusxm.com');
        });
        cyGetPhoneNumberField().within(() => {
            cyGetSxmUIPhoneNumberLabel().click();
            cyGetSxmUIPhoneNumber().type('2223333333');
        });

        cyGetPaymentInfoFormGroup().within(() => {
            cyGetAddress().within(() => {
                cyGetSxmUITextFormFieldLabel().click();
                cyGetSxmUITextFormField().type('1 River Rd');
            });

            cyGetCity().within(() => {
                cyGetSxmUITextFormFieldLabel().click();
                cyGetSxmUITextFormField().type('Schenectady');
            });

            cyGetState()
                .click({ force: true })
                .within(() => {
                    cyGetSxmDropDownItem()
                        .contains('NY')
                        .click({ force: true });
                });

            cyGetCcName().within(() => {
                cyGetSxmUITextFormFieldLabel().click();
                cyGetSxmUITextFormField().type('Paula Myo');
            });

            cyGetCcNum().within(() => {
                cyGetE2ECreditCardNumberInputUnmasked().type('4111111111111111');
            });

            cyGetCcExp()
                .click()
                .type('02/22');
        });

        cyGetCreateAccountSubmitButton().click({ force: true });
    });
});

Then('they should reach step 3 of 3', () => {
    sxmCheckPageLocation('/activate/trial/rtp/review');
    sxmEnsureNoMissingTranslations();
});

Given('the customer has a trial rtp offer that qualifies for roll to choice', () => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
    mockRoutesFromHAR(require('../../../../../fixtures/use-cases/trial-activation/nouv-rtp-with-renewal-options-valid.har.json'));
    cy.visit(`/activate/trial/rtp/?radioId=3556&usedCarBrandingType=OTHERS&programCode=3FOR2AATXRTC&redirectUrl=`);
});
And('they select a renewal plan', () => {
    cy.get('[data-e2e="rtcFollowonSelectionOption"]')
        .first()
        .click();
    cy.get('[data-e2e="planComparisonGridButton"]').click();
    cy.get('[data-e2e="radioOptionLabel"]')
        .first()
        .click();
    cy.get('[data-e2e="rtcChoiceGenreSelectionFormSubmitButton"]').click();
});
Then('they should reach the review page', () => {
    cy.get('[data-e2e="TrialActivationRtpReviewComponent"]').should('exist');
});

Given('the customer has a trial rtp offer that qualifies for pick a plan', () => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
    mockRoutesFromHAR(require('../../../../../fixtures/use-cases/trial-activation/nouv-rtp-with-multiple-lead-offers-valid.har.json'));
    cy.visit(`/activate/trial/rtp/?radioId=3556&usedCarBrandingType=OTHERS&programCode=3FOR2AATXRTC&redirectUrl=`);
});
And('they select a lead offer plan', () => {
    cy.get('[data-e2e="rtcFollowonSelectionOption"]')
        .first()
        .click();
    cy.get('[data-e2e="planComparisonGridButton"]').click();
    cy.get('[data-e2e="radioOptionLabel"]')
        .first()
        .click();
    cy.get('[data-e2e="rtcChoiceGenreSelectionFormSubmitButton"]').click();
});
Then('they should reach the review page', () => {
    cy.get('[data-e2e="TrialActivationRtpReviewComponent"]').should('exist');
});
