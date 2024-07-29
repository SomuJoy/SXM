import { Before, Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { mockNewSatelliteSubscriptionAPICalls } from '../price-increase.helpers';

Before(() => {
    mockNewSatelliteSubscriptionAPICalls();
});

Given('a potential customer', () => {
    cy.visit('/subscribe/checkout/streaming');
});

When('purchasing a new subscription', () => {});

Then('customer must see a price increase message', () => {});
