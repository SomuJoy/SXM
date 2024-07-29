import { getFirstOffer, getFirstOfferPackageName, offerIsStreaming } from './offer-helpers';
import { Mock } from 'ts-mockery';
import { OfferModel, PackageModel } from '../models/offer.model';

describe('offer helpers functions', () => {
    describe('offerIsStreaming', () => {
        it('should return true if offers array has an offer with streaming flag set to true', () => {
            const mockOffer = Mock.of<OfferModel>({ offers: [{ streaming: true }] });
            expect(offerIsStreaming(mockOffer)).toBe(true);
        });
        it('should return false if offers array has an offer with streaming flag set to false', () => {
            const mockOffer = Mock.of<OfferModel>({ offers: [{ streaming: false }] });
            expect(offerIsStreaming(mockOffer)).toBe(false);
        });
        it('should return false if offers array is empty', () => {
            const mockOffer = Mock.of<OfferModel>({ offers: [] });
            expect(offerIsStreaming(mockOffer)).toBe(false);
        });
        it('should return false if offers array not defined', () => {
            const mockOffer = Mock.of<OfferModel>({});
            expect(offerIsStreaming(mockOffer)).toBe(false);
        });
        it('should return false if offer is null or not defined', () => {
            expect(offerIsStreaming(null)).toBe(false);
            expect(offerIsStreaming(undefined)).toBe(false);
        });
    });
    describe('getFirstOffer', () => {
        it('should return null when offer model is null', () => {
            expect(getFirstOffer(null)).toBe(null);
        });
        it('should return null when offer model has empty array', () => {
            const mockOffer = Mock.of<OfferModel>({ offers: [] });
            expect(getFirstOffer(mockOffer)).toBe(null);
        });
        it('should return offer when offer model has 1 offer', () => {
            const mockPackage = Mock.of<PackageModel>({});
            const mockOffer = Mock.of<OfferModel>({ offers: [mockPackage] });
            expect(getFirstOffer(mockOffer)).toBe(mockPackage);
        });
        it('should return the first offer when offer model has more than 1 offer', () => {
            const mockPackageFirst = Mock.of<PackageModel>({});
            const mockPackageSecond = Mock.of<PackageModel>({});
            const mockOffer = Mock.of<OfferModel>({ offers: [mockPackageFirst, mockPackageSecond] });
            expect(getFirstOffer(mockOffer)).toBe(mockPackageFirst);
        });
    });
    describe('getFirstOfferPackageName', () => {
        it('should return null when offer model is null', () => {
            expect(getFirstOfferPackageName(null)).toBe(null);
        });
        it('should return null when offer model has empty array', () => {
            const mockOffer = Mock.of<OfferModel>({ offers: [] });
            expect(getFirstOfferPackageName(mockOffer)).toBe(null);
        });
        it('should return package name for offer when offer model has 1 offer', () => {
            const packageName = 'test';
            const mockPackage = Mock.of<PackageModel>({ packageName });
            const mockOffer = Mock.of<OfferModel>({ offers: [mockPackage] });
            expect(getFirstOfferPackageName(mockOffer)).toBe(packageName);
        });
        it('should return the first offer when offer model has more than 1 offer', () => {
            const packageName = 'test';
            const mockPackageFirst = Mock.of<PackageModel>({ packageName });
            const mockPackageSecond = Mock.of<PackageModel>({ packageName: 'second test' });
            const mockOffer = Mock.of<OfferModel>({ offers: [mockPackageFirst, mockPackageSecond] });
            expect(getFirstOfferPackageName(mockOffer)).toBe(packageName);
        });
    });
});
