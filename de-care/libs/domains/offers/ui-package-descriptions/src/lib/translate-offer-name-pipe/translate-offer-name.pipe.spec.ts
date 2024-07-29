import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateOfferNamePipe } from './translate-offer-name.pipe';
import { Mock } from 'ts-mockery';

describe('translateOfferName', () => {
    let translateService: TranslateService;
    let pipe: TranslateOfferNamePipe;
    const mockChangeDetectorRef = Mock.of<ChangeDetectorRef>();
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()]
        });
        translateService = TestBed.inject(TranslateService);
        translateService.setDefaultLang('en-US');
        pipe = new TranslateOfferNamePipe(translateService, mockChangeDetectorRef);
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
                        name: 'All Access'
                    }
                }
            }
        });
        const spy = jest.spyOn(pipe, 'getDescriptionContent');
        const package1 = { packageName: 'SIR_AUD_ALLACCESS', type: 'PROMO' };
        expect(pipe.transform(package1)).toBe('All Access');
        expect(pipe.transform(package1)).toBe('All Access');
        expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should support caching for different requests', () => {
        translateService.setTranslation('en-US', {
            app: {
                packageDescriptions: {
                    SIR_AUD_ALLACCESS: {
                        name: 'All Access'
                    },
                    SIR_AUD_SELECT: {
                        name: 'Select'
                    }
                }
            }
        });
        const spy = jest.spyOn(pipe, 'getDescriptionContent');
        const package1 = { packageName: 'SIR_AUD_ALLACCESS', type: 'PROMO' };
        const package2 = { packageName: 'SIR_AUD_SELECT', type: 'TRIAL' };
        expect(pipe.transform(package1)).toBe('All Access');
        expect(pipe.transform(package1)).toBe('All Access');
        expect(pipe.transform(package2)).toBe('Select');
        expect(pipe.transform(package2)).toBe('Select');
        expect(spy).toHaveBeenCalledTimes(2);
    });
});
