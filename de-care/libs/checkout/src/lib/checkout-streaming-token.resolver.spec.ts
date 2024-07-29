import { ActivatedRouteSnapshot, convertToParamMap, Router, RouterStateSnapshot } from '@angular/router';
import { UrlHelperService } from '@de-care/app-common';
import { AccountModel, CheckoutTokenResolverErrors, DataAccountService, PlanTypeEnum } from '@de-care/data-services';
import { UserSettingsService } from '@de-care/settings';
import { TranslateService } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Mock } from 'ts-mockery';
import { CheckoutStreamingTokenResolver, CheckoutTokenResolverResponse } from './checkout-streaming-token.resolver';
import { LoadCheckoutFlepzResolver } from './load-checkout-flepz.resolver';
import { LoadCheckoutResolver } from './load-checkout.resolver';

const buildMockedAccount = () =>
    ({
        firstName: 'test',
        accountProfile: {
            accountRegistered: false,
            newRegister: false
        },
        serviceAddress: {
            state: 'NY'
        },
        subscriptions: [
            {
                id: '10000185726',
                plans: [
                    {
                        code: 'Trial - Premier Streaming - 1mo - $0.00 - (RTD)',
                        packageName: 'SIR_IP_SA',
                        termLength: 1,
                        startDate: '2020-01-27T00:00:00-05:00',
                        endDate: '2020-02-27T00:00:00-05:00',
                        nextCycleOn: null,
                        type: PlanTypeEnum.Trial
                    }
                ],
                followonPlans: [],
                radioService: null,
                status: 'Active',
                streamingService: {
                    id: '10000184702',
                    maskedUserName: '**@**.com',
                    status: 'Active'
                }
            }
        ],
        billingSummary: {
            creditCard: {
                last4Digits: '1111',
                type: 'VISA',
                status: 'ACTIVE'
            }
        },
        closedDevices: [],
        hasEmailAddressOnFile: true
    } as AccountModel);

const mockedStore = {
    dispatch: jest.fn()
};

