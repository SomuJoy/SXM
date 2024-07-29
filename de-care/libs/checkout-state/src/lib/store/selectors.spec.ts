import { SweepstakesModel } from '@de-care/data-services';
import { sweepstakesEligible, sweepstakesId, sweepstakesOfficialRulesUrl, sweepstakesInfo } from './selectors';

describe('checkout-state selectors', () => {
    const sweepstakesState: SweepstakesModel = {
        id: 'abcd',
        officialRulesUrl: 'url'
    };

    describe('sweepstakesEligible', () => {
        it('should return true if contestId present with value', () => {
            expect(sweepstakesEligible.projector(sweepstakesState)).toBe(true);
        });

        it('should return false if sweepstakes state is null', () => {
            expect(sweepstakesEligible.projector(null)).toBe(false);
        });

        it('should return false if contestId not present', () => {
            expect(sweepstakesEligible.projector({})).toBe(false);
        });

        it('should return false if contestId is empty', () => {
            expect(sweepstakesEligible.projector({ id: '' })).toBe(false);
        });
    });

    describe('sweepstakesId', () => {
        it('should return id if eligible', () => {
            expect(sweepstakesId.projector(sweepstakesState, true)).toBe(sweepstakesState.id);
        });

        it('should return null if not eligible', () => {
            expect(sweepstakesId.projector(sweepstakesState, false)).toBe(null);
        });
    });

    describe('sweepstakesOfficialRulesUrl', () => {
        it('should return rules URL if eligible', () => {
            expect(sweepstakesOfficialRulesUrl.projector(sweepstakesState, true)).toBe(sweepstakesState.officialRulesUrl);
        });

        it('should return null if not eligible', () => {
            expect(sweepstakesOfficialRulesUrl.projector(sweepstakesState, false)).toBe(null);
        });
    });

    describe('sweepstakesInfo', () => {
        it('should return entire sweepstakes state if eligible', () => {
            expect(sweepstakesInfo.projector(sweepstakesState, true)).toBe(sweepstakesState);
        });

        it('should return null if not eligible', () => {
            expect(sweepstakesInfo.projector(sweepstakesState, false)).toBe(null);
        });
    });
});
