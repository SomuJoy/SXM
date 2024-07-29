import {
    cyGetChargeAgreementCheckbox,
    cyGetContentCardOrderDetailsAmount,
    cyGetContentCardOrderDetailsFeesAndTaxesAmount,
    cyGetContentCardOrderDetailsTermAndPrice,
    cyGetContentCardOrderDetailsTotalDue,
    cyGetContentCardOrderDetailsTotalDueText,
    cyGetFlepzEmailTextfield,
    cyGetFlepzFirstNameTextfield,
    cyGetFlepzFormContinueButton,
    cyGetFlepzLastNameTextfield,
    cyGetFlepzPhoneNumberTextfield,
    cyGetFlepzVerifyDeviceTabs,
    cyGetFlepzZipCodeTextfield,
    cyGetOfferDescriptionFooter,
    cyGetOfferDetails,
    cyGetOfferPromoPriceAndTerm,
    cyGetOfferUpsell,
    cyGetOfferUpsellContentCard,
    cyGetOfferUpsellContentCardDescription,
    cyGetOfferUpsellContentCardHeader,
    cyGetOfferUpsellContinueButton,
    cyGetOrderSummary,
    cyGetOrderSummaryAccordionContentCard,
    cyGetPaymentConfirmationButton,
    cyGetPaymentInfoUseExistingCard,
    cyGetPersonalInfo,
    cyGetPurchaseAccordionItemContent,
    cyGetPurchaseAccordionItemTitle,
    cyGetReviewOrderCompleteButton,
    cyGetSummaryCardNonStudentRecurringCharge,
    cyGetSxmUiModalContent,
    cyGetVerifyDeviceTabsFlepzForm,
    cyGetYourDeviceInfo,
    cyGetYourInfo,
    cyGetYourInfoContinueButton,
    getAliasForURL,
    mockResponseAllPackageDesc,
    mockResponseEnvInfo,
    mockRoutesFromHAR,
    sxmCheckPageLocation
} from '@de-care/shared/e2e';

// TODO: We need to avoid using { force: true } but this requires more work on the styling of the pages.

const fillOutFlepzForm = () => {
    cyGetFlepzFirstNameTextfield().type('Paula');

    cyGetFlepzLastNameTextfield().type('Myo');

    cyGetFlepzEmailTextfield().type(`test${+Date.now()}@siriusxm.com`);

    cyGetFlepzPhoneNumberTextfield().type('2222222222');

    cyGetFlepzZipCodeTextfield()
        .first()
        .type('10002');
};

function checkOrderDetails() {
    cyGetOrderSummary().should('be.visible');

    cy.sxmEnsureNoMissingTranslations();

    cyGetOrderSummaryAccordionContentCard()
        .should('have.length', 2)
        .first()
        .within(() => {
            cyGetContentCardOrderDetailsAmount().should('contain', '$29.94');
            cyGetContentCardOrderDetailsTermAndPrice().should('contain', '6 Months for $4.99/mo');
            cyGetContentCardOrderDetailsFeesAndTaxesAmount().should('contain', '$6.41');
            cyGetContentCardOrderDetailsTotalDueText().should('contain', 'Total - Due Now');
            cyGetContentCardOrderDetailsTotalDue().should('contain', '$36.35');
        });
    cyGetSummaryCardNonStudentRecurringCharge().should('contain', '$20.63 starting on 03/15/2021');
    cyGetOrderSummaryAccordionContentCard()
        .eq(1)
        .should('be.visible') // let's click to make it visible first?
        .within(() => {
            cyGetContentCardOrderDetailsAmount().should('contain', '$16.99');
            cyGetContentCardOrderDetailsTermAndPrice().should('contain', 'Monthly Plan');
            cyGetContentCardOrderDetailsFeesAndTaxesAmount().should('contain', '$3.64');
            cyGetContentCardOrderDetailsTotalDueText().should('contain', 'Total Due - 03/15/2021');
            cyGetContentCardOrderDetailsTotalDue().should('contain', '$20.63');
        });
}

function checkConfirmationPage() {
    sxmCheckPageLocation('/subscribe/checkout/thanks');

    cy.get('app-thanks').should('be.visible');

    cy.sxmEnsureNoMissingTranslations();

    cyGetPersonalInfo().should('contain', 'Radio ID: (****00AP)');

    checkOrderDetails();
}

function checkAccordionSteps({ hasUpsells = false }) {
    const accordionTitles = ['1. Verify your device', '2. Your billing information'].concat(
        hasUpsells ? ['3. Choose plan upgrades', '4. Review and complete your order'] : ['3. Review and complete your order']
    );

    accordionTitles.forEach((title, i) =>
        cyGetPurchaseAccordionItemTitle()
            .eq(i)
            .should('contain', title)
    );
}

