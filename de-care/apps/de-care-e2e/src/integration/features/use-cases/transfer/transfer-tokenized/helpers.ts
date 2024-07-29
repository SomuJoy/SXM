import { mockRoutesFromHAR } from '@de-care/shared/e2e';

export function mockRoutesForACTokenizedSuccess(): void {
    mockRoutesFromHAR(require('../../../../../fixtures/use-cases/transfer/tokenized/transfer-har.json'));
}
export function mockRoutesForACTokenizedFailureAlreadyConsolidatedAndNoFollown(): void {
    mockRoutesFromHAR(require('../../../../../fixtures/use-cases/transfer/tokenized/transfer-already-consolidated-and-no-followon-har.json'));
}
export function mockRoutesForACTokenizedFailureAlreadyConsolidatedAndHasFollown(): void {
    mockRoutesFromHAR(require('../../../../../fixtures/use-cases/transfer/tokenized/transfer-consolidated-and-has-followon-har.json'));
}
export function mockRoutesForSPTokenizedSuccess(): void {
    mockRoutesFromHAR(require('../../../../../fixtures/use-cases/transfer/tokenized/transfer-sp-har.json'));
}
