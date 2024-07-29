import { mockRoutesFromHAR } from '@de-care/shared/e2e';
import { cyGetMainProactiveLandingPage } from './rtc.po';

export function mockRoutesForRtcProactiveTargetedSuccess(): void {
    mockRoutesFromHAR(require('../fixtures/RTC-proactive-targeted.har.json'));
}

export function checkMainProactiveLandingPage(): void {
    cyGetMainProactiveLandingPage().should('exist');
}
