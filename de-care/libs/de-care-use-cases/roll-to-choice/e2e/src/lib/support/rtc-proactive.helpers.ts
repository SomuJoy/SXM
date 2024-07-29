import { cyGetYourInfoContinueButton } from '@de-care/shared/e2e';
import {
    cyGetMainProactiveOrganicLandingPage,
    cyGetFollowOnSelectionOptions,
    cyGetAccountInfoRadioId,
    cyGetAccountInfoAccountNumber,
    cyGetAccountInfoContinueButton,
    cyGetPlanComparisonGridButton,
    cyGetGenreFormComponent,
    cyGetAccountCardComponent,
    cyGetRTCFollowOnPlanNotAvaliableError,
    cyGetRTCChoiceGenreSelectionFormFirstOption,
    cyGetRTCChoiceGenreSelectionFormSubmitButton,
    cyGetPaymentConfirmationButton,
    cyGetPaymentInfoUseExistingCard,
    cyGetChargeAgreementCheckbox,
    cyGetReviewOrderCompleteButton,
    cyGetAppThanksComponent,
    cyGetOfferDetails,
    cyGetRTCChoiceGenreSelectionFormError
} from './rtc.po';

export enum RTCSelectOptionEnum {
    CHOICE = 0,
    SELECT = 1,
    ALL_ACCESS = 2
}

const servicesUrlPrefix = `${Cypress.env('microservicesEndpoint')}/services`;

export function selectRTCSelectionOption(option: RTCSelectOptionEnum): void {
    cyGetFollowOnSelectionOptions()
        .eq(option)
        .click();
}

export function showFindYourAccountCard(): void {
    cyGetAccountCardComponent().trigger('visibilitychange', { force: true });
}

export function fillAccountInfoForm(radioId: string, accountNumber: string): void {
    cyGetAccountInfoRadioId().then(() => {
        cyGetAccountInfoRadioId().type(radioId);
    });
    cyGetAccountInfoAccountNumber().then(() => {
        cyGetAccountInfoAccountNumber().type(accountNumber);
    });
}

export function identifyAndSubmit(radioId: string = '990005142610', accountNumber: string = '10000223279', option = RTCSelectOptionEnum.CHOICE): void {
    selectRTCSelectionOption(option);
    showFindYourAccountCard();
    fillAccountInfoForm(radioId, accountNumber);
    cyGetAccountInfoContinueButton().click({ force: true });
    cyGetYourInfoContinueButton()
        .click({ force: true })
        .then(() => {
            selectPlanGridOptionAndContinue(option);
        });
}

export function identify(radioId: string = '990005142610', accountNumber: string = '10000223279', option = RTCSelectOptionEnum.CHOICE) {
    selectRTCSelectionOption(option);
    showFindYourAccountCard();
    fillAccountInfoForm(radioId, accountNumber);
    cyGetAccountInfoContinueButton().click({ force: true });
    cyGetYourInfoContinueButton().click({ force: true });
}

export function selectPlanGridOptionAndContinue(option: RTCSelectOptionEnum): void {
    cyGetFollowOnSelectionOptions().then(() => {
        cyGetFollowOnSelectionOptions()
            .eq(option)
            .click({ force: true })
            .then(() => {
                cyGetPlanComparisonGridButton().click({ force: true });
            });
    });
}

export function assertGenreFormVisible(): void {
    cyGetGenreFormComponent().should('be.visible');
}

export function assertGenreFormNotVisible(): void {
    cyGetGenreFormComponent().should('not.exist');
}

export function checkMainProactiveOrganicLandingPage(): void {
    cyGetMainProactiveOrganicLandingPage().should('exist');
}

export function selectChoiceGenreFirstOption() {
    return cyGetRTCChoiceGenreSelectionFormFirstOption()
        .find('input')
        .then(el => el.trigger('click'));
}

export function selectChoiceGenreFirstOptionAndContinue(): void {
    selectChoiceGenreFirstOption().then(() => cyGetRTCChoiceGenreSelectionFormSubmitButton().click());
}

export function clickContinueOnChoiceGenreForm(): void {
    cyGetRTCChoiceGenreSelectionFormSubmitButton().click();
}

export function assertChoiceGenreSelectionFormErrorVisible(): void {
    cyGetRTCChoiceGenreSelectionFormError().should('be.visible');
}

export function selectPaymentAndContinue(): void {
    cyGetPaymentInfoUseExistingCard()
        .click({ force: true })
        .then(() => cyGetPaymentConfirmationButton().click({ force: true }));
}

export function agreeAndPurchase(): void {
    cyGetChargeAgreementCheckbox().click({ force: true });
    cyGetReviewOrderCompleteButton().click({ force: true });
}

export function stepThroughPaymentAccordion(): void {
    selectChoiceGenreFirstOptionAndContinue();
    selectPaymentAndContinue();
    agreeAndPurchase();
}

export function assertAppThanksVisible(): void {
    cyGetAppThanksComponent().should('be.visible');
}

export function checkIfOfferDetailsAreForChoice(): void {
    cy.fixture('use-cases/roll-to-choice/choice-offer-details.txt').then(offerDetails => {
        cyGetOfferDetails()
            .should('be.visible')
            .should('contain.text', offerDetails);
    });
}

export function assertRTCFollowOnPlanNotAvaliableError() {
    cyGetRTCFollowOnPlanNotAvaliableError().should('be.visible');
}
