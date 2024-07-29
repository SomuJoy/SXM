export const primaryPackageCardIsVisibleAndContains = (text: string) => {
    cy.get('sxm-ui-primary-package-card').should('be.visible').should('contain', text);
};

/**
 * @deprecated Use the function primaryPackageCardIsVisibleAndContains instead of this cy command
 */
Cypress.Commands.add('primaryPackageCardIsVisibleAndContains', (text: string) => {
    primaryPackageCardIsVisibleAndContains(text);
});

Cypress.Commands.add('packageCardBasicIsVisibleAndContains', (text: string[]) => {
    const mainContainer = cy.get('sxm-ui-package-card-basic');
    mainContainer.should('be.visible');
    text.forEach((expectedText) => {
        mainContainer.should('contain', expectedText);
    });
});

Cypress.Commands.add('featuresListIsVisibleAndContains', (text: string[]) => {
    const mainContainer = cy.get('sxm-ui-features-list');
    mainContainer.should('be.visible');
    text.forEach((expectedText) => {
        mainContainer.should('contain', expectedText);
    });
});

Cypress.Commands.add('productBannerIsVisibleAndContains', (text: string[]) => {
    const mainContainer = cy.get('sxm-ui-product-banner');
    mainContainer.should('be.visible');
    text.forEach((expectedText) => {
        mainContainer.should('contain', expectedText);
    });
});
