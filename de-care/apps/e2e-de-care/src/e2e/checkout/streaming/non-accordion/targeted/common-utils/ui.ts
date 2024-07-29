export const visitCheckoutTargetedMrdWithAllowedProgramCode = () => {
    cy.visit(`/subscribe/checkout/purchase/streaming/targeted/mrd?tkn=VALID_TOKEN`);
};

export const visitCheckoutTargetedAddStreamingUrl = () => {
    cy.visit(`/subscribe/checkout/purchase/streaming/targeted/add-streaming`);
};

export const visitCheckoutTargetedRtdWithAllowedProgramCode = () => {
    cy.visit(`/subscribe/checkout/purchase/streaming/targeted?tkn=VALID_TOKEN&programcode=ESS1MORETAIL`);
};
