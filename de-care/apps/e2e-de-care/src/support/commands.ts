// @ts-check
///<reference path="../global.d.ts" />

import './stubs/cms/cms';
import './stubs/common/common';
import './stubs/de-microservices/account';
import './stubs/de-microservices/apigateway';
import './stubs/de-microservices/authenticate';
import './stubs/de-microservices/device';
import './stubs/de-microservices/identity';
import './stubs/de-microservices/offers';
import './stubs/de-microservices/quotes';
import './stubs/de-microservices/utility';
import './stubs/de-microservices/validate';
import './ui-common/account-registration';
import './ui-common/app-event-data';
import './ui-common/package-cards';
import './ui-common/dropdown-fields';

beforeEach(() => {
    cy.stubSockJs();
});
