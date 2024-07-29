import { mockRoutesFromHAR } from '@de-care/shared/e2e';

export function mockNewAccountCreditCardFraud() {
    mockRoutesFromHAR(require('../fixtures/new-account-trial-streaming-cc-fraud.har.json'));
}
