import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { Mock } from 'ts-mockery';
import {
    accountAlreadyRegistered,
    fetchVerificationOptions,
    fetchVerificationOptionsSettled,
    getVerificationOptionsForUnregisteredAccount,
    setVerificationMethods
} from './actions';
import { previouslyRegisteredStatusDetermined } from './verification-effects.actions';
import { VerificationEffects } from './verification.effects';
import { RegisterAccountNonPiiWorkflowService, RegisterVerifyOptionsService } from '@de-care/domains/account/state-account';

describe('Flepz submission effects', () => {
    let actions$ = new Observable<Action>();
    let effects: VerificationEffects;

    const mockGetNonPii = jest.fn();
    const mockGetVerifyOptions = jest.fn();

    const mockRouterNavigate = jest.fn();
    const initialState = {};

    beforeEach(() => {
        jest.resetAllMocks();

        TestBed.configureTestingModule({
            providers: [
                VerificationEffects,
                provideMockStore({ initialState }),
                provideMockActions(() => actions$),
                {
                    provide: Router,
                    useValue: Mock.of<Router>({ navigate: mockRouterNavigate })
                },
                {
                    provide: RegisterVerifyOptionsService,
                    useValue: Mock.of<RegisterVerifyOptionsService>({ getVerifyOptions: mockGetVerifyOptions })
                },
                {
                    provide: RegisterAccountNonPiiWorkflowService,
                    useValue: Mock.of<RegisterAccountNonPiiWorkflowService>({ build: mockGetNonPii })
                }
            ]
        });

        effects = TestBed.inject(VerificationEffects);
    });

    describe('handleUnregisteredAccount$', () => {
        it('Not previously registered', () => {
            const last4DigitsOfAccountNumber = '1234';

            actions$ = cold('-a-b-|', {
                a: fetchVerificationOptions({
                    last4DigitsOfAccountNumber
                }),
                b: previouslyRegisteredStatusDetermined({ previouslyRegistered: false })
            });

            expect(effects.handleUnregisteredAccount$).toBeObservable(hot('----a|', { a: getVerificationOptionsForUnregisteredAccount({ last4DigitsOfAccountNumber }) }));
        });

        it('handleUnregisteredAccount$ for previously registered', () => {
            const last4DigitsOfAccountNumber = '1234';

            actions$ = cold('-a-b-|', {
                a: fetchVerificationOptions({
                    last4DigitsOfAccountNumber
                }),
                b: previouslyRegisteredStatusDetermined({ previouslyRegistered: true })
            });

            expect(effects.handleUnregisteredAccount$).toBeObservable(hot('-----|'));
        });
    });

    describe('handleAlreadyRegistered$', () => {
        it('Previously registered', () => {
            const last4DigitsOfAccountNumber = '1234';

            actions$ = cold('-a-b-|', {
                a: fetchVerificationOptions({
                    last4DigitsOfAccountNumber
                }),
                b: previouslyRegisteredStatusDetermined({ previouslyRegistered: true })
            });

            expect(effects.handleAlreadyRegistered$).toBeObservable(hot('----a|', { a: accountAlreadyRegistered() }));
        });

        it('Not previously registered', () => {
            const last4DigitsOfAccountNumber = '1234';

            actions$ = cold('-a-b-|', {
                a: fetchVerificationOptions({
                    last4DigitsOfAccountNumber
                }),
                b: previouslyRegisteredStatusDetermined({ previouslyRegistered: false })
            });

            expect(effects.handleAlreadyRegistered$).toBeObservable(hot('-----|'));
        });
    });

    describe('determineIfAlreadyRegistered$', () => {
        // it('Previously registered and masked phone number should be retrieved from API', () => {
        //     const last4DigitsOfAccountNumber = '1234';

        //     mockGetNonPii.mockReturnValueOnce(of({ maskedPhoneNumber: last4DigitsOfAccountNumber, accountProfile: { accountRegistered: true } }));

        //     actions$ = cold('-a---|', {
        //         a: fetchVerificationOptions({
        //             last4DigitsOfAccountNumber
        //         })
        //     });

        //     expect(effects.determineIfAlreadyRegistered$).toBeObservable(
        //         hot('-(ab)|', {
        //             a: setMaskedPhoneNumber({ maskedPhoneNumber: last4DigitsOfAccountNumber }),
        //             b: previouslyRegisteredStatusDetermined({ previouslyRegistered: true })
        //         })
        //     );
        // });

        it('Failed nonPii call should short-circuit', () => {
            const last4DigitsOfAccountNumber = '1234';

            mockGetNonPii.mockReturnValueOnce(throwError('uh oh.'));

            actions$ = cold('-a-|', {
                a: fetchVerificationOptions({
                    last4DigitsOfAccountNumber
                })
            });

            expect(effects.determineIfAlreadyRegistered$).toBeObservable(hot('-a-|', { a: fetchVerificationOptionsSettled({ hasError: true }) }));
        });

        // it('Failed nonPii call should allow retry', () => {
        //     const last4DigitsOfAccountNumber = '1234';

        //     mockGetNonPii.mockReturnValueOnce(throwError('uh oh.'));
        //     mockGetNonPii.mockReturnValueOnce(of({ maskedPhoneNumber: last4DigitsOfAccountNumber, accountProfile: { accountRegistered: true } }));

        //     actions$ = cold('-a-b---|', {
        //         a: fetchVerificationOptions({
        //             last4DigitsOfAccountNumber
        //         }),
        //         b: fetchVerificationOptions({
        //             last4DigitsOfAccountNumber
        //         })
        //     });

        //     expect(effects.determineIfAlreadyRegistered$).toBeObservable(
        //         hot('-a-(bc)|', {
        //             a: fetchVerificationOptionsSettled({ hasError: true }),
        //             b: setMaskedPhoneNumber({ maskedPhoneNumber: last4DigitsOfAccountNumber }),
        //             c: previouslyRegisteredStatusDetermined({ previouslyRegistered: true })
        //         })
        //     );
        // });
    });

    describe('fetchVerificationOptionsForUnregisteredAccount$', () => {
        it('Previously registered and masked phone number should be retrieved from API', () => {
            const last4DigitsOfAccountNumber = '1234';

            mockGetVerifyOptions.mockReturnValueOnce(of({ canUsePhone: true, canUseRadioId: false, canUseAccountNumber: true }));

            actions$ = cold('-a---|', {
                a: getVerificationOptionsForUnregisteredAccount({
                    last4DigitsOfAccountNumber
                })
            });

            expect(effects.fetchVerificationOptionsForUnregisteredAccount$).toBeObservable(
                hot('-(ab)|', {
                    a: setVerificationMethods({
                        verificationMethods: {
                            phone: { eligible: true, verified: false },
                            radioId: { eligible: false, verified: false },
                            accountNumber: { eligible: true, verified: false }
                        }
                    }),
                    b: fetchVerificationOptionsSettled({ hasError: false })
                })
            );
        });

        it('Failed getVerifyOptions call should short-circuit', () => {
            const last4DigitsOfAccountNumber = '1234';

            mockGetVerifyOptions.mockReturnValueOnce(throwError('uh oh.'));

            actions$ = cold('-a-|', {
                a: getVerificationOptionsForUnregisteredAccount({
                    last4DigitsOfAccountNumber
                })
            });

            expect(effects.fetchVerificationOptionsForUnregisteredAccount$).toBeObservable(hot('-a-|', { a: fetchVerificationOptionsSettled({ hasError: true }) }));
        });

        // it('Failed getVerifyOptions call should allow retry', () => {
        //     const last4DigitsOfAccountNumber = '1234';

        //     mockGetVerifyOptions.mockReturnValueOnce(throwError('uh oh.'));
        //     mockGetVerifyOptions.mockReturnValueOnce(of({ canUsePhone: true, canUseRadioId: false, canUseAccountNumber: true }));

        //     actions$ = cold('-a-b---|', {
        //         a: getVerificationOptionsForUnregisteredAccount({
        //             last4DigitsOfAccountNumber
        //         }),
        //         b: getVerificationOptionsForUnregisteredAccount({
        //             last4DigitsOfAccountNumber
        //         })
        //     });

        //     expect(effects.fetchVerificationOptionsForUnregisteredAccount$).toBeObservable(
        //         hot('-a-(bc)|', {
        //             a: fetchVerificationOptionsSettled({ hasError: true }),
        //             b: setVerificationMethods({
        //                 verificationMethods: {
        //                     phone: { eligible: true, verified: false },
        //                     radioId: { eligible: false, verified: false },
        //                     accountNumber: { eligible: true, verified: false }
        //                 }
        //             }),
        //             c: fetchVerificationOptionsSettled({ hasError: false })
        //         })
        //     );
        // });
    });

    describe('redirectAlreadyRegistered$', () => {
        it('redirect on success', () => {
            actions$ = cold('-a|', {
                a: accountAlreadyRegistered()
            });

            expect(effects.redirectAlreadyRegistered$).toBeObservable(hot('-a|', { a: accountAlreadyRegistered() }));
            expect(mockRouterNavigate).toHaveBeenCalledTimes(1);
            expect(mockRouterNavigate).toHaveBeenNthCalledWith(1, ['/account/registration/registered']);
        });
    });
});
