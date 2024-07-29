import { mockRoutesFromHAR } from '@de-care/shared/e2e';

export const mockDefaultOfferForInvalidProgramCode = () => {
    mockRoutesFromHAR(require('../fixtures/organic-invalid-program-code.har.json'));
};

export const mockDefaultOfferForExpiredProgramCode = () => {
    mockRoutesFromHAR(require('../fixtures/organic-expired-program-code.har.json'));
};

export const mockDefaultOfferForValidProgramCode = () => {
    mockRoutesFromHAR(require('../fixtures/organic-valid-program-code.har.json'));
};
