export function mockSessionTimeout(url: string): void {
    cy.route({
        method: 'POST',
        url,
        status: 401,
        response: require('../fixtures/session-timeout.json')
    });
}
