export const stubAllPackageDescriptionsSuccess = () => {
    cy.intercept('POST', '**/services/offers/all-package-desc', { fixture: 'offers/offers-all-package-descriptions-success.json' });
};
