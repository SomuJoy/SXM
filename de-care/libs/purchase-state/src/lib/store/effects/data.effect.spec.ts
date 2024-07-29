import { SetPlatformChangedFlag, SetPlatformChangeUpsellDeferred, LoadFlepzData, VerifyFlepzAccount } from './../actions/purchase.actions';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { ServiceError as ErrorRedirect } from '@de-care/checkout-state';
import { DataLayerService } from '@de-care/data-layer';
import { DataAccountService, DataOfferService } from '@de-care/data-services';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { DataEffects } from './data.effect';
import { hot } from '@nrwl/angular/testing';
import { FeatureFlagCheck } from '@de-care/shared/state-feature-flags';
import { LoadQuoteWorkflowService } from '@de-care/domains/quotes/state-quote';

const mockNoop: any = null;
const mockStore: any = { select: () => {} };

describe('DataEffects', () => {
    describe('on LoadFlepzData', () => {
        let effects: DataEffects;
        let actions: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    DataEffects,
                    provideMockActions(() => actions),
                    provideMockStore(),
                    { provide: LoadQuoteWorkflowService, useValue: mockNoop },
                    { provide: DataAccountService, useValue: mockNoop },
                    { provide: DataOfferService, useValue: mockNoop },
                    { provide: DataLayerService, useValue: mockNoop },
                    {
                        provide: SettingsService,
                        useValue: {
                            isCanadaMode: true,
                        },
                    },
                    {
                        provide: UserSettingsService,
                        useValue: {
                            selectedCanadianProvince$: of({}),
                        },
                    },
                    {
                        provide: FeatureFlagCheck,
                        useValue: {
                            isEnabled: () => false,
                        },
                    },
                ],
            });

            effects = TestBed.inject(DataEffects);
        });

        it('should next out a VerifyFlepzAccount action when payload has account data', fakeAsync(() => {
            const mockPayload = {
                account: {
                    serviceAddress: {
                        state: 'ON',
                    },
                } as any,
                accountNumber: '12345',
                radio: {} as any,
                stepNumber: 1,
                platformChanged: false,
            };
            const mockAction = LoadFlepzData({ payload: mockPayload });

            const expected = hot('(abc)|', {
                a: VerifyFlepzAccount({
                    payload: {
                        account: mockPayload.account,
                        loadUpsells: true,
                        stepNumber: mockPayload.stepNumber,
                        retrieveFallbackOffer: false,
                        state: 'ON',
                    },
                }),
                b: SetPlatformChangedFlag({ payload: mockPayload.platformChanged }),
                c: SetPlatformChangeUpsellDeferred({ upsellDeferred: false }),
            });

            actions = hot('a----|', { a: mockAction });
            expect(effects.loadFlepzAccount$).toBeObservable(expected);
        }));

        it('should next out an ErrorRedirect action when payload has account set to null', () => {
            const mockAction = LoadFlepzData({
                payload: {
                    account: null,
                    accountNumber: '12345',
                    radio: {} as any,
                    stepNumber: 1,
                    platformChanged: false,
                },
            });

            // catchError returns using `of` and this emits
            // a completion in the same frame as the value.
            // This is why we group them with `(a|)`
            const expected = hot('(a|)', {
                a: ErrorRedirect({ payload: new Error('No account provided for LoadFlepzData') }),
            });

            actions = hot('a-|', { a: mockAction });
            expect(effects.loadFlepzAccount$).toBeObservable(expected);
        });

        it('should next out an ErrorRedirect action when payload has account set to undefined', () => {
            const mockAction = LoadFlepzData({
                payload: {
                    account: undefined,
                    accountNumber: '12345',
                    radio: {} as any,
                    stepNumber: 1,
                    platformChanged: false,
                },
            });

            const expected = hot('(a|)', {
                a: ErrorRedirect({ payload: new Error('No account provided for LoadFlepzData') }),
            });

            actions = hot('a-|', { a: mockAction });
            expect(effects.loadFlepzAccount$).toBeObservable(expected);
        });
    });
});
