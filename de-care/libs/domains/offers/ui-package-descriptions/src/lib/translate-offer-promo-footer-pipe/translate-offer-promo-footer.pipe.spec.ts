import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateOfferPromoFooterPipe } from './translate-offer-promo-footer.pipe';
import { Mock } from 'ts-mockery';

describe('translateOfferPromoFooter', () => {
    let translateService: TranslateService;
    let pipe: TranslateOfferPromoFooterPipe;
    const mockChangeDetectorRef = Mock.of<ChangeDetectorRef>();
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()]
        });
        translateService = TestBed.inject(TranslateService);
        translateService.setDefaultLang('en-US');
        pipe = new TranslateOfferPromoFooterPipe(translateService, mockChangeDetectorRef);
    });
    afterEach(() => {
        translateService = undefined;
        pipe = undefined;
    });
    it('should cache for repeat calls to the same resource', () => {
        translateService.setTranslation('en-US', {
            app: {
                packageDescriptions: {
                    SIR_AUD_ALLACCESS: {
                        promoFooter: 'This is a great offer!'
                    }
                }
            }
        });
        const spy = jest.spyOn(pipe, 'getDescriptionContent');
        const package1 = { packageName: 'SIR_AUD_ALLACCESS', type: 'PROMO' };
        expect(pipe.transform(package1)).toBe('This is a great offer!');
        expect(pipe.transform(package1)).toBe('This is a great offer!');
        expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should support caching for different requests', () => {
        translateService.setTranslation('en-US', {
            app: {
                packageDescriptions: {
                    SIR_AUD_ALLACCESS: {
                        promoFooter: 'This is a great offer!'
                    },
                    SIR_AUD_SELECT: {
                        promoFooter: 'Another offer'
                    }
                }
            }
        });
        const spy = jest.spyOn(pipe, 'getDescriptionContent');
        const package1 = { packageName: 'SIR_AUD_ALLACCESS', type: 'PROMO' };
        const package2 = { packageName: 'SIR_AUD_SELECT', type: 'TRIAL' };
        expect(pipe.transform(package1)).toBe('This is a great offer!');
        expect(pipe.transform(package1)).toBe('This is a great offer!');
        expect(pipe.transform(package2)).toBe('Another offer');
        expect(pipe.transform(package2)).toBe('Another offer');
        expect(spy).toHaveBeenCalledTimes(2);
    });
});
