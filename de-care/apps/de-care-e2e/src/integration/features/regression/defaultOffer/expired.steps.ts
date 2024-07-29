import {
    cyGetDefaultOfferV1Hero,
    cyGetDefaultOfferV1OfferDetails,
    cyGetDefaultOfferV2Hero,
    mockDefaultOfferForExpiredProgramCode
} from '@de-care/de-care-use-cases/checkout/e2e';
import {
    cyGetE2EFlepzCarInfoTabDataAttr,
    cyGetE2ELookupRadioIDButton,
    cyGetE2ELookupRadioIDInput,
    cyGetE2ELookupRadioIDLabel,
    cyGetE2ERadioLookupOptionsCarInfoContinueButton,
    cyGetE2EVerifyDeviceTabs,
    cyGetOfferPromoPriceAndTerm,
    sxmCheckPageLocation,
    sxmEnsureNoMissingTranslations,
    sxmWaitForSpinner
} from '@de-care/shared/e2e';
import { cyGetSxmUiAlertPill } from '@de-care/shared/sxm-ui/e2e';
import { Then, When, And } from 'cypress-cucumber-preprocessor/steps';

When('the customer navigates into PHX with an expired program code', () => {
    mockDefaultOfferForExpiredProgramCode();
    cy.visit('/?programcode=EXP');
    sxmWaitForSpinner();
});

Then('they should see the alert pill for expired code', () => {
    sxmCheckPageLocation('/subscribe/checkout/flepz');
    sxmEnsureNoMissingTranslations();
    cyGetSxmUiAlertPill().should('contain', 'it looks like this offer has already expired');
});

And('they should not see the old experience', () => {
    cyGetSxmUiAlertPill().should('be.visible');
    cyGetDefaultOfferV1OfferDetails().should('not.be.visible');
});

When('they identify with a valid radioId', () => {
    cyGetE2EVerifyDeviceTabs().within(() => {
        cyGetE2EFlepzCarInfoTabDataAttr().click();
        cyGetE2ERadioLookupOptionsCarInfoContinueButton().click();
    });

    cyGetE2ELookupRadioIDLabel().click();
    cyGetE2ELookupRadioIDInput().type('990003351812');
    cyGetE2ELookupRadioIDButton().click();

    sxmWaitForSpinner();
});

Then('they should see the new targetted offer', () => {
    cyGetOfferPromoPriceAndTerm().should(elem => expect(elem.text()).to.equal('$16.99/mo'));
});
