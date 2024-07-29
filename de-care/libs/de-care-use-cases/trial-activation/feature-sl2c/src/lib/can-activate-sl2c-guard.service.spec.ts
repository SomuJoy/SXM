import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PrefillWorkFlowService, PrefillServiceResponseStatus } from '@de-care/de-care-use-cases/trial-activation/state-sl2c';
import { FetchPartnerInfoWorkflowService, getPartnerInfoMap } from '@de-care/domains/partner/state-partner-info';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { cold } from '@nrwl/angular/testing';
import { Mock } from 'ts-mockery';
import { CanActivateSl2cGuardService } from './can-activate-sl2c-guard.service';

const ERROR_PATH = 'error';
const CONFIRMATION_PATH = 'activate/trial/confirmation';

describe('CanActivateSl2cGuardService', () => {
    let svc: CanActivateSl2cGuardService;
    let routeSnapshot: ActivatedRouteSnapshot;
    let mockStore: MockStore;

    const mockPrefillWorkFlowService = jest.fn();
    const mockFetchPartnerInfoWorkflowService = jest.fn();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                provideMockStore({
                    initialState: {},
                    selectors: [
                        { selector: getNormalizedQueryParams, value: { tkn: 'tkn', corpid: '1234' } },
                        { selector: getPartnerInfoMap, value: { 1234: {} } }
                    ]
                }),
                { provide: Router, useValue: Mock.of<Router>({ createUrlTree: jest.fn().mockImplementation(path => path.join('/')) }) },
                { provide: ActivatedRouteSnapshot, useValue: Mock.of<ActivatedRouteSnapshot>({ data: { brandingType: 'abc' } }) },
                { provide: PrefillWorkFlowService, useValue: Mock.of<PrefillWorkFlowService>({ build: mockPrefillWorkFlowService }) },
                { provide: FetchPartnerInfoWorkflowService, useValue: Mock.of<FetchPartnerInfoWorkflowService>({ build: mockFetchPartnerInfoWorkflowService }) }
            ]
        });

        svc = TestBed.inject(CanActivateSl2cGuardService);
        routeSnapshot = TestBed.inject(ActivatedRouteSnapshot);
        mockStore = TestBed.inject(MockStore);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('partner info is successful', () => {
        it('should allow pass-through for successful calls', () => {
            mockFetchPartnerInfoWorkflowService.mockReturnValue(cold('a|', { a: true }));
            mockPrefillWorkFlowService.mockReturnValue(cold('a|', { a: PrefillServiceResponseStatus.newCustomerValidated }));

            expect(svc.canActivate(routeSnapshot)).toBeObservable(cold('a|', { a: true }));
        });

        it('should allow pass-through if tkn not present in querystring', () => {
            mockStore.overrideSelector(getNormalizedQueryParams, { corpid: '1234' });
            mockFetchPartnerInfoWorkflowService.mockReturnValue(cold('a|', { a: true }));
            mockPrefillWorkFlowService.mockReturnValue(cold('a|', { a: PrefillServiceResponseStatus.newCustomerValidated }));

            expect(svc.canActivate(routeSnapshot)).toBeObservable(cold('a|', { a: true }));
        });

        it('should redirect to confirmation if existing account', () => {
            mockStore.overrideSelector(getNormalizedQueryParams, { corpid: '1234' });
            mockFetchPartnerInfoWorkflowService.mockReturnValue(cold('a|', { a: true }));
            mockPrefillWorkFlowService.mockReturnValue(cold('a|', { a: PrefillServiceResponseStatus.existingCustomerValidated }));

            expect(svc.canActivate(routeSnapshot)).toBeObservable(cold('a|', { a: CONFIRMATION_PATH }));
        });

        it('should allow pass-through if Prefill workflow returns a fail code', () => {
            mockStore.overrideSelector(getNormalizedQueryParams, { corpid: '1234' });
            mockFetchPartnerInfoWorkflowService.mockReturnValue(cold('a|', { a: true }));
            mockPrefillWorkFlowService.mockReturnValue(cold('a|', { a: PrefillServiceResponseStatus.fail }));

            // Doesn't complete at frame 0 because it's using a map instead of concatMap with `of`
            expect(svc.canActivate(routeSnapshot)).toBeObservable(cold('a|', { a: ERROR_PATH }));
        });

        it('should return error path if Prefill fails (should never happen)', () => {
            mockFetchPartnerInfoWorkflowService.mockReturnValue(cold('a|', { a: true }));
            mockPrefillWorkFlowService.mockReturnValue(cold('#'));

            expect(svc.canActivate(routeSnapshot)).toBeObservable(cold('(a|)', { a: ERROR_PATH }));
        });
    });

    describe('corpId negative checks', () => {
        it('should return error route if corpid is not present in the URL', () => {
            mockFetchPartnerInfoWorkflowService.mockReturnValue(cold('a|', { a: true }));
            mockStore.overrideSelector(getNormalizedQueryParams, {});

            expect(svc.canActivate(routeSnapshot)).toBeObservable(cold('(a|)', { a: ERROR_PATH }));
        });

        it('should return error route if corpid is not number-like in the URL', () => {
            mockFetchPartnerInfoWorkflowService.mockReturnValue(cold('a|', { a: true }));
            mockStore.overrideSelector(getNormalizedQueryParams, { corpid: 'a123' });

            expect(svc.canActivate(routeSnapshot)).toBeObservable(cold('(a|)', { a: ERROR_PATH }));
        });

        it('should accept corpid present but not in partnerInfo', () => {
            mockFetchPartnerInfoWorkflowService.mockReturnValue(cold('a|', { a: true }));
            mockStore.overrideSelector(getNormalizedQueryParams, { corpid: '1' });
            mockPrefillWorkFlowService.mockReturnValue(cold('a|', { a: PrefillServiceResponseStatus.newCustomerValidated }));

            expect(svc.canActivate(routeSnapshot)).toBeObservable(cold('a|', { a: true }));
        });
    });

    it('should return error path if PartnerInfo fails', () => {
        mockFetchPartnerInfoWorkflowService.mockReturnValue(cold('#'));

        expect(svc.canActivate(routeSnapshot)).toBeObservable(cold('(a|)', { a: ERROR_PATH }));
    });
});
