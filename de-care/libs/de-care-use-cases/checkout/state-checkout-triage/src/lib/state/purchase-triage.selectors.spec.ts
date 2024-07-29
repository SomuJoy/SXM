import { getOtherOffersLinkEligible } from './purchase-triage.selectors';

describe('Other Offer Eligible selector', () => {
    it('should return TRUE for programcode=3FOR1MM & pyp=Y', () => {
        const mockQueryParams = { programcode: '3FOR1MM', pyp: 'Y' };
        expect(getOtherOffersLinkEligible.projector(mockQueryParams)).toBe(true);
    });

    it('should return TRUE for programcode=3FOR1MM & pyp=y', () => {
        const mockQueryParams = { programcode: '3FOR1MM', pyp: 'y' };
        expect(getOtherOffersLinkEligible.projector(mockQueryParams)).toBe(true);
    });

    it('should return FALSE for programcode=3FOR1MM and no pyp', () => {
        const mockQueryParams = { programcode: '3FOR1MM' };
        expect(getOtherOffersLinkEligible.projector(mockQueryParams)).toBe(false);
    });

    it('should return FALSE for pyp=N and programcode diferent to 3FOR1MM', () => {
        const mockQueryParams = { programcode: '3FOR1SELECT', pyp: 'Y' };
        expect(getOtherOffersLinkEligible.projector(mockQueryParams)).toBe(false);
    });

    it('should return FALSE for pyp=Y and no programCode', () => {
        const mockQueryParams = { pyp: 'Y' };
        expect(getOtherOffersLinkEligible.projector(mockQueryParams)).toBe(false);
    });

    it('should return FALSE for no pyp and no programcode', () => {
        const mockQueryParams = {};
        expect(getOtherOffersLinkEligible.projector(mockQueryParams)).toBe(false);
    });
});
