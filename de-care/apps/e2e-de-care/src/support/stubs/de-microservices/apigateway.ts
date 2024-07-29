export const stubApiGatewayUpdateUseCaseSuccess = () => {
    cy.intercept('POST', '**/services/apigateway/update-usecase', { fixture: 'de-microservices/apigateway/update-use-case_success.json' });
};

export const stubApiGatewayBrandedDataCollectionPublishSuccess = () => {
    cy.intercept('POST', '**/services/apigateway/branded-data-collection/publish', { fixture: 'de-microservices/apigateway/branded-data-collection/publish/success.json' });
};
