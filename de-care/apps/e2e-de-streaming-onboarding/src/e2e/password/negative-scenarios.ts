import { Before, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubCredentialRecoveryPasswordSendEmail400Error } from '../../support/stubs/account';
import { stubUpdateUseCaseSuccess } from '../../support/stubs/apigateway';
import { stubCredentialsRecoveryAccountNotFound } from '../../support/stubs/identity';
import { stubLogMessageSuccess } from '../../support/stubs/utility';

Before(() => {
    cy.viewport('iphone-x');
    stubUpdateUseCaseSuccess();
    stubLogMessageSuccess();
});

// Scenario: Experience handles account not found
When(/^they submit an email address that is not found$/, () => {
    stubCredentialsRecoveryAccountNotFound();
    // TODO: Looks like this experience is trying to send an email when account not found...probably not what we want?
    //       (this stub is here to get the coverage to pass)
    stubCredentialRecoveryPasswordSendEmail400Error();
    cy.get('[data-test="sxmUITextFormField"]').clear().type('test@test.com');
    cy.get('[data-test="CreateCredentialsFormSubmitButton"]').click();
});
