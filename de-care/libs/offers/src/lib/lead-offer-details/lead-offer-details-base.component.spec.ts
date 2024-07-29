import { Mock } from 'ts-mockery';
import { LeadOfferDetailsBaseComponent, PackageDescriptionFooterInterpolation } from './lead-offer-details-base.component';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyPipe, I18nPluralPipe } from '@angular/common';
import { PackageModel, PlanTypeEnum, calcSavingsPercent } from '@de-care/data-services';
import { SettingsService } from '@de-care/settings';

describe('leadOfferDetailsBaseComponent', () => {
    let component: LeadOfferDetailsBaseComponent;
    const translationsMapping = {
        'offers.leadOfferDetailsComponent.DETAILS_FOOTER_SUFFIX': '<footer suffix>',
        'offers.leadOfferDetailsComponent.PLURAL_MAP.MONTH': '<plural month>',
        'offers.leadOfferDetailsComponent.PER_MONTH_COPY': '<per month>'
    };
    const mockSettingsService = {
        isCanadaMode: false
    };
    const mockTranslateService = {
        instant: jest.fn().mockImplementation(val => translationsMapping[val])
    };
    const mockCurrencyPipe = {
        transform: jest.fn().mockImplementation(val => `<dollar>${val}`)
    };
    const mockI18nPluralPipe = {
        transform: jest.fn().mockImplementation((val, plural) => `${val}${plural}`)
    };
    const baseMockOffer: PackageModel = {
        planCode: 'abc',
        type: PlanTypeEnum.Default,
        packageName: 'testPkg',
        termLength: 12,
        price: 10,
        retailPrice: 20,
        fallback: false,
        code: ''
    };
    const baseExpectedInterpolatedValue: PackageDescriptionFooterInterpolation = {
        price: '<dollar>10',
        perMonth: '', // not MCP
        monthsPluralized: '12<plural month>',
        termLength: baseMockOffer.termLength,
        savings: calcSavingsPercent(baseMockOffer),
        retailPrice: '<dollar>20'
    };

    const baseMockPackageDescription = {
        promoFooter: null,
        footer: null
    };

    beforeEach(() => {
        component = new LeadOfferDetailsBaseComponent(
            Mock.of<TranslateService>(mockTranslateService),
            Mock.of<CurrencyPipe>(mockCurrencyPipe),
            Mock.of<I18nPluralPipe>(mockI18nPluralPipe),
            Mock.of<SettingsService>(mockSettingsService)
        );
    });

    describe('sanity', () => {
        it('should instantiate', () => {
            expect(component).toEqual(expect.objectContaining({}));
        });
    });

    describe('getPackageDescriptionInterpolationValues', () => {
        it('PlanTypeEnum.Default', () => {
            const mockOffer: PackageModel = {
                ...baseMockOffer
            };

            const expected: PackageDescriptionFooterInterpolation = {
                ...baseExpectedInterpolatedValue
            };

            const actual = component.getPackageDescriptionInterpolationValues(mockOffer);
            expect(actual).toEqual(expected);
        });

        it('PlanTypeEnum.Promo', () => {
            const mockOffer: PackageModel = {
                ...baseMockOffer,
                type: PlanTypeEnum.Promo
            };

            const expected: PackageDescriptionFooterInterpolation = {
                ...baseExpectedInterpolatedValue
            };

            const actual = component.getPackageDescriptionInterpolationValues(mockOffer);
            expect(actual).toEqual(expected);
        });

        it('PlanTypeEnum.PromoMCP', () => {
            const mockOffer: PackageModel = {
                ...baseMockOffer,
                type: PlanTypeEnum.PromoMCP
            };

            const expected = {
                ...baseExpectedInterpolatedValue,
                perMonth: '<per month>',
                savings: calcSavingsPercent(mockOffer)
            };

            const actual = component.getPackageDescriptionInterpolationValues(mockOffer);
            expect(actual).toEqual(expected);
        });
    });

    describe('getOfferDescriptionFooter', () => {
        describe('streaming', () => {
            it('should return empty string', () => {
                const mockOffer: PackageModel = {
                    ...baseMockOffer,
                    type: PlanTypeEnum.PromoMCP
                };
                const mockPackageDescription = {
                    ...baseMockPackageDescription
                };

                const expected = '';

                const actual = component.getOfferDescriptionFooter(mockOffer, mockPackageDescription);
                expect(actual).toEqual(expected);
            });

            it('should return package footer text if present', () => {
                const mockOffer: PackageModel = {
                    ...baseMockOffer,
                    type: PlanTypeEnum.PromoMCP
                };
                const mockPackageDescription = {
                    ...baseMockPackageDescription,
                    footer: '<footer text>'
                };

                const expected = mockPackageDescription.footer;

                const actual = component.getOfferDescriptionFooter(mockOffer, mockPackageDescription);
                expect(actual).toEqual(expected);
            });
        });

        describe('Non-streaming', () => {
            describe('Other edge cases', () => {
                it('should return footer if present when there is no Promofooter', () => {
                    const mockOffer: PackageModel = {
                        ...baseMockOffer,
                        type: PlanTypeEnum.PromoMCP
                    };
                    const mockPackageDescription = {
                        promoFooter: null,
                        footer: '<set footer>'
                    };

                    const expected = mockPackageDescription.footer;

                    const actual = component.getOfferDescriptionFooter(mockOffer, mockPackageDescription);
                    expect(actual).toEqual(expected);
                });

                it('should return empty string if both promoFooter and footer are not present', () => {
                    const mockOffer: PackageModel = {
                        ...baseMockOffer,
                        type: PlanTypeEnum.PromoMCP
                    };
                    const mockPackageDescription = {
                        promoFooter: null,
                        footer: null
                    };

                    const expected = '';

                    const actual = component.getOfferDescriptionFooter(mockOffer, mockPackageDescription);
                    expect(actual).toEqual(expected);
                });
            });

            describe('Positive paths', () => {
                it.each`
                    planType
                    ${PlanTypeEnum.Promo}
                    ${PlanTypeEnum.PromoMCP}
                    ${PlanTypeEnum.PromoMCP}
                    ${PlanTypeEnum.RtpOffer}
                `('should return computed footer for $planType', ({ planType }) => {
                    const mockOffer: PackageModel = {
                        ...baseMockOffer,
                        type: planType
                    };
                    const mockPackageDescription = {
                        promoFooter: '<set promo footer>',
                        footer: '<set footer>'
                    };

                    const expected = `${mockPackageDescription.promoFooter} <footer suffix>`;

                    const actual = component.getOfferDescriptionFooter(mockOffer, mockPackageDescription);
                    expect(actual).toEqual(expected);
                });
            });
        });
    });
});
