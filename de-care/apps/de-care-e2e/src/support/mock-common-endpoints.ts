import { createMockResponse } from '@de-care/shared/e2e';

Cypress.Commands.add('sxmMockCardBinRanges', () => {
    createMockResponse({
        jsonPath: 'common/card-bin-ranges',
        alias: 'cardBinRanges',
        verb: 'POST',
        endpoint: '/services/utility/card-bin-ranges'
    });
});

Cypress.Commands.add('sxmMockIpConfig', () => {
    createMockResponse({
        jsonPath: 'common/ip2location-success-ny',
        alias: 'ip2location',
        verb: 'POST',
        endpoint: '/services/utility/ip2location'
    });
});

Cypress.Commands.add('sxmMockAllPackageDesc', () => {
    createMockResponse({
        jsonPath: 'common/all-package-descriptions',
        alias: 'allPackageDesc',
        verb: 'POST',
        endpoint: '/services/offers/all-package-desc'
    });
});

Cypress.Commands.add('sxmMockEnvInfo', () => {
    createMockResponse({
        jsonPath: 'common/env-info',
        alias: 'envInfo',
        verb: 'GET',
        endpoint: '/services/utility/env-info'
    });
});

Cypress.Commands.add('sxmMockEmailIdentityValidationSuccess', () => {
    createMockResponse({
        jsonPath: 'common/email-identity-validation-success',
        alias: 'email',
        verb: 'POST',
        endpoint: '/services/identity/customer/email'
    });
});

Cypress.Commands.add('sxmMockPasswordValidationSuccess', () => {
    createMockResponse({
        jsonPath: 'common/password-validation-success',
        alias: 'password',
        verb: 'POST',
        endpoint: '/services/validate/password'
    });
});

Cypress.Commands.add('sxmMockEmailValidationSuccess', () => {
    createMockResponse({
        jsonPath: 'common/email-validation-success',
        alias: 'email',
        verb: 'POST',
        endpoint: '/services/validate/customer-info'
    });
});

Cypress.Commands.add('sxmMockAddressesAndCCValidationSuccess', () => {
    createMockResponse({
        jsonPath: 'common/addresses-and-cc-validation-success',
        alias: 'addresses-and-cc',
        verb: 'POST',
        endpoint: '/services/validate/customer-info'
    });
});

Cypress.Commands.add('sxmMockIP2LocationSuccess', () => {
    createMockResponse({
        jsonPath: 'common/ip-2-location-success',
        alias: 'ip-2-location',
        verb: 'POST',
        endpoint: '/services/utility/ip2location'
    });
});
