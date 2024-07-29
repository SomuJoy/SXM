import { Before, Then } from '@badeball/cypress-cucumber-preprocessor';

Before(() => {});

Then(/^they should land on the targeted confirmation page$/, () => {
    cy.url().should('contain', 'targeted/thanks');
});
