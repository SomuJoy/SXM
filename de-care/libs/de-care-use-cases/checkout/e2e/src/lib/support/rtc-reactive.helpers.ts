import { mockRoutesFromHAR, cyGetHeroComponentHeading } from '@de-care/shared/e2e';
import {
    cyGetAccountInfoAccountNumber,
    cyGetAccountInfoContinueButton,
    cyGetAccountInfoRadioId,
    cyGetChargeAgreementCheckbox,
    cyGetPaymentConfirmationButton,
    cyGetPaymentInfoUseExistingCard,
    cyGetPromoDealBestPacakage,
    cyGetPurchaseAccordionItemContent,
    cyGetReviewOrderCompleteButton,
    cyGetReviewSubscriptionOptionsLink,
    cyGetSatelliteStreamingLandingPage,
    cyGetSatelliteStreamingThanksPage,
    cyGetYourInfoModalContinueButton,
    cyGetPromoDealRightImage,
    cyGetHuluPromoDescription,
    cyGetPromoDealChannelDescriptions,
    cyGetHuluBottomHeader,
    cyGetHuluBottomContent,
    cyGetAccordionButton
} from './rtc.po';

export function mockRoutesForRtcReactiveTargetedSuccess(): void {
    mockRoutesFromHAR(require('../fixtures/RTC-reactive-targeted.har.json'));
}

export function mockRoutesForRtcReactiveOrganicSuccess(): void {
    mockRoutesFromHAR(require('../fixtures/RTC-reactive-organic.har.json'));
}

export function mockRoutesForRtcReactiveOrganicSuccessAfterIdentification(): void {
    mockRoutesFromHAR(require('../fixtures/RTC-reactive-organic-after-identification.har.json'));
}

export function checkSatelliteStreamingPage(): void {
    cyGetSatelliteStreamingLandingPage().should('exist');
}

export function clickOnSubscriptionOptions(): void {
    cyGetReviewSubscriptionOptionsLink()
        .should('exist')
        .then(() => {
            cyGetReviewSubscriptionOptionsLink().click();
        });
}

export function selectCurrentBillingOption(): void {
    cyGetPaymentInfoUseExistingCard()
        .should('be.visible')
        .click({ force: true });
}

export function clickPaymentConfirmationButton(): void {
    cyGetPaymentConfirmationButton()
        .should('be.visible')
        .click({ force: true });
}

export function clickChargeAgreementCheckbox(): void {
    cyGetChargeAgreementCheckbox()
        .should('be.visible')
        .click({ force: true });
}

export function clickGetReviewOrderCompleteButton(): void {
    cyGetReviewOrderCompleteButton()
        .should('be.visible')
        .click({ force: true });
}

export function checkAccordionStepToBeactive(index: number | 'last'): void {
    let element: Cypress.Chainable<JQuery<HTMLElement>>;

    if (index === 'last') {
        element = cyGetPurchaseAccordionItemContent().last();
    } else {
        element = cyGetPurchaseAccordionItemContent().eq(index);
    }
    element.should('be.visible');
}

export function checkForThankYouPage(): void {
    cyGetSatelliteStreamingThanksPage().should('be.visible');
}

export function fillAccountInfoForm(radioId: string, accountNumber: string): void {
    cyGetAccountInfoRadioId()
        .should('be.visible')
        .then(() => {
            cyGetAccountInfoRadioId().type(radioId);
        });

    cyGetAccountInfoAccountNumber()
        .should('be.visible')
        .then(() => {
            cyGetAccountInfoAccountNumber().type(accountNumber);
        });
}

export function clickAccountInfoFormContinue(): void {
    cyGetAccountInfoContinueButton().click();
}

export function clickYourInfoModalContinue(): void {
    cyGetYourInfoModalContinueButton().click();
}

//For Hulu
export function checkForHuluHeroHeader() {
    cyGetHeroComponentHeading().should(elem => expect(elem.text()).to.contain('Get SiriusXM with a 3-month Hulu trial'));
}

export function checkForHuluPromoDeal() {
    cyGetPromoDealBestPacakage().should(elem => expect(elem.text()).to.contain('PLUS HULU'));
}

export function checkForHuluPromoDealImageSource() {
    cyGetPromoDealRightImage().should(elem => {
        expect(elem.attr('src')).to.equal('assets/img/promo-deal-hulu.png');
    });
}

export function checkForHuluPromoDealDescription() {
    cyGetHuluPromoDescription().should(elem =>
        expect(elem.text()).to.contain(
            `Enjoy the largest streaming TV library of current hits. Full seasons. Movies. Kids shows, and tons more through Hulu's ad-supported plan.`
        )
    );
}

export function checkForHiddenHuluPromoDealChannelDescription() {
    cyGetPromoDealChannelDescriptions().should('not.be.visible');
}

export function checkForHuluPromoDealChannelDescription() {
    cyGetPromoDealChannelDescriptions().should('be.visible');
}

export function checkForHiddenHuluBottomSection() {
    cyGetHuluBottomHeader().should('not.be.visible');
    cyGetHuluBottomContent().should('not.be.visible');
}

export function clickViewMoreButton() {
    cyGetAccordionButton().should(elem => elem[1].click());
}

export function checkForHuluBottomSection() {
    cyGetHuluBottomHeader().should('be.visible');
    cyGetHuluBottomContent().should('be.visible');
}
