import { mockRoutesFromHAR } from '@de-care/shared/e2e';

export function mockRoutesForCustomerRTPSuccessfullyPurchasesChoiceAndCreatesNewAccount(): void {
    mockRoutesFromHAR(require('../fixtures/rtp-choice-flow.har.json'));
}
