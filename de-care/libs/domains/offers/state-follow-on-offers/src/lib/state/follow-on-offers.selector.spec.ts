import { selectFirstFollowOnOfferPlanCode, selectFirstFollowOnOffer } from './follow-on-offers.selector';

describe('follow on offers selectors', () => {
    describe('selectFirstFollowOnOffer', () => {
        it('should return the first follow on offer when there is at least 1 follow on offer', () => {
            const mockFollowOnOffer = { planCode: 'test' };
            const mockFollowOnOffers = [mockFollowOnOffer];
            expect(selectFirstFollowOnOffer.projector({ followOnOffers: mockFollowOnOffers })).toBe(mockFollowOnOffer);
        });
        it('should return null when there is an empty array of follow on offers', () => {
            const mockFollowOnOffers = [];
            expect(selectFirstFollowOnOffer.projector({ followOnOffers: mockFollowOnOffers })).toBe(null);
        });
        it('should return null when follow on offers is null', () => {
            const mockFollowOnOffers = null;
            expect(selectFirstFollowOnOffer.projector({ followOnOffers: mockFollowOnOffers })).toBe(null);
        });
    });
    describe('selectFirstFollowOnOfferPlanCode', () => {
        it('should return plan code when there is a follow on offer', () => {
            const planCode = 'test';
            const mockFollowOnOffer = { planCode };
            expect(selectFirstFollowOnOfferPlanCode.projector(mockFollowOnOffer)).toBe(planCode);
        });
        it('should return null when there are no follow on offers', () => {
            expect(selectFirstFollowOnOfferPlanCode.projector(null)).toBe(null);
        });
    });
});
