import { mockRoutesFromHAR } from '@de-care/shared/e2e';

export function mockRoutesForSwapAlreadyUsedRadioId(): void {
    mockRoutesFromHAR(require('../../../../../fixtures/use-cases/transfer/organic/transfer-radio-id-is-on-same-account-har.json'));
}

export function mockRoutesForSwapTrialRadioIdHasSelfPay(): void {
    mockRoutesFromHAR(require('../../../../../fixtures/use-cases/transfer/organic/transfer-trial-has-self-pay-har.json'));
}

export function mockRoutesFor_LIFE_TIME_PLAN(): void {
    mockRoutesFromHAR(require('../../../../../fixtures/use-cases/transfer/organic/transfer-radio-id-is-life-time-plan-har.json'));
}

export function mockRoutesFor_LACKS_CAPABILITIES(): void {
    mockRoutesFromHAR(require('../../../../../fixtures/use-cases/transfer/organic/transfer-radio-id-is-lacks-capabilities-har.json'));
}

export function mockRoutesFor_AC_AND_SC_eligibility(): void {
    mockRoutesFromHAR(require('../../../../../fixtures/use-cases/transfer/organic/transfer-AC_AND_SC-har.json'));
}

export function mockRoutesFor_SWAP_eligible(): void {
    mockRoutesFromHAR(require('../../../../../fixtures/use-cases/transfer/organic/transfer-SWAP-har.json'));
}

export function inputRadioId(radioId) {
    const radionInput = cy.get('[data-e2e="radioIdForm"] input');
    radionInput.clear();
    radionInput.type(radioId, { force: true });
}

export function findMyRadioButtonClick() {
    cy.get('[data-e2e="findMyRadioButton"]').click({ force: true });
}
