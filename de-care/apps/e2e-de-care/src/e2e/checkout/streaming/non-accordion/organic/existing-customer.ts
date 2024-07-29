import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import {
    stubAccountLookupExistingMultipleStreaming,
    stubAccountLookupExistingMultipleWithAndWithoutFollowOn,
    stubAccountLookupExistingSingleStreaming,
    stubAccountLookupExistingSingleTrial,
} from '../../common-utils/stubs';
import { fillOutAndSubmitAccountLookupForm, goToCredentialsStep } from '../common-utils/ui';
import { stubOffersSuccessDigitalRtpFree } from '../../../../../support/stubs/de-microservices/offers';

Before(() => {
    cy.viewport('iphone-x');
    stubOffersSuccessDigitalRtpFree();
});

// Scenario: Customer with single streaming subscription
When('a customer uses an email address that has a single streaming subscription when visiting the page with a valid program code', () => {
    goToCredentialsStep();
    stubAccountLookupExistingSingleStreaming();
    fillOutAndSubmitAccountLookupForm();
});
Then('they should be presented with the subscription found modal and the listen link', () => {
    cy.get('#streamingFoundModalBodyTitle').should('be.visible');
    cy.get('#streamingFoundModal a.player-link').should('have.length', 1).should('be.visible').should('contain', 'Listen');
});

// Scenario: Customer with multiple streaming subscription
When('a customer uses an email address that has multiple streaming subscriptions when visiting the page with a valid program code', () => {
    goToCredentialsStep();
    stubAccountLookupExistingMultipleStreaming();
    fillOutAndSubmitAccountLookupForm();
});
Then('they should be presented with the subscription found modal and multiple listen links', () => {
    cy.get('#streamingFoundModalBodyTitle').should('be.visible');
    cy.get('#streamingFoundModal a.player-link').should('have.length', 2).should('be.visible').should('contain', 'Listen');
});

// Scenario: Customer with single trial subscription
When('a customer uses an email address that has a single trial subscription when visiting the page with a valid program code', () => {
    goToCredentialsStep();
    stubAccountLookupExistingSingleTrial();
    fillOutAndSubmitAccountLookupForm();
});
Then('they should be presented with the subscription found modal and the subscribe link', () => {
    cy.get('#streamingFoundModalBodyTitle').should('be.visible');
    cy.get('#streamingFoundModal a.subscribe-link').should('have.length', 1).should('be.visible').should('contain', 'Subscribe');
});

// Scenario: Customer with multiple trial subscriptions
When('a customer uses an email address that has multiple trial subscriptions and some with follow ons when visiting the page with a valid program code', () => {
    goToCredentialsStep();
    stubAccountLookupExistingMultipleWithAndWithoutFollowOn();
    fillOutAndSubmitAccountLookupForm();
});
Then('they should be presented with the subscription found modal and the subscribe link and listen link', () => {
    cy.get('#streamingFoundModalBodyTitle').should('be.visible');
    cy.get('#streamingFoundModal a.subscribe-link').should('have.length', 1).should('be.visible').should('contain', 'Subscribe');
    cy.get('#streamingFoundModal a.player-link').should('have.length', 2).should('be.visible').should('contain', 'Listen');
});
