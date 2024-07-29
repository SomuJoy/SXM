export const servicesUrlPrefix = '**';

interface MockResponseConfig {
    jsonPath: string;
    verb: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    endpoint: string;
    alias: string;
}

export const createMockResponse: (config: MockResponseConfig) => void = ({ jsonPath, alias, endpoint, verb }) => {
    cy.route(verb || 'POST', `**${endpoint}`, `fixture:${jsonPath}`).as(alias);
};
