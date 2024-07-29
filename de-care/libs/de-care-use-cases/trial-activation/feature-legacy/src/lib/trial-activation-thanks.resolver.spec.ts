import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { Mock } from 'ts-mockery';
import { cold } from 'jasmine-marbles';
import { TrialActivationThanksData, TrialActivationThanksResolver } from './trial-activation-thanks.resolver';
import { ObjectTokenizerService, UrlHelperService } from '@de-care/app-common';

describe('TrialActivationThanksResolver', () => {
    describe('resolve', () => {
        it('should return decoded input data with no differences', () => {
            const objectTokenizerService = new ObjectTokenizerService();
            const resolver = new TrialActivationThanksResolver(new UrlHelperService(), objectTokenizerService);
            const data = {
                email: 'noreply@siriusxm.com',
                radioId: 'test',
                trialEndDate: '2020-04-01',
                isEligibleForRegistration: true,
                isOfferStreamingEligible: true
            };
            const thanksToken = objectTokenizerService.tokenize<TrialActivationThanksData>(data);
            const mockActivatedRouteSnapshot = Mock.of<ActivatedRouteSnapshot>({ queryParamMap: convertToParamMap({ thanksToken }) });
            expect(resolver.resolve(mockActivatedRouteSnapshot)).toBeObservable(cold('(a|)', { a: { ...data } }));
        });
        it('should throw error if thanksToken is null', () => {
            const resolver = new TrialActivationThanksResolver(new UrlHelperService(), new ObjectTokenizerService());
            const mockActivatedRouteSnapshot = Mock.of<ActivatedRouteSnapshot>({ queryParamMap: convertToParamMap({}) });
            expect(resolver.resolve(mockActivatedRouteSnapshot)).toBeObservable(cold('#', null, 'Required query param missing: thanksToken'));
        });
        it('should throw error if decode fails', () => {
            const mockObjectTokenizerService = Mock.of<ObjectTokenizerService>({ detokenize: () => ({ error: true }) });
            const resolver = new TrialActivationThanksResolver(new UrlHelperService(), mockObjectTokenizerService);
            const mockActivatedRouteSnapshot = Mock.of<ActivatedRouteSnapshot>({ queryParamMap: convertToParamMap({ thanksToken: {} }) });
            expect(resolver.resolve(mockActivatedRouteSnapshot)).toBeObservable(cold('#', null, 'Error decoding thanks token'));
        });
    });
});
