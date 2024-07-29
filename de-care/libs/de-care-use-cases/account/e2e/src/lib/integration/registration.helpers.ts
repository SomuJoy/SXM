import { mockRoutesFromHAR } from '@de-care/shared/e2e';

export const mockMultiAccountRoutes = () => mockRoutesFromHAR(require('../fixtures/registration-multiaccount-withphone.har.json'));
export const mockSingleAccountRoutes = () => mockRoutesFromHAR(require('../fixtures/registration-single-account.har.json'));
export const mockNoAccountRoutes = () => mockRoutesFromHAR(require('../fixtures/registration-no-accounts.har.json'));

export const mockSingleAccountNoPhoneRoutes = () => mockRoutesFromHAR(require('../fixtures/registration-single-account-no-phone.har.json'));
export const mockVerifyAccountNumberSuccess = () => mockRoutesFromHAR(require('../fixtures/registration-verify-account-number-success.har.json'));
export const mockVerifyPhoneNumberSuccess = () => mockRoutesFromHAR(require('../fixtures/registration-verify-phone-number-success.har.json'));
