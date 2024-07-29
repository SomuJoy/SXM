export const stubTrialServiceLane2ClickTokenSuccess = () => {
    cy.intercept({ method: 'GET', path: `**/services/trial/sltc-token/*` }, { fixture: 'de-microservices/trial/sltc-token/service-lane-2-click.json' });
};

export const stubTrialProspectTokenSuccess = () => {
    cy.intercept({ method: 'GET', path: `**/services/trial/prospect-token/*` }, { fixture: 'de-microservices/trial/prospect-token/success.json' });
};

export const stubTrialActivationOrganicProspectTokenSuccess = () => {
    cy.intercept({ method: 'GET', path: `**/services/trial/prospect-token/*` }, { fixture: 'de-microservices/trial/prospect-token/trial-activation-organic.success.json' });
};

export const stubTrialActivationServiceLaneOneClickWithToken = (token: string) => {
    cy.intercept(
        { method: 'GET', path: `**/services/trial-activation/service-lane-one-click/${token}` },
        { fixture: 'de-microservices/trial/service-lane-one-click/token-success.json' }
    );
};
