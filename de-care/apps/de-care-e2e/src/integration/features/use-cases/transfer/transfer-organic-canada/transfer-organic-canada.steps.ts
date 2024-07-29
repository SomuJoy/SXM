import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, sxmCheckPageLocation, sxmCheckParams } from '@de-care/shared/e2e';
import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

import {
    findMyRadioButtonClick,
    inputRadioId,
    mockRoutesFor_AC_AND_SC_eligibility,
    mockRoutesForSwapAlreadyUsedRadioId,
    mockRoutesForSwapTrialRadioIdHasSelfPay,
    mockRoutesFor_SWAP_eligible,
    mockRoutesFor_LIFE_TIME_PLAN,
    mockRoutesFor_LACKS_CAPABILITIES,
} from '../transfer-organic/helpers';

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

When('they navigate Swap page with subscriptionId - fr', () => {
    cy.visit(`transfer/radio/swap?subscriptionId=${subscriptionId}&langpref=fr`);
});

Then('they should see Swap page', () => {
    sxmCheckPageLocation('/transfer/radio/swap');
    sxmCheckParams(`subscriptionId=${subscriptionId}&langpref=en`);
    cy.sxmWaitForSpinner();
});

Then('they should see Swap page - fr', () => {
    sxmCheckPageLocation('/transfer/radio/swap');
    sxmCheckParams(`subscriptionId=${subscriptionId}&langpref=fr`);
    cy.sxmWaitForSpinner();
});

When('they input self radio id', () => {
    mockRoutesForSwapAlreadyUsedRadioId();
    inputRadioAndSubmit('990004837786');
});

Then('they must see The Radio ID you entered is already on this account', () => {
    cy.get('.invalid-feedback').contains('The Radio ID you entered is already on this account.');
});

Then('they must see The Radio ID you entered is already on this account - fr', () => {
    cy.get('.invalid-feedback').contains('Le code de radio que vous avez entré est déjà dans ce compte.');
});

When('they input trial radio id which has self pay', () => {
    mockRoutesForSwapTrialRadioIdHasSelfPay();
    inputRadioAndSubmit('990004837787');
});

Then('they must see Unable to complete this transaction online or your subscription plan is ineligible to transfer', () => {
    cy.get('.invalid-feedback').contains('unable to complete this transaction online or your subscription plan is ineligible to transfer');
});

Then('they must see Unable to complete this transaction online or your subscription plan is ineligible to transfer - fr', () => {
    cy.get('.invalid-feedback').contains(
        'Désolés, nous ne pouvons pas compléter cette transaction en ligne ou votre abonnement n’est pas admissible à un transfert. Pour de l’aide, veuillez composer le 866 635-0565.'
    );
});

When('they input new radio id with life time plan', () => {
    mockRoutesFor_LIFE_TIME_PLAN();
    inputRadioAndSubmit('990004837788');
});
Then('they must see Your radio is eligible for a prepaid, lifetime subscription', () => {
    cy.get('.invalid-feedback').contains(
        'Your radio is eligible for a prepaid, lifetime subscription. We are unable to process this online. Please call 1-888-539-7474 to activate your radio.'
    );
});

Then('they must see Your radio is eligible for a prepaid, lifetime subscription - fr', () => {
    cy.get('.invalid-feedback').contains(
        'Votre radio est éligible à un abonnement à vie. Nous ne pouvons pas traiter cette demande en ligne. Veuillez composer le 1-888-539-7474 pour activer votre radio.'
    );
});

When('they input new radio id with lacks capabilities', () => {
    mockRoutesFor_LACKS_CAPABILITIES();
    inputRadioAndSubmit('990004837789');
});

Then('they must see The radio you wish to transfer service to does not support', () => {
    cy.get('.invalid-feedback').contains(
        'We’re sorry, but the radio you wish to transfer service to does not support certain features included in your current subscription plan. For assistance, please chat with an agent.'
    );
});

Then('they must see The radio you wish to transfer service to does not support - fr', () => {
    cy.get('.invalid-feedback').contains(
        'Désolés, la radio vers laquelle vous souhaitez transférer votre service ne prend pas en charge certaines fonctionnalités incluses dans votre abonnement actuel. Pour de l’aide, veuillez composer le 866 635-0565.'
    );
});
