export const servicesUrlPrefix = `**/services`;
interface MockResponseConfig {
    jsonPath: string;
    verb: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    endpoint: string;
    alias: string;
}

export const createMockResponse: (config: MockResponseConfig) => void = ({ jsonPath, alias, endpoint, verb }) => {
    cy.route(verb || 'POST', `**${endpoint}`, `fixture:${jsonPath}`).as(alias);
};

export const assertUrlPathMatch: (url: string) => void = (url: string) => cy.location().should(loc => expect(loc.href).to.contain(url));
export const assertUrlDoesNotMatch: (url: string) => void = (url: string) => cy.location().should(loc => expect(loc.href).not.to.contain(url));
