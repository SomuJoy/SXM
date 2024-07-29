import { hot } from 'jasmine-marbles';
import { Mock } from 'ts-mockery';
import { of, throwError } from 'rxjs';
import { DataFollowOnOffersService } from '../data-follow-on-offers.service';
import { loadFollowOnOffersError, loadFollowOnOffersForStreamingFromPlanCode, setFollowOnOffers } from './follow-on-offers.actions';
import { FollowOnOffersEffects } from './follow-on-offers.effects';

describe('FollowOnOffersEffects', () => {
    describe('loadFollowOnOffersForStreamingFromPlanCode$', () => {
        it('should return error action type on failed service call', () => {
            const actions$ = hot('-a', { a: loadFollowOnOffersForStreamingFromPlanCode({ planCode: '' }) });
            const mockDataFollowOnOffersService = Mock.of<DataFollowOnOffersService>({ getFollowOnOffer: () => throwError(new Error('error')) });
            const effects = new FollowOnOffersEffects(actions$, mockDataFollowOnOffersService);
            expect(effects.loadFollowOnOffersForStreamingFromPlanCode$).toBeObservable(hot('-a', { a: expect.objectContaining({ type: loadFollowOnOffersError.type }) }));
        });
        it('should return set follow on offers action type on successful service call', () => {
            const actions$ = hot('-a', { a: loadFollowOnOffersForStreamingFromPlanCode({ planCode: '' }) });
            const mockDataFollowOnOffersService = Mock.of<DataFollowOnOffersService>({ getFollowOnOffer: () => of({ offers: [{}] }) });
            const effects = new FollowOnOffersEffects(actions$, mockDataFollowOnOffersService);
            expect(effects.loadFollowOnOffersForStreamingFromPlanCode$).toBeObservable(hot('-a', { a: expect.objectContaining({ type: setFollowOnOffers.type }) }));
        });
    });
});
