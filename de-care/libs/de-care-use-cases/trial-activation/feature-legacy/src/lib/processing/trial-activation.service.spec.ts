import { ObjectTokenizerService } from '@de-care/app-common';
import { DataLayerService } from '@de-care/data-layer';
import { AccountModel, DataPurchaseService, PackageModel } from '@de-care/data-services';
import { cold } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { Mock } from 'ts-mockery';
import { AccountData } from '../page-parts/new-account-form-step/new-account-form-step.component';
import { TrialAccountNavigationService } from '../trial-account-navigation.service';
import { TrialActivationService } from './trial-activation.service';
import { UserSettingsService } from '@de-care/settings';
import { NonPiiLookupWorkflow } from '@de-care/data-workflows';
import { Account } from '@de-care/domains/account/state-account';
import { NonPiiLookupTrialActivationWorkflow } from './workflows/nonpii-trial-activation-workflow.service';

describe('TrialActivationService', () => {
    describe('activateExistingAccount', () => {
        it('should next out data on success', () => {
            const service = new TrialActivationService(
                Mock.of<NonPiiLookupTrialActivationWorkflow>({
                    build: () =>
                        of({
                            subscriptions: [
                                {
                                    plans: [
                                        {
                                            endDate: '04/01/2050',
                                        },
                                    ],
                                },
                            ],
                        } as AccountModel | Account),
                }),
                Mock.of<DataPurchaseService>({
                    activateTrialExistingAccount: () => of({}),
                }),
                Mock.of<DataLayerService>({
                    getData: () => ({ products: undefined }),
                    update: () => {},
                }),
                Mock.of<ObjectTokenizerService>({
                    tokenize: () => 'asdf',
                }),
                Mock.of<TrialAccountNavigationService>({
                    gotoTrialThanksPage: () => {},
                }),
                Mock.of<UserSettingsService>({})
            );

            expect(service.activateExistingAccount({} as PackageModel, 'password', 'planCode', 'radioId', 'username', undefined)).toBeObservable(
                cold('(a|)', {
                    a: {
                        subscriptions: [
                            {
                                plans: [
                                    {
                                        endDate: '04/01/2050',
                                    },
                                ],
                            },
                        ],
                    } as AccountModel,
                })
            );
        });

        it('should fail without completing on error', () => {
            const service = new TrialActivationService(
                Mock.of<NonPiiLookupTrialActivationWorkflow>(),
                Mock.of<DataPurchaseService>({
                    activateTrialExistingAccount: () => throwError('error'),
                }),
                Mock.of<DataLayerService>({
                    getData: () => ({ products: undefined }),
                    update: () => {},
                }),
                Mock.of<ObjectTokenizerService>(),
                Mock.of<TrialAccountNavigationService>(),
                Mock.of<UserSettingsService>({})
            );

            expect(service.activateExistingAccount({} as PackageModel, 'password', 'planCode', 'radioId', 'username', undefined)).toBeObservable(cold('#'));
        });
    });

    describe('activateNewAccount', () => {
        it('should next out data on success', () => {
            const service = new TrialActivationService(
                Mock.of<NonPiiLookupTrialActivationWorkflow>({
                    build: () =>
                        of({
                            subscriptions: [
                                {
                                    plans: [
                                        {
                                            endDate: '04/01/2050',
                                        },
                                    ],
                                },
                            ],
                        } as AccountModel | Account),
                }),
                Mock.of<DataPurchaseService>({
                    activateTrialAccount: () => of({}),
                }),
                Mock.of<DataLayerService>({
                    getData: () => ({ products: undefined }),
                    update: () => {},
                }),
                Mock.of<ObjectTokenizerService>({
                    tokenize: () => 'asdf',
                }),
                Mock.of<TrialAccountNavigationService>({
                    gotoTrialThanksPage: () => {},
                }),
                Mock.of<UserSettingsService>({
                    setSelectedCanadianProvince: () => {},
                })
            );

            expect(
                service.activateNewAccount(
                    {
                        country: 'us',
                    } as AccountData,
                    'radioId',
                    {} as PackageModel,
                    'lang'
                )
            ).toBeObservable(
                cold('(a|)', {
                    a: {
                        subscriptions: [
                            {
                                plans: [
                                    {
                                        endDate: '04/01/2050',
                                    },
                                ],
                            },
                        ],
                    },
                })
            );
        });
    });
});