function checkAccordionCurrentStep(step: number, hasUpsells = false) {
    const indices = hasUpsells ? [0, 1, 2, 3] : [0, 1, 2];

    indices.splice(step, 1);

    indices.forEach(i =>
        cyGetPurchaseAccordionItemContent()
            .eq(i)
            .should('not.be.visible')
    );

    cyGetPurchaseAccordionItemContent()
        .eq(step)
        .should('be.visible');
}

describe('Checkout Flepz', () => {
    beforeEach(() => {
        cy.server();
        cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers/all-package-desc`, mockResponseAllPackageDesc);
        cy.route('GET', `${Cypress.env('microservicesEndpoint')}/services/utility/env-info`, mockResponseEnvInfo);
    });
    describe('landing - successful verification', () => {
        describe('Full-price', () => {
            it('Fallback offer', () => {
                mockRoutesFromHAR(require('../../../fixtures/use-cases/checkout/flepz-smoke.har.json'));

                cy.visit('/subscribe/checkout/flepz');

                cy.sxmWaitForSpinner();

                checkAccordionSteps({ hasUpsells: false });
                checkAccordionCurrentStep(0);

                // Step 1 is visible
                cyGetPurchaseAccordionItemContent()
                    .first()
                    .should('not.be.hidden');

                cyGetFlepzVerifyDeviceTabs().should('be.visible');

                cy.sxmEnsureNoMissingTranslations();

                cyGetOfferPromoPriceAndTerm().should(elem => expect(elem.text()).to.equal('$16.99/mo'));
                cyGetOfferDescriptionFooter().should(elem =>
                    expect(elem.text()).to.equal('Get ad-free music, plus sports, news, talk, entertainment and more -- all in one place.')
                );

                cyGetVerifyDeviceTabsFlepzForm().should('be.visible');
                cyGetVerifyDeviceTabsFlepzForm().scrollIntoView();

                fillOutFlepzForm();

                cyGetFlepzFormContinueButton().click({ force: true });

                cyGetSxmUiModalContent()
                    .should('be.visible')
                    .within(() => {
                        cyGetYourInfo().should('be.visible');
                        // TODO: Check more things in your-info
                        cyGetYourInfoContinueButton().click({ force: true }); // dismiss the modal
                    });

                const upsellsRouteAlias = getAliasForURL('POST', '/services/offers/upsell');
                cy.wait(`@${upsellsRouteAlias}`);

                cy.sxmEnsureNoMissingTranslations();

                // We should now have upsells
                checkAccordionSteps({ hasUpsells: true });

                checkAccordionCurrentStep(1);

                cyGetOfferPromoPriceAndTerm().should(elem => expect(elem.text()).to.equal('6 months for $4.99/mo'));
                cyGetOfferDescriptionFooter()
                    .should('contain', '$29.94  for 6 months') // double-space
                    .should('contain', '70% off the regular monthly price of $16.99.');

                cyGetYourDeviceInfo()
                    .should('contain', 'No Active Service')
                    .should('contain', 'Closed: 09/15/2020');

                cyGetPaymentInfoUseExistingCard().click({ force: true });
                cyGetPaymentConfirmationButton().click({ force: true });

                checkAccordionCurrentStep(2);

                cyGetOfferUpsell()
                    .should('be.visible')
                    .within(() => {
                        cy.sxmEnsureNoMissingTranslations();
                        cyGetOfferUpsellContentCard()
                            .should('be.visible')
                            .should('have.length', 2)
                            .within(cards => {
                                cy.wrap(cards)
                                    .eq(0)
                                    .within(() => {
                                        cyGetOfferUpsellContentCardHeader().should('contain', 'Upgrade to SiriusXM All Access');
                                        cyGetOfferUpsellContentCardDescription().should('contain', 'Add premium channels plus streaming for an additional $3.34 per month');
                                    });
                                cy.wrap(cards)
                                    .eq(1)
                                    .within(() => {
                                        cyGetOfferUpsellContentCardHeader().should('contain', 'Start with 12 Months and Save');
                                        cyGetOfferUpsellContentCardDescription().should('contain', 'Add 6 more months for an additional $3.26 per month');
                                    });
                            });
                    });

                // check over the offer details
                cyGetOfferDetails().should(elem => {
                    expect(elem).to.contain('pay $29.94 for your first 6 months');
                    expect(elem).to.contain('savings of 70% off the current monthly rate of $16.99');
                });

                cyGetOfferUpsellContinueButton().click({ force: true });

                checkAccordionCurrentStep(3);

                checkOrderDetails();

                // accept payment
                cyGetChargeAgreementCheckbox().check({ force: true });

                // Submit confirmation
                cyGetReviewOrderCompleteButton().click({ force: true });

                checkConfirmationPage();
            });
        });
    });
});
