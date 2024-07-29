import { mockRoutesFromHAR } from '@de-care/shared/e2e';
import { cyGetAdSupportedTierOneClickConfirmationPage, cyGetCoreError500Page } from '../support/ad-supported-tier.po';

export function mockRoutesForAdSupportedTierOneClickSuccess(): void {
    mockRoutesFromHAR(require('../fixtures/ad-supported-tier-token-call.har.json'));
}

export function mockRoutesForAdSupportedTierOneClickFailure(): void {
    mockRoutesFromHAR(require('../fixtures/ad-supported-tier-token-call-already-active.har.json'));
}

export function checkAdSupportedTierOneClickConfirmationPage() {
    cyGetAdSupportedTierOneClickConfirmationPage().should('be.visible');
}

export function checkInternalServerError() {
    cyGetCoreError500Page().should('be.visible');
}
