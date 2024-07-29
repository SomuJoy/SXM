export const visitSonosActivationURL = () => {
    cy.visit(`/onboarding/activate-device-min?activationcode=2FGFN3`);
};

export const visitSonosSignInPage = () => {
    cy.visit(`/onboarding/sign-in/sonos`);
};

export const fillOutSignInForm = () => {
    cy.get('[data-test="sxmUIUsernameFormField"]').clear().type('ximasp.jvgc@siriusxm.com');
    cy.get('[data-test="sxmUIPasswordFormField"]').clear().type('P@ssword!');
};

export const submitSignInForm = () => {
    cy.get('[data-test="signInSubmitFormButton"]').click();
};
export const fillOutSignInFormAndSubmit = () => {
    fillOutSignInForm();
    submitSignInForm();
};

export const visitSonosRegisteredPage = () => {
    cy.visit(`/onboarding/sign-in/sonos/activated`);
};
