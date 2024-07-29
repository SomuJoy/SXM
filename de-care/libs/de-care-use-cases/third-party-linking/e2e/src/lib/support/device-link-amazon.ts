import { pendingActionMessage, redirectMessage } from '@de-care/de-care-use-cases/third-party-linking/feature-device-link-amazon';

export function mockAmazonPageSuccess(win) {
    cy.stub(win, 'open', () => {
        // Instead of opening new tab, just broadcast the message that the login-complete-handler-page does on success
        win.postMessage({ code: '200' }, win.location.origin);
    });
}

const servicesUrlPrefix = `${Cypress.env('microservicesEndpoint')}/services`;

export function mockRouteForDeviceLinkSuccess() {
    cy.route('POST', `${servicesUrlPrefix}/authenticate/linking/amazon`, require('../fixtures/amazon-link-success.json'));
}

export function mockRouteForDeviceLinkFail() {
    cy.route('POST', `${servicesUrlPrefix}/authenticate/linking/amazon`, require('../fixtures/amazon-link-fail.json'));
}

export function confirmLandingPageShowsRedirectMessage() {
    sxmWaitForSpinner();
    cy.get(redirectMessage).should('be.visible');
}

export function confirmGenericErrorPage() {
    sxmWaitForSpinner();
    sxmCheckPageLocation('/error');
}

export function simulateWait() {
    cy.wait(2100);
}

export function confirmLandingPageShowsPendingActionMessage() {
    cy.get(pendingActionMessage).should('be.visible');
}

export function confirmAmazonLoginProcessStarted() {
    cy.window()
        .its('open')
        .should('be.called');
    // TODO: see if we can check to confirm it was called with the Amazon URL
}

export function confirmDeviceLinkAmazonSuccessPage() {
    sxmWaitForSpinner();
    sxmCheckPageLocation('/subscribe/linking/device-link-amazon/success');
}

export function confirmDeviceLinkAmazonErrorPage() {
    sxmWaitForSpinner();
    sxmCheckPageLocation('/subscribe/linking/device-link-amazon/error');
}

// TODO: Move these to shared e2e
const cyGetSpinner = () => cy.get('#sxm-loader', { timeout: 10000 });
function sxmWaitForSpinner() {
    cyGetSpinner()
        .should('be.visible')
        .then(() => {
            cyGetSpinner().should('not.be.visible');
        });
}
function sxmCheckPageLocation(expectedPath: string) {
    cy.location().should(loc => {
        expect(loc.pathname).to.eq(expectedPath);
    });
}
