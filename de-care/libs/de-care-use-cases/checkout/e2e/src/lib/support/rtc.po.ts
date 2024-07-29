import { e2eRtcLandingPage, e2eSatelliteStreamingPurchasePage, e2eSatelliteStreamingThanksPage, e2eDefaultOfferV1OfferDetails, e2eDefaultOfferHero } from '@de-care/checkout';
import { e2ePaymentConfirmationButton, e2ePaymentInfoUseExistingCard } from '@de-care/customer-info';
import { e2eAccountInfoAccountNumber, e2eAccountInfoContinueButton, e2eAccountInfoRadioId, e2eYourInfoContinueButton } from '@de-care/identification';
import { e2eRtcPlanComparisonGridButton } from '@de-care/offers';
import { e2ePurchaseAccordionItemContent, e2eReviewOrderCompleteButton, e2eReviewSubscriptionOptionsLink } from '@de-care/purchase';
import { e2eChargeAgreementCheckbox } from '@de-care/review-order';
import {
    e2ePromoDealCardOurBestPackage,
    e2ePromoDealRightImage,
    e2ePromoDealChannelDescriptions,
    e2eHuluPromoDescription,
    e2eHuluBottomHeader,
    e2ePromoDealAccordionContainer,
    e2eHuluBottomContent
} from '@de-care/sales-common';

export const cyGetMainProactiveLandingPage = () => cy.get(e2eRtcLandingPage);
export const cyGetFollowonSelectionOptions = () => cy.get('[data-e2e="rtcFollowOnSelectionOption"]');
export const cyGetPlanComparisonGridButton = () => cy.get(e2eRtcPlanComparisonGridButton);
export const cyGetSatelliteStreamingLandingPage = () => cy.get(e2eSatelliteStreamingPurchasePage);
export const cyGetReviewSubscriptionOptionsLink = () => cy.get(e2eReviewSubscriptionOptionsLink);
export const cyGetPaymentInfoUseExistingCard = () => cy.get(e2ePaymentInfoUseExistingCard);
export const cyGetPaymentConfirmationButton = () => cy.get(e2ePaymentConfirmationButton);
export const cyGetChargeAgreementCheckbox = () => cy.get(e2eChargeAgreementCheckbox);
export const cyGetReviewOrderCompleteButton = () => cy.get(e2eReviewOrderCompleteButton);
export const cyGetPurchaseAccordionItemContent = () => cy.get(e2ePurchaseAccordionItemContent);
export const cyGetSatelliteStreamingThanksPage = () => cy.get(e2eSatelliteStreamingThanksPage);
export const cyGetAccountInfoRadioId = () => cy.get(e2eAccountInfoRadioId);
export const cyGetAccountInfoAccountNumber = () => cy.get(e2eAccountInfoAccountNumber);
export const cyGetAccountInfoContinueButton = () => cy.get(e2eAccountInfoContinueButton);
export const cyGetYourInfoModalContinueButton = () => cy.get(e2eYourInfoContinueButton);
export const cyGetPromoDealBestPacakage = () => cy.get(e2ePromoDealCardOurBestPackage);
export const cyGetPromoDealRightImage = () => cy.get(e2ePromoDealRightImage);
export const cyGetPromoDealChannelDescriptions = () => cy.get(e2ePromoDealChannelDescriptions);
export const cyGetHuluPromoDescription = () => cy.get(e2eHuluPromoDescription);
export const cyGetHuluBottomHeader = () => cy.get(e2eHuluBottomHeader);
export const cyGetHuluBottomContent = () => cy.get(e2eHuluBottomContent);
export const cyGetAccordionButton = () => cy.get(e2ePromoDealAccordionContainer).get('button#accordion-btn');

export const cyGetDefaultOfferV1Hero = () => cy.get(e2eDefaultOfferHero);
export const cyGetDefaultOfferV2Hero = () => cy.get(e2eDefaultOfferHero);
export const cyGetDefaultOfferV1OfferDetails = () => cy.get(e2eDefaultOfferV1OfferDetails);
