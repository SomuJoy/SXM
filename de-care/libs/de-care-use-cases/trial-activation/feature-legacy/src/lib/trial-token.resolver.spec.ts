import { TrialTokenResolver } from './trial-token.resolver';
import { of, throwError } from 'rxjs';
import { ActivatedRouteSnapshot, convertToParamMap, RouterStateSnapshot } from '@angular/router';
import { cold } from 'jasmine-marbles';
import { ProspectModel, DataTrialService } from '@de-care/data-services';
import { Mock } from 'ts-mockery';
import { UrlHelperService } from '@de-care/app-common';
import { TrialAccountNavigationService } from './trial-account-navigation.service';
import { url } from 'inspector';

describe('Trial token service', () => {
    it('Must instantiate with no errors', () => {
        const mockDataTrialService = Mock.of<DataTrialService>({ token: () => of({}) });
        const mockTrialAccountNavigationService = Mock.of<TrialAccountNavigationService>({ gotoTrialExpiredPage: () => false });
        expect(() => {
            new TrialTokenResolver(new UrlHelperService(), mockDataTrialService, mockTrialAccountNavigationService);
        }).not.toThrow();
    });

    it('Resolve should not redirect if there is no error', done => {
        const mockDataTrialService = Mock.of<DataTrialService>({ token: () => of() });
        const mockTrialAccountNavigationService = Mock.of<TrialAccountNavigationService>({ gotoTrialExpiredPage: () => false });
        const route = new ActivatedRouteSnapshot();
        const trialTokenResolver = new TrialTokenResolver(new UrlHelperService(), mockDataTrialService, mockTrialAccountNavigationService);
        route.params = { prospecttkn: 'a token' };
        const date = new Date();
        const threeMonthsAheadDate = new Date(new Date().setMonth(date.getMonth() + 3));
        const parseTokenReturn = {
            firstname: 'Jhon',
            lastname: 'Smith',
            email: 'saddsds22s@siriusxm.com',
            trialenddate: threeMonthsAheadDate.toISOString(),
            trialstartdate: date.toISOString(),
            promocode: 'SXM-SAVE60A'
        };
        spyOn(mockDataTrialService, 'token').and.returnValue(of(parseTokenReturn));
        spyOn(mockTrialAccountNavigationService, 'gotoTrialExpiredPage').and.returnValue(false);
        trialTokenResolver.resolve(route, null).subscribe(
            d => {
                expect(mockTrialAccountNavigationService.gotoTrialExpiredPage).not.toHaveBeenCalled();
                done();
            },
            e => {
                expect(mockTrialAccountNavigationService.gotoTrialExpiredPage).toHaveBeenCalled();
                done();
            }
        );
    });

    it('Resolve must redirect if there is an error', done => {
        const mockRoute = Mock.of<ActivatedRouteSnapshot>({ queryParamMap: convertToParamMap({ prospecttkn: 'a token' }) });
        const mockDataTrialService = Mock.of<DataTrialService>({ token: () => throwError('error') });
        const mockTrialAccountNavigationService = Mock.of<TrialAccountNavigationService>({ gotoTrialExpiredPage: () => false });
        const resolver = new TrialTokenResolver(new UrlHelperService(), mockDataTrialService, mockTrialAccountNavigationService);
        resolver.resolve(mockRoute, null).subscribe({
            complete: () => {
                expect(mockTrialAccountNavigationService.gotoTrialExpiredPage).toHaveBeenCalled();
                done();
            }
        });
    });

    it('Must call token in DataTrialService', () => {
        const mockDataTrialService = Mock.of<DataTrialService>({ token: () => of({}) });
        const mockTrialAccountNavigationService = Mock.of<TrialAccountNavigationService>({ gotoTrialExpiredPage: () => of({}) });
        const tokenResolver = new TrialTokenResolver(new UrlHelperService(), mockDataTrialService, mockTrialAccountNavigationService);
        const mockActivatedRouteSnapshot = Mock.of<ActivatedRouteSnapshot>({ queryParamMap: convertToParamMap({ prospecttkn: 'testToken' }) });
        expect(tokenResolver.resolve(mockActivatedRouteSnapshot, null)).toBeObservable(cold('(a|)', { a: {} }));
        expect(mockDataTrialService.token).toHaveBeenCalled();
    });
});
