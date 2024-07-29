Cypress.Commands.add('appEventDataContainsUserErrors', (errors: string[]) => {
    // Note: we don't have Adobe Launch running here so we can't check computedState, just the array object
    let appEventData: any;
    const errorsToFind = new Set(errors);
    cy.window()
        .then((win: any) => {
            appEventData = win.appEventData;
        })
        .then(() => {
            const e = appEventData?.filter((item: any) => item.event === 'user-error')?.at(-1)?.errors;
            cy.wrap(e).should('not.be.empty');
            errorsToFind.forEach((error) => {
                cy.wrap(e)
                    .then((list) => Cypress._.map(list, 'errorName'))
                    .should('include', error);
            });
        });
});
