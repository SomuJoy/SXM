import { CredentialsNeededType } from './models';
import { buildLoginCredentials, getCustomerAccounts, getShouldNotCollectUsername } from './selectors';

describe('selectors', () => {
    describe('getCustomerAccounts', () => {
        it('filters out plans with no packageName', () => {
            // arrange
            const planOne = { packageName: 'Choice' };
            const planTwo = { packageName: null };
            const planThree = { packageName: 'All Access' };
            const subscriptionOne = {
                radioService: {
                    last4DigitsOfRadioId: '1234',
                    vehicleInfo: {
                        year: '2020',
                        make: 'Ford',
                        model: 'F-150',
                    },
                },
                streamingService: {
                    maskedUserName: 'xxxem@il.com',
                },
                plans: [planOne, planTwo, planThree],
            };
            const accounts = [
                {
                    last4DigitsOfAccountNumber: '1234',
                    subscriptions: [subscriptionOne],
                },
            ];
            const expected = [
                {
                    accountLast4Digits: '1234',
                    subscriptions: [
                        {
                            plans: [planOne.packageName, planThree.packageName],
                            vehicle: {
                                year: subscriptionOne.radioService.vehicleInfo.year,
                                make: subscriptionOne.radioService.vehicleInfo.make,
                                model: subscriptionOne.radioService.vehicleInfo.model,
                            },
                            radioIDLast4Digits: subscriptionOne.radioService.last4DigitsOfRadioId,
                            maskedUserName: subscriptionOne.streamingService.maskedUserName,
                        },
                    ],
                },
            ];

            // act
            const actual = getCustomerAccounts.projector(accounts);

            // assert
            expect(actual).toEqual(expected);
        });
    });
    describe('buildLoginCredentials', () => {
        describe('None', () => {
            it('should return non when in stepup', () => {
                // arrange
                const stepUp = true;
                const collectUsername = undefined;
                const expected = CredentialsNeededType.none;

                // act
                const actual = buildLoginCredentials.projector(stepUp, collectUsername);

                // assert
                expect(actual).toEqual(expected);
            });
        });

        describe('Password', () => {
            it('should return password when stepUp is false and should collect email is false', () => {
                // arrange
                const stepUp = false;
                const collectUsername = false;
                const expected = CredentialsNeededType.password;

                // act
                const actual = buildLoginCredentials.projector(stepUp, collectUsername);

                // assert
                expect(actual).toEqual(expected);
            });
        });

        describe('UsernameAndPassword', () => {
            it('should return username and password when stepUp is false and should collect email is true', () => {
                // arrange
                const stepUp = false;
                const collectUsername = true;
                const expected = CredentialsNeededType.usernameAndPassword;

                // act
                const actual = buildLoginCredentials.projector(stepUp, collectUsername);

                // assert
                expect(actual).toEqual(expected);
            });
        });
    });

    describe('getShouldNotCollectUsername', () => {
        describe('TRUE (PASSWORD)', () => {
            it('should return true if beat the sold and reuse is false', () => {
                // arrange
                const reuse = false;
                const email = undefined;
                const beatTheSold = true;

                // act
                const actual = getShouldNotCollectUsername.projector(reuse, email, beatTheSold);

                // assert
                expect(actual).toBeTruthy();
            });

            it('should return true if beat the sold is false, reuse is false, and email is true', () => {
                // arrange
                const reuse = false;
                const email = true;
                const beatTheSold = false;

                // act
                const actual = getShouldNotCollectUsername.projector(reuse, email, beatTheSold);

                // assert
                expect(actual).toBeTruthy();
            });

            it('should return true if beat the sold is false, reuse is null, and email is true', () => {
                // arrange
                const reuse = undefined;
                const email = true;
                const beatTheSold = false;

                // act
                const actual = getShouldNotCollectUsername.projector(reuse, email, beatTheSold);

                // assert
                expect(actual).toBeTruthy();
            });
            it('should return true if beat the sold is false, reuse is true, email is true and reuseUndefined is true', () => {
                const reuse = true;
                const email = true;
                const beatTheSold = false;
                const reuseUndefined = true;

                // act
                const actual = getShouldNotCollectUsername.projector(reuse, email, beatTheSold, reuseUndefined);

                // assert
                expect(actual).toBeTruthy();
            });
        });

        describe('FALSE (USERNAMEANDPASSWORD)', () => {
            it('should return false if beat the sold is true and reuse is true', () => {
                // arrange
                const reuse = true;
                const email = undefined;
                const beatTheSold = true;

                // act
                const actual = getShouldNotCollectUsername.projector(reuse, email, beatTheSold);

                // assert
                expect(actual).toBeFalsy();
            });

            it('should return false if beat the sold is false, reuse is true and email is true', () => {
                // arrange
                const reuse = true;
                const email = true;
                const beatTheSold = false;

                // act
                const actual = getShouldNotCollectUsername.projector(reuse, email, beatTheSold);

                // assert
                expect(actual).toBeFalsy();
            });
            it('should return false if beat the sold is false, reuse is true and email is false', () => {
                // arrange
                const reuse = true;
                const email = false;
                const beatTheSold = false;

                // act
                const actual = getShouldNotCollectUsername.projector(reuse, email, beatTheSold);

                // assert
                expect(actual).toBeFalsy();
            });

            it('should return false if beat the sold is false, reuse is false and email is false', () => {
                // arrange
                const reuse = false;
                const email = false;
                const beatTheSold = false;

                // act
                const actual = getShouldNotCollectUsername.projector(reuse, email, beatTheSold);

                // assert
                expect(actual).toBeFalsy();
            });

            it('should return false if beat the sold is false, reuse is null and email is false', () => {
                // arrange
                const reuse = undefined;
                const email = false;
                const beatTheSold = false;

                // act
                const actual = getShouldNotCollectUsername.projector(reuse, email, beatTheSold);

                // assert
                expect(actual).toBeFalsy();
            });
        });
    });
});
