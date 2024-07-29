import { TrialAccountNavigationService } from './trial-account-navigation.service';
import { Mock } from 'ts-mockery';
import { Router } from '@angular/router';
import { SettingsService } from '@de-care/settings';
import { TranslateService } from '@ngx-translate/core';
import { NormalizeLangPrefHelperService } from '@de-care/app-common';

describe('TrialAccountNavigationService', () => {
    const mockDocument = Mock.of<Document>({ defaultView: { location: { href: '' } } });
    const mockSettings = Mock.of<SettingsService>({ settings: { oacUrl: 'thebomb.com' } });
    const mockRouter = Mock.of<Router>({ navigate: () => ({}) });
    const mockTranslate = Mock.of<TranslateService>();
    const mockNormalize = Mock.of<NormalizeLangPrefHelperService>({ getLangKey: () => 'en_US' });

    const service = new TrialAccountNavigationService(mockDocument, mockSettings, mockRouter, mockTranslate, mockNormalize);

    describe('gotoTrialExpiredPage', () => {
        const url = '/activate/trial/trial-expired-overlay';

        it(`should call Router.navigate with the ${url} url`, () => {
            const spy = jest.spyOn(mockRouter, 'navigate');
            service.gotoTrialExpiredPage();
            expect(spy).toHaveBeenCalledWith([url]);
        });
    });

    describe('gotoTrialThanksPage', () => {
        const url = '/activate/trial/thanks';
        const thanksToken = 'superXsecretXtoken';

        it(`should call Router.navigate with the ${url} url`, () => {
            const spy = jest.spyOn(mockRouter, 'navigate');
            service.gotoTrialThanksPage(thanksToken);
            expect(spy).toHaveBeenCalledWith([url], expect.anything());
        });

        it('should call Router.navigate with the "queryParams" as an object with a "thanksToken" property set to a string value', () => {
            const spy = jest.spyOn(mockRouter, 'navigate');
            service.gotoTrialThanksPage(thanksToken);
            expect(spy).toHaveBeenCalledWith(expect.anything(), { queryParams: { thanksToken } });
        });
    });

    describe('goToBauNouv', () => {
        const url = mockSettings.settings.oacUrl;
        const actionString = 'preownedvehiclestrial_view.action';
        const stringMatch = url + actionString;
        const langKey = mockNormalize.getLangKey('');
        const window = mockDocument.defaultView;

        it(`should set "location.href" to a string that starts with the "oacUrl" from the settings plus the ${actionString}`, () => {
            service.goToBauNouv();
            expect(window.location.href.startsWith(stringMatch)).toBeTruthy();
        });

        it('should set "location.href" to a string value that includes the "langpref" query param set to the current language key', () => {
            service.goToBauNouv();
            expect(window.location.href.indexOf(langKey)).toBeGreaterThan(-1);
        });
    });
});