describe('Checkout Token Resolver Service', () => {
    describe('Positive scenarios', () => {
        it('must not return an error', () => {
            const validAccount = buildMockedAccount();
            const mockDataTrialService = Mock.of<DataAccountService>({
                getFromToken: () =>
                    of({
                        nonPIIAccount: validAccount,
                        isUserNameInTokenSameAsAccount: false,
                        maskedUserNameFromToken: '',
                        marketingId: '',
                        marketingAcctId: ''
                    })
            });
            const mockTranslateService = Mock.of<TranslateService>({ use: () => of(null) });
            const mockUserSettingsService = Mock.of<UserSettingsService>({
                setSelectedCanadianProvince: () => {},
                isQuebec: () => null
            });
            const mockLoadCheckoutResolve = Mock.of<LoadCheckoutResolver>({ resolve: () => of(null) });
            const mockLoadCheckoutFlepzResolve = Mock.of<LoadCheckoutFlepzResolver>({ resolve: () => of(null) });
            const mockRouter = Mock.of<Router>();
            const checkoutTokenResolver = new CheckoutStreamingTokenResolver(
                mockDataTrialService,
                new UrlHelperService(),
                mockLoadCheckoutResolve,
                mockLoadCheckoutFlepzResolve,
                mockUserSettingsService,
                mockTranslateService,
                mockRouter,
                mockedStore as any
            );
            const mockRouterStateSnapshot = Mock.of<RouterStateSnapshot>();
            const mockRoute = Mock.of<ActivatedRouteSnapshot>({ queryParamMap: convertToParamMap({ tkn: 'anytkn' }) });
            const expected: CheckoutTokenResolverResponse = {
                checkoutState: null,
                tokenInfo: {
                    error: false,
                    account: validAccount,
                    errorType: undefined,
                    maskedUserNameFromToken: null
                },
                streamingFlepz: false
            };
            expect(checkoutTokenResolver.resolve(mockRoute, mockRouterStateSnapshot)).toBeObservable(cold('(a|)', { a: expected }));
        });
    });

    describe('Negative scenarios', () => {
        it('must send an error of type EmptyToken', () => {
            const mockTranslateService = Mock.of<TranslateService>({ use: () => of(null) });
            const mockUserSettingsService = Mock.of<UserSettingsService>({
                setSelectedCanadianProvince: () => {},
                isQuebec: () => null
            });
            const mockDataTrialService = Mock.of<DataAccountService>({ getFromToken: () => of({}) });
            const mockLoadCheckoutResolve = Mock.of<LoadCheckoutResolver>({ resolve: () => of(null) });
            const mockLoadCheckoutFlepzResolve = Mock.of<LoadCheckoutFlepzResolver>({ resolve: () => of(null) });
            const mockRouter = Mock.of<Router>();
            const checkoutTokenResolver = new CheckoutStreamingTokenResolver(
                mockDataTrialService,
                new UrlHelperService(),
                mockLoadCheckoutResolve,
                mockLoadCheckoutFlepzResolve,
                mockUserSettingsService,
                mockTranslateService,
                mockRouter,
                mockedStore as any
            );
            const mockRoute = Mock.of<ActivatedRouteSnapshot>({ queryParamMap: convertToParamMap({}) });
            const mockRouterStateSnapshot = Mock.of<RouterStateSnapshot>();
            const expected: CheckoutTokenResolverResponse = {
                checkoutState: null,
                tokenInfo: {
                    error: true,
                    errorType: CheckoutTokenResolverErrors.EmptyToken
                },
                streamingFlepz: true
            };
            expect(checkoutTokenResolver.resolve(mockRoute, mockRouterStateSnapshot)).toBeObservable(cold('(a|)', { a: expected }));
        });

        it('must return an error object on error from service', () => {
            const mockTranslateService = Mock.of<TranslateService>({ use: () => of(null) });
            const mockUserSettingsService = Mock.of<UserSettingsService>({
                setSelectedCanadianProvince: () => {},
                isQuebec: () => null
            });
            const mockDataTrialService = Mock.of<DataAccountService>({ getFromToken: () => throwError({ status: 401 }) });
            const mockLoadCheckoutResolve = Mock.of<LoadCheckoutResolver>({ resolve: () => of(null) });
            const mockLoadCheckoutFlepzResolve = Mock.of<LoadCheckoutFlepzResolver>({ resolve: () => of(null) });
            const mockRouter = Mock.of<Router>();
            const checkoutTokenResolver = new CheckoutStreamingTokenResolver(
                mockDataTrialService,
                new UrlHelperService(),
                mockLoadCheckoutResolve,
                mockLoadCheckoutFlepzResolve,
                mockUserSettingsService,
                mockTranslateService,
                mockRouter,
                mockedStore as any
            );
            const mockRoute = Mock.of<ActivatedRouteSnapshot>({ queryParamMap: convertToParamMap({ tkn: 'a token' }) });
            const mockRouterStateSnapshot = Mock.of<RouterStateSnapshot>();
            const expected: CheckoutTokenResolverResponse = {
                checkoutState: null,
                tokenInfo: {
                    error: true,
                    errorType: CheckoutTokenResolverErrors.InvalidToken
                },
                streamingFlepz: true
            };
            expect(checkoutTokenResolver.resolve(mockRoute, mockRouterStateSnapshot)).toBeObservable(cold('(a|)', { a: expected }));
        });

        it('must send an error of type HasFollowOn', () => {
            const mockedAccount = buildMockedAccount();
            mockedAccount.subscriptions[0].followonPlans = [
                {
                    code: 'test',
                    packageName: 'test',
                    termLength: 1,
                    startDate: '2020-01-27T00:00:00-05:00',
                    endDate: '2020-02-27T00:00:00-05:00',
                    nextCycleOn: null,
                    type: PlanTypeEnum.Introductory
                }
            ];
            const mockDataTrialService = Mock.of<DataAccountService>({
                getFromToken: () =>
                    of({
                        nonPIIAccount: mockedAccount,
                        isUserNameInTokenSameAsAccount: false,
                        maskedUserNameFromToken: '',
                        marketingId: '',
                        marketingAcctId: ''
                    })
            });
            const mockTranslateService = Mock.of<TranslateService>({ use: () => of(null) });
            const mockUserSettingsService = Mock.of<UserSettingsService>({
                setSelectedCanadianProvince: () => {},
                isQuebec: () => null
            });
            const mockLoadCheckoutResolve = Mock.of<LoadCheckoutResolver>({ resolve: () => of(null) });
            const mockLoadCheckoutFlepzResolve = Mock.of<LoadCheckoutFlepzResolver>({ resolve: () => of(null) });
            const mockRouter = Mock.of<Router>();
            const checkoutTokenResolver = new CheckoutStreamingTokenResolver(
                mockDataTrialService,
                new UrlHelperService(),
                mockLoadCheckoutResolve,
                mockLoadCheckoutFlepzResolve,
                mockUserSettingsService,
                mockTranslateService,
                mockRouter,
                mockedStore as any
            );
            const mockRoute = Mock.of<ActivatedRouteSnapshot>({ queryParamMap: convertToParamMap({ tkn: 'anytkn' }) });
            const mockRouterStateSnapshot = Mock.of<RouterStateSnapshot>();
            const expected: CheckoutTokenResolverResponse = {
                checkoutState: null,
                tokenInfo: {
                    error: true,
                    errorType: CheckoutTokenResolverErrors.HasFollowOn,
                    account: mockedAccount,
                    maskedUserNameFromToken: null
                },
                streamingFlepz: false
            };
            expect(checkoutTokenResolver.resolve(mockRoute, mockRouterStateSnapshot)).toBeObservable(cold('(a|)', { a: expected }));
        });

        it('must send an error of type ExpiredSubscription', () => {
            const mockedAccount = buildMockedAccount();
            mockedAccount.subscriptions = [];
            const mockDataTrialService = Mock.of<DataAccountService>({
                getFromToken: () =>
                    of({
                        nonPIIAccount: mockedAccount,
                        isUserNameInTokenSameAsAccount: false,
                        maskedUserNameFromToken: '',
                        marketingId: '',
                        marketingAcctId: ''
                    }),
                generateEmptyAccount: () => mockedAccount
            });
            const mockTranslateService = Mock.of<TranslateService>({ use: () => of(null) });
            const mockUserSettingsService = Mock.of<UserSettingsService>({
                setSelectedCanadianProvince: () => {},
                isQuebec: () => null
            });
            const mockLoadCheckoutResolve = Mock.of<LoadCheckoutResolver>({ resolve: () => of(null) });
            const mockLoadCheckoutFlepzResolve = Mock.of<LoadCheckoutFlepzResolver>({ resolve: () => of(null) });
            const mockRouter = Mock.of<Router>();
            const checkoutTokenResolver = new CheckoutStreamingTokenResolver(
                mockDataTrialService,
                new UrlHelperService(),
                mockLoadCheckoutResolve,
                mockLoadCheckoutFlepzResolve,
                mockUserSettingsService,
                mockTranslateService,
                mockRouter,
                mockedStore as any
            );
            const mockRoute = Mock.of<ActivatedRouteSnapshot>({ queryParamMap: convertToParamMap({ tkn: 'anytkn' }) });
            const mockRouterStateSnapshot = Mock.of<RouterStateSnapshot>();
            const expected: CheckoutTokenResolverResponse = {
                checkoutState: null,
                tokenInfo: {
                    error: true,
                    errorType: CheckoutTokenResolverErrors.NewAccountFlow,
                    account: mockedAccount,
                    maskedUserNameFromToken: null
                },
                streamingFlepz: false
            };
            expect(checkoutTokenResolver.resolve(mockRoute, mockRouterStateSnapshot)).toBeObservable(cold('(a|)', { a: expected }));
        });
    });

    describe('CheckoutResolver is called', () => {
        it('must be called if there is a token and a valid account', done => {
            const validAccount = buildMockedAccount();
            const mockDataTrialService = Mock.of<DataAccountService>({
                getFromToken: () =>
                    of({
                        nonPIIAccount: validAccount,
                        isUserNameInTokenSameAsAccount: false,
                        maskedUserNameFromToken: '',
                        marketingId: '',
                        marketingAcctId: ''
                    })
            });
            const mockTranslateService = Mock.of<TranslateService>({ use: () => of(null) });
            const mockUserSettingsService = Mock.of<UserSettingsService>({
                setSelectedCanadianProvince: () => {},
                isQuebec: () => null
            });
            const mockLoadCheckoutResolve = Mock.of<LoadCheckoutResolver>({ resolve: () => of(null) });
            const mockLoadCheckoutFlepzResolve = Mock.of<LoadCheckoutFlepzResolver>({ resolve: () => of(null) });
            const mockRouter = Mock.of<Router>();
            const checkoutTokenResolver = new CheckoutStreamingTokenResolver(
                mockDataTrialService,
                new UrlHelperService(),
                mockLoadCheckoutResolve,
                mockLoadCheckoutFlepzResolve,
                mockUserSettingsService,
                mockTranslateService,
                mockRouter,
                mockedStore as any
            );
            const mockRouterStateSnapshot = Mock.of<RouterStateSnapshot>();
            const mockRoute = Mock.of<ActivatedRouteSnapshot>({ queryParamMap: convertToParamMap({ tkn: 'anytkn' }) });
            checkoutTokenResolver
                .resolve(mockRoute, mockRouterStateSnapshot)
                .pipe(
                    finalize(() => {
                        expect(mockLoadCheckoutResolve.resolve).toHaveBeenCalled();
                        done();
                    })
                )
                .subscribe();
        });
    });

    describe('CheckoutFlepzResolver is called', () => {
        it('must be called if there is a token and account has followon', done => {
            const mockedAccount = buildMockedAccount();
            mockedAccount.subscriptions[0].followonPlans = [
                {
                    code: 'test',
                    packageName: 'test',
                    termLength: 1,
                    startDate: '2020-01-27T00:00:00-05:00',
                    endDate: '2020-02-27T00:00:00-05:00',
                    nextCycleOn: null,
                    type: PlanTypeEnum.Introductory
                }
            ];
            const mockDataTrialService = Mock.of<DataAccountService>({
                getFromToken: () =>
                    of({
                        nonPIIAccount: mockedAccount,
                        isUserNameInTokenSameAsAccount: false,
                        maskedUserNameFromToken: '',
                        marketingId: '',
                        marketingAcctId: ''
                    })
            });
            const mockTranslateService = Mock.of<TranslateService>({ use: () => of(null) });
            const mockUserSettingsService = Mock.of<UserSettingsService>({
                setSelectedCanadianProvince: () => {},
                isQuebec: () => null
            });
            const mockLoadCheckoutResolve = Mock.of<LoadCheckoutResolver>({ resolve: () => of(null) });
            const mockLoadCheckoutFlepzResolve = Mock.of<LoadCheckoutFlepzResolver>({ resolve: () => of(null) });
            const mockRouter = Mock.of<Router>();
            const checkoutTokenResolver = new CheckoutStreamingTokenResolver(
                mockDataTrialService,
                new UrlHelperService(),
                mockLoadCheckoutResolve,
                mockLoadCheckoutFlepzResolve,
                mockUserSettingsService,
                mockTranslateService,
                mockRouter,
                mockedStore as any
            );
            const mockRoute = Mock.of<ActivatedRouteSnapshot>({ queryParamMap: convertToParamMap({ tkn: 'anytkn' }) });
            const mockRouterStateSnapshot = Mock.of<RouterStateSnapshot>();
            checkoutTokenResolver
                .resolve(mockRoute, mockRouterStateSnapshot)
                .pipe(
                    finalize(() => {
                        expect(mockLoadCheckoutResolve.resolve).toHaveBeenCalled();
                        done();
                    })
                )
                .subscribe();
        });
    });
});
