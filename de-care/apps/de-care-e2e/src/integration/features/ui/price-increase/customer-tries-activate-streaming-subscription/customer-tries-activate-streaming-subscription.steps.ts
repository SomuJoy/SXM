import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import { mockCustomerTriesActivateStreamingAPICalls } from '../price-increase.helpers';

Before(() => {
    mockCustomerTriesActivateStreamingAPICalls();
});

Given('a potential streaming customer', () => {
    cy.visit('/subscribe/checkout/streaming');
});
When('activates a new subscription', () => {});
Then('do not show the message', () => {});
