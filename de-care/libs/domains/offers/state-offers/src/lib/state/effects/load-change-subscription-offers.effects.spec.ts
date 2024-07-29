import { hot } from 'jasmine-marbles';
import { Mock } from 'ts-mockery';
import { of, throwError } from 'rxjs';
import { loadCustomerChangeSubscriptionOffers, loadOffersError, setOffers } from '../actions/load-offers.actions';
import { DataChangeOffersService } from '../../data-services/data-change-offers.service';
import { LoadChangeSubscriptionOffersEffects } from './load-change-subscription-offers.effects';

describe('LoadChangeSubscriptionOffersEffects', () => {
    describe('loadCustomerChangeSubscriptionOffers$', () => {
        it('should return error action type on failed service call', () => {
            const actions$ = hot('-a', { a: loadCustomerChangeSubscriptionOffers({ subscriptionId: 1 }) });
            const mockDataChangeOfferService = Mock.of<DataChangeOffersService>({ getCustomerChangeOffers: () => throwError(new Error('error')) });
            const effects = new LoadChangeSubscriptionOffersEffects(actions$, mockDataChangeOfferService);
            expect(effects.loadCustomerChangeSubscriptionOffers$).toBeObservable(hot('-a', { a: expect.objectContaining({ type: loadOffersError.type }) }));
        });
        it('should return set offer action type on successful service call', () => {
            const actions$ = hot('-a', { a: loadCustomerChangeSubscriptionOffers({ subscriptionId: 1 }) });
            const mockDataChangeOfferService = Mock.of<DataChangeOffersService>({ getCustomerChangeOffers: () => of([{}]) });
            const effects = new LoadChangeSubscriptionOffersEffects(actions$, mockDataChangeOfferService);
            expect(effects.loadCustomerChangeSubscriptionOffers$).toBeObservable(hot('-a', { a: expect.objectContaining({ type: setOffers.type }) }));
        });
    });
});
