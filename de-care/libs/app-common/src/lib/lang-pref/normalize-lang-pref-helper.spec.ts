import { Mock } from 'ts-mockery';
import { NormalizeLangPrefHelperService } from './normalize-lang-pref-helper.service';
import { SettingsService } from '@de-care/settings';

describe('NormalizeLangPrefHelperService', () => {
    const mockSettingsService = Mock.of<SettingsService>({
        settings: {
            country: 'us'
        }
    });

    const service = new NormalizeLangPrefHelperService(mockSettingsService);

    describe('normalize()', () => {
        it('should return the langPrefParam if it is already correct, but with uppercase country', () => {
            const result = service.normalize('fr-ca', 'ca');
            expect(result).toEqual('fr-CA');
        });

        it('should return the langPrefParam with upper case country if provided as country param', () => {
            const result = service.normalize('fr', 'ca');
            expect(result).toEqual('fr-CA');
        });

        it('should return the correct lang and country if lanPrefParam is incomplete', () => {
            const result = service.normalize('en-US', 'ca');
            expect(result).toEqual('en-US');
        });

        it('should prefer the country provided in the langPrefParam vs the supplied country', () => {
            const result = service.normalize('fr', 'ca');
            expect(result).toEqual('fr-CA');
        });

        it('should return the correct lang in lowercase and country in uppercase, regardless of supplied format', () => {
            const result = service.normalize('fr', 'ca');
            const result2 = service.normalize('FR', 'ca');
            const result3 = service.normalize('Fr', 'ca');
            const result4 = service.normalize('fR', 'ca');
            const result5 = service.normalize('fR', 'Ca');
            const result6 = service.normalize('fR-Ca', 'cA');
            const result7 = service.normalize('fR-cA', 'CA');
            const expected = 'fr-CA';
            expect(result).toEqual(expected);
            expect(result2).toEqual(expected);
            expect(result3).toEqual(expected);
            expect(result4).toEqual(expected);
            expect(result5).toEqual(expected);
            expect(result6).toEqual(expected);
            expect(result7).toEqual(expected);
        });
    });

    describe('getLangKey()', () => {
        it('should get the lang key from the language country string', () => {
            const result1 = service.getLangKey('fr-ca');
            const result2 = service.getLangKey('en-us');
            expect(result1).toEqual('fr');
            expect(result2).toEqual('en');
        });
    });
});
