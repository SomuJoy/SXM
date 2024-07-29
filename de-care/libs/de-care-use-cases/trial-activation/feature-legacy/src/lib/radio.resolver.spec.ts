import { RadioResolver } from './radio.resolver';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { UrlHelperService } from '@de-care/app-common';
import { EMPTY, of, throwError } from 'rxjs';
import { cold } from 'jasmine-marbles';
import { Mock } from 'ts-mockery';
import { TrialAccountNavigationService } from './trial-account-navigation.service';
import { NonPiiLookupWorkflow } from '@de-care/data-workflows';

describe('RadioResolver', () => {
    describe('radio id and account number', () => {
        it('should call nonPii service', done => {
            const mockedTrialAccountNavigationService = Mock.of<TrialAccountNavigationService>({ goToBauNouv: () => {} });
            const mockNonPiiService = Mock.of<NonPiiLookupWorkflow>({ build: () => of({}) });
            const resolver = new RadioResolver(new UrlHelperService(), mockedTrialAccountNavigationService, mockNonPiiService);
            const mockActivatedRouteSnapshot = Mock.of<ActivatedRouteSnapshot>({ queryParamMap: convertToParamMap({ radioId: 'test', act: '**1234' }) });
            resolver.resolve(mockActivatedRouteSnapshot).subscribe({
                complete: () => {
                    expect(mockNonPiiService.build).toHaveBeenCalled();
                    done();
                }
            });
        });

        it('should return account data if the account comes back from nonPii service', () => {
            const mockAccount = {};
            const mockedTrialAccountNavigationService = Mock.of<TrialAccountNavigationService>({ goToBauNouv: () => {} });
            const mockNonPiiService = Mock.of<NonPiiLookupWorkflow>({ build: () => of(mockAccount) });
            const resolver = new RadioResolver(new UrlHelperService(), mockedTrialAccountNavigationService, mockNonPiiService);
            const mockActivatedRouteSnapshot = Mock.of<ActivatedRouteSnapshot>({ queryParamMap: convertToParamMap({ radioId: 'test', act: '**1234' }) });
            expect(resolver.resolve(mockActivatedRouteSnapshot)).toBeObservable(cold('(a|)', { a: mockAccount }));
        });
        it('should return redirect to error page if 400 error comes back from nonPii service', done => {
            const nonPiiError = { error: { status: '400' } };
            const mockedTrialAccountNavigationService = Mock.of<TrialAccountNavigationService>({ goToBauNouv: () => {} });
            const mockNonPiiService = Mock.of<NonPiiLookupWorkflow>({ build: () => throwError(nonPiiError) });
            const resolver = new RadioResolver(new UrlHelperService(), mockedTrialAccountNavigationService, mockNonPiiService);
            const mockActivatedRouteSnapshot = Mock.of<ActivatedRouteSnapshot>({ queryParamMap: convertToParamMap({ radioId: 'test', act: '**1234' }) });
            resolver.resolve(mockActivatedRouteSnapshot).subscribe({
                error: () => {
                    expect(mockedTrialAccountNavigationService.goToBauNouv).toHaveBeenCalled();
                    done();
                }
            });
        });
    });
    describe('without radio id', () => {
        it('should not call nonPii service and should redirect to error page', () => {
            const mockedTrialAccountNavigationService = Mock.of<TrialAccountNavigationService>({ goToBauNouv: () => {} });
            const mockNonPiiService = Mock.of<NonPiiLookupWorkflow>({ build: () => of({}) });

            const resolver = new RadioResolver(new UrlHelperService(), mockedTrialAccountNavigationService, mockNonPiiService);
            const mockActivatedRouteSnapshot = Mock.of<ActivatedRouteSnapshot>({ queryParamMap: convertToParamMap({ act: '**1234' }) });
            expect(resolver.resolve(mockActivatedRouteSnapshot)).toBeObservable(cold('|'));
            expect(mockedTrialAccountNavigationService.goToBauNouv).toHaveBeenCalled();
            expect(mockNonPiiService.build).not.toHaveBeenCalled();
        });
    });
    describe('without account number', () => {
        it('should not call nonPii service and should redirect to error page', () => {
            const mockedTrialAccountNavigationService = Mock.of<TrialAccountNavigationService>({ goToBauNouv: () => {} });
            const mockNonPiiService = Mock.of<NonPiiLookupWorkflow>({ build: () => EMPTY });

            const resolver = new RadioResolver(new UrlHelperService(), mockedTrialAccountNavigationService, mockNonPiiService);
            const mockActivatedRouteSnapshot = Mock.of<ActivatedRouteSnapshot>({ queryParamMap: convertToParamMap({ radioId: 'test' }) });
            expect(resolver.resolve(mockActivatedRouteSnapshot)).toBeObservable(cold('|'));
            expect(mockedTrialAccountNavigationService.goToBauNouv).toHaveBeenCalled();
            expect(mockNonPiiService.build).not.toHaveBeenCalled();
        });
    });
});
