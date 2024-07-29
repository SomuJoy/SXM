import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, sxmCheckPageLocation, sxmCheckParams } from '@de-care/shared/e2e';
import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import {
    paymentConfirmationButtonClick,
    useMySavedVisaSelect,
    chargeAgreementCheckboxCheck,
    transferSubscriptionButtonClick,
    portChargeAgreementCheckboxCheck,
    reviewCompleteOrderButtonClick,
    serivePortabilityComplete,
    acMethodClick,
    addVehicleButtonClick,
    firstPlanSelect,
    packageSelectContinueButtonClick,
} from '../helpers';
import { mockRoutesForACTokenizedSuccess, mockRoutesForSPTokenizedSuccess } from '../transfer-tokenized/helpers';
import {
    findMyRadioButtonClick,
    inputRadioId,
    mockRoutesFor_AC_AND_SC_eligibility,
    mockRoutesForSwapAlreadyUsedRadioId,
    mockRoutesForSwapTrialRadioIdHasSelfPay,
    mockRoutesFor_SWAP_eligible,
    mockRoutesFor_LIFE_TIME_PLAN,
    mockRoutesFor_LACKS_CAPABILITIES,
} from './helpers';

const subscriptionId = '10000260534';

const inputRadioAndSubmit = (radioId) => {
    inputRadioId(radioId);
    findMyRadioButtonClick();
};

Before(() => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
});

Given('A customer qualifies for SWAP', () => {
    mockRoutesForSwapAlreadyUsedRadioId();
});

Given('A customer qualifies for transfer with AC_AND_SC eligibility', () => {
    mockRoutesFor_AC_AND_SC_eligibility();
});

Given('A customer qualifies for transfer with SWAP eligibility', () => {
    mockRoutesFor_SWAP_eligible();
});

When('they navigate Swap page with subscriptionId', () => {
    cy.visit(`transfer/radio/swap?subscriptionId=${subscriptionId}&langpref=en`);
});

Then('they should see Swap page', () => {
    sxmCheckPageLocation('/transfer/radio/swap');
    sxmCheckParams(`subscriptionId=${subscriptionId}&langpref=en`);
    cy.sxmWaitForSpinner();
});

And('check swap page information', () => {
    cy.get('[data-e2e="listenerDetailsTitle"]').contains('990004837786');
    cy.get('[data-e2e="vehicleWithSubscriptionDetails"]').contains('Sirius All Access');
    cy.get('[data-e2e="vehicleWithSubscriptionDetails"]').contains('Annual Plan Renews:').contains('02/08/2023');

    cy.get('[data-e2e="radioIdForm"] button.text-link').click();
    cy.get('sxm-ui-help-finding-radio').should('be.visible');
    cy.get('sxm-ui-help-finding-radio ul li a').eq(1).click();
    cy.get('sxm-ui-device-help').should('be.visible');
    cy.get('[data-e2e="sxmUiModalCloseButton"]').eq(1).click();
    cy.get('[data-e2e="sxmUiModalCloseButton"]').eq(0).click();

    const radionInput = cy.get('[data-e2e="radioIdForm"] input');
    radionInput.focus();
    findMyRadioButtonClick();
    cy.get('.invalid-feedback').contains('Enter a valid Radio ID.');
});

When('they input self radio id', () => {
    mockRoutesForSwapAlreadyUsedRadioId();
    inputRadioAndSubmit('990004837786');
});

Then('they must see The Radio ID you entered is already on this account', () => {
    cy.get('.invalid-feedback').contains('The Radio ID you entered is already on this account.');
});

When('they input trial radio id which has self pay', () => {
    mockRoutesForSwapTrialRadioIdHasSelfPay();
    inputRadioAndSubmit('990004837787');
});

Then('they must see Unable to complete this transaction online or your subscription plan is ineligible to transfer', () => {
    cy.get('.invalid-feedback').contains('unable to complete this transaction online or your subscription plan is ineligible to transfer');
});

When('they input new radio id with life time plan', () => {
    mockRoutesFor_LIFE_TIME_PLAN();
    inputRadioAndSubmit('990004837788');
});
Then('they must see Your radio is eligible for a prepaid, lifetime subscription', () => {
    cy.get('.invalid-feedback').contains(
        'Your radio is eligible for a prepaid, lifetime subscription. We are unable to process this online. Please chat with an agent to activate your radio.'
    );
});
When('they input new radio id with lacks capabilities', () => {
    mockRoutesFor_LACKS_CAPABILITIES();
    inputRadioAndSubmit('990004837789');
});

Then('they must see The radio you wish to transfer service to does not support', () => {
    cy.get('.invalid-feedback').contains(
        'We’re sorry, but the radio you wish to transfer service to does not support certain features included in your current subscription plan. For assistance, please chat with an agent or call 855-227-6738 to speak with a Listener Care agent.'
    );
});
When('they input new radio id', () => {
    inputRadioAndSubmit('990004564412');

    // Todo: wait loading
    cy.wait(1000);
});

Then('they should see SC page', () => {
    sxmCheckPageLocation('/transfer/radio');
    sxmCheckParams(`mode=SC`);
});

Given('A customer qualifies for SP', () => {
    mockRoutesForSPTokenizedSuccess();
});

When('the customer successfully completes a transfer', () => {
    serivePortabilityComplete(false);
});

Then('they should see SP complete page', () => {
    sxmCheckPageLocation('/transfer/radio/port/thanks');
});

Then('they should see Swap checkout page', () => {
    sxmCheckPageLocation('/transfer/radio/swap/checkout');
    // cy.sxmWaitForSpinner();
});

When('they complete payment page', () => {
    // without select payment & agreenemtn unckecked
    paymentConfirmationButtonClick();

    cy.get('[data-e2e="paymentForm"] .invalid-feedback').contains('Please choose a payment option');
    cy.get('.charge-agreement .invalid-feedback').should('be.visible');

    useMySavedVisaSelect();
    cy.get('[data-e2e="paymentForm"] .invalid-feedback').should('be.hidden');
    // without agreenemtn
    paymentConfirmationButtonClick();
    cy.get('.charge-agreement .invalid-feedback').should('be.visible');

    chargeAgreementCheckboxCheck();

    paymentConfirmationButtonClick();
});

Then('they should see Swap complete page', () => {
    sxmCheckPageLocation('/transfer/radio/swap/thanks');
});

When('they are trying lookup radio id', () => {
    cy.get('.radio-lookup-link button.text-link').click({ force: true });
});

Then('they should see Lookup page', () => {
    sxmCheckPageLocation('/transfer/radio/lookup');
});

And('they input trial radio id', () => {
    inputRadioAndSubmit('990005040566');
    // Todo: wait loading
    cy.wait(1000);
});

Then('they should see ACSC page', () => {
    sxmCheckPageLocation('/transfer/radio');
});

Given('A customer qualifies for ACSC', () => {
    mockRoutesForACTokenizedSuccess();
});

And('select AC mode', () => {
    acMethodClick();
});

When('Just add my new car to my accont', () => {
    addVehicleButtonClick();

    cy.get('#step1-2', { timeout: 50000 }).should('be.visible');

    firstPlanSelect();
    packageSelectContinueButtonClick();

    useMySavedVisaSelect();
    paymentConfirmationButtonClick();

    chargeAgreementCheckboxCheck();
    reviewCompleteOrderButtonClick();
});

Then('they should see transfer complete page', () => {
    sxmCheckPageLocation('/transfer/radio/thanks');
});
