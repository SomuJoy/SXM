import {
    cyGetActivateTrialButton,
    cyGetCCAddress,
    cyGetCCCity,
    cyGetCCState,
    cyGetCCZipCode,
    cyGetFirstName,
    cyGetLastName,
    cyGetOfferPromoPriceAndTerm,
    cyGetSl2cConfirmationTrialExpiryNotice,
    getAliasForURL,
    mockResponseAllPackageDesc,
    mockResponseEnvInfo,
    mockRoutesFromHAR,
    sxmIsCanadaMode,
    cyGetSendRefreshSignalButton,
    cyGetRefreshSignalInCarSuccessMessage,
    cyGetHeaderProvinceSection,
    sxmCheckPageLocation,
    cyGetE2eVerifyAddressRetainButton
} from '@de-care/shared/e2e';
import { e2eSxmDropDownItem } from '@de-care/shared/sxm-ui/ui-dropdown-form-field';

function fillForm(isQuebec = false) {
    const isCanada = sxmIsCanadaMode();

    const customerData = isQuebec
        ? {
              vin: 'PRWGE1T2NBKAH1C63',
              firstName: 'Paula',
              lastName: 'Myo',
              ccAddress: '110 Rue Notre-Dame Ouest',
              ccCity: 'Montréal',
              ccState: 'QC',
              ccZipCode: 'H2Y 1T1'
          }
        : {
              vin: 'PRWGE1T2NBKAH1C63',
              firstName: 'Paula',
              lastName: 'Myo',
              ccAddress: isCanada ? '135 Liberty St' : '1525 Drury Lane',
              ccCity: isCanada ? 'Toronto' : 'New York',
              ccState: isCanada ? 'ON' : 'NY',
              ccZipCode: isCanada ? 'M6K 1A7' : '10020'
          };

    cyGetFirstName()
        .first()
        .within(() => cy.get('input').type(customerData.firstName, { force: true }));

    /* If token-less flow
    cyGetRadioIdVin()
        .first()
        .within(() => cy.get('input').type(customerData.vin, { force: true }));
    */
    cyGetLastName()
        .first()
        .within(() => cy.get('input').type(customerData.lastName, { force: true }));

    cyGetCCAddress()
        .first()
        .type(customerData.ccAddress, { force: true });

    cyGetCCCity()
        .first()
        .type(customerData.ccCity, { force: true });

    cyGetCCState()
        .first()
        .click({ force: true })
        .find(`${e2eSxmDropDownItem}[title="${customerData.ccState}"]`)
        .click({ force: true });

    cyGetCCZipCode()
        .first()
        .type(customerData.ccZipCode, { force: true });
}

describe('Service lane 2-click', () => {
    let mockRoutes: any;

    beforeEach(() => {
        cy.server();
        cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers/all-package-desc`, mockResponseAllPackageDesc);
        cy.route('GET', `${Cypress.env('microservicesEndpoint')}/services/utility/env-info`, mockResponseEnvInfo);
    });
    describe('Service lane', () => {
        if (sxmIsCanadaMode()) {
            it('ROC flow', () => {
                mockRoutes = mockRoutesFromHAR(require('../../../fixtures/use-cases/trial-activation/sl2c-qc-refresh.har.json'));

                const nonPiiRouteAlias = getAliasForURL('POST', '/services/account/non-pii');

                cy.visit('/activate/trial/service-lane?tkn=33065e33-54d5-4a75-b9ac-f48766ef5232&corpId=90005');

                cy.wait(`@${nonPiiRouteAlias}`);
                cy.sxmWaitForSpinner();

                cy.sxmEnsureNoMissingTranslations();
                cyGetHeaderProvinceSection().should(elem => expect(elem.text()).to.contain('Ontario'));

                cyGetOfferPromoPriceAndTerm().should(elem => expect(elem.text()).to.contain('3 months free'));

                fillForm(false);

                cy.sxmReplaceMockFromHAR(mockRoutes, nonPiiRouteAlias, 1);
                cyGetActivateTrialButton().click({ force: true });

                // Address verification failed
                //cyGetE2eVerifyAddressRetainButton().click();

                cyGetSl2cConfirmationTrialExpiryNotice().should('contain', 'Your trial subscription will expire on 01/18/2022');

                cyGetSendRefreshSignalButton().click({ force: true });
                sxmCheckPageLocation('/activate/trial/confirmation');
                cyGetHeaderProvinceSection().should(elem => expect(elem.text()).to.contain('Ontario'));
                cyGetRefreshSignalInCarSuccessMessage().should(elem => expect(elem.text()).to.contain('Refresh request sent!'));
            });
            it('QC flow', () => {
                mockRoutes = mockRoutesFromHAR(require('../../../fixtures/use-cases/trial-activation/sl2c-qc-refresh.har.json'));

                const nonPiiRouteAlias = getAliasForURL('POST', '/services/account/non-pii');

                cy.visit('/activate/trial/service-lane?tkn=33065e33-54d5-4a75-b9ac-f48766ef5232&corpId=90005');

                cy.wait(`@${nonPiiRouteAlias}`);
                cy.sxmWaitForSpinner();

                cy.sxmEnsureNoMissingTranslations();

                cyGetOfferPromoPriceAndTerm().should(elem => expect(elem.text()).to.contain('3 months free'));

                fillForm(true);

                cy.sxmReplaceMockFromHAR(mockRoutes, nonPiiRouteAlias, 1);
                cyGetActivateTrialButton().click({ force: true });

                cyGetSl2cConfirmationTrialExpiryNotice().should('contain', 'Your trial subscription will expire on 01/18/2022');

                cyGetSendRefreshSignalButton().click({ force: true });

                sxmCheckPageLocation('/activate/trial/confirmation');
                cyGetHeaderProvinceSection().should(elem => expect(elem.text()).to.contain('Quebec'));

                cyGetRefreshSignalInCarSuccessMessage().should(elem => expect(elem.text()).to.contain('Refresh request sent!'));
            });
        } else {
            it('US flow', () => {
                mockRoutes = mockRoutesFromHAR(require('../../../fixtures/use-cases/trial-activation/service-lane-us.har.json'));

                const nonPiiRouteAlias = getAliasForURL('POST', '/services/account/non-pii');

                cy.visit('/activate/trial/service-lane?tkn=8d8d8358-212b-4ef7-9dca-e909e79aa3bb&corpId=90005');

                //cy.wait(`@${nonPiiRouteAlias}`);
                cy.sxmWaitForSpinner();

                cy.sxmEnsureNoMissingTranslations();

                cyGetOfferPromoPriceAndTerm().should(elem => expect(elem.text()).to.contain('3 months free'));

                fillForm(false);

                cy.sxmReplaceMockFromHAR(mockRoutes, nonPiiRouteAlias, 1);
                cyGetActivateTrialButton().click({ force: true });

                cyGetE2eVerifyAddressRetainButton().click();

                cyGetSl2cConfirmationTrialExpiryNotice().should('contain', 'Your trial subscription will expire on 12/17/2020');
            });
        }
    });
});
