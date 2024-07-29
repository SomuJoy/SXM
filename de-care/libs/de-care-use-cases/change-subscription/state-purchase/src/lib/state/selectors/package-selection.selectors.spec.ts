import { getChangeSubscriptionData } from './package-selection.selectors';

describe('getChangeSubscriptionData', () => {
    describe('current package name property', () => {
        it('should have current package name', () => {
            const mockOffers = { upgrades: [], other: [] };
            const mockPackageName = 'test';
            const result = getChangeSubscriptionData.projector(mockOffers, mockPackageName);
            expect(result).toHaveProperty('currentPackageName', mockPackageName);
        });
    });
    describe('eligible packages property', () => {
        it('should contain upgrades when upgrade offers exist', () => {
            const mockUpgradeOffer = {};
            const mockOffers = { upgrades: [mockUpgradeOffer], other: [] };
            const mockPackageName = 'test';
            const result = getChangeSubscriptionData.projector(mockOffers, mockPackageName);
            expect(result.eligiblePackages).toContain(mockUpgradeOffer);
        });
    });
    describe('additional eligible packages property', () => {
        it('should contain others when other offers exist', () => {
            const mockOtherOffer = {};
            const mockOffers = { upgrades: [], other: [mockOtherOffer] };
            const mockPackageName = 'test';
            const result = getChangeSubscriptionData.projector(mockOffers, mockPackageName);
            expect(result.additionalEligiblePackages).toContain(mockOtherOffer);
        });
    });

    describe('when upgrades are empty', () => {
        describe('and match on current package name is found in other offers', () => {
            describe('eligible packages property', () => {
                it('should contain offer that has bestPackage as true', () => {
                    const mockPackageName = 'test';
                    const mockOtherOffer = { packageName: mockPackageName, bestPackage: true };
                    const mockOffers = { upgrades: [], other: [mockOtherOffer] };
                    const result = getChangeSubscriptionData.projector(mockOffers, mockPackageName);
                    expect(result.eligiblePackages).toContain(mockOtherOffer);
                });
            });
            describe('additional eligible packages property', () => {
                it('should NOT contain offers that have package name same as current package name', () => {
                    const mockPackageName = 'test';
                    const mockOtherOffer = { packageName: mockPackageName, order: 1 };
                    const mockOtherOffer2 = { packageName: mockPackageName, order: 2 };
                    const mockOffers = { upgrades: [], other: [mockOtherOffer, mockOtherOffer2] };
                    const result = getChangeSubscriptionData.projector(mockOffers, mockPackageName);
                    expect(result.additionalEligiblePackages).not.toContain(mockOtherOffer);
                    expect(result.additionalEligiblePackages).not.toContain(mockOtherOffer2);
                });
            });
        });
    });
});
