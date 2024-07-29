import { DoBootstrap, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import {
    MyAccountHeaderComponent,
    NAVIGATION_ELEMENTS_BASE_URLS,
    NavigationElementsBaseUrls,
    SxmUiNavigationUiNavigationElementsModule,
    AccountPresenceIconsWidgetComponent,
} from '@de-care/sxm-ui-navigation/ui-navigation-elements';
import { TRANSLATION_SETTINGS, TranslationSettingsToken, COUNTRY_SETTINGS, CountrySettingsToken } from '@de-care/shared/configuration-tokens-locales';
import { LocalStorageService } from '@de-care/shared/browser-common/web-storage';
import { environment } from '../environments/environment';
import { APP_SETTINGS, AppSettings } from './tokens';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { NU_DETECT_SETTINGS, NuDetectSettings } from '@de-care/shared/configuration-tokens-nudetect';
import { HttpClientModule } from '@angular/common/http';
import { DeCareEnvironmentToken } from '@de-care/de-care/shared/environment';
import { TranslateModule } from '@ngx-translate/core';
import { DOT_COM_URL } from '@de-care/shared/configuration-tokens-dot-com';
import { OAC_BASE_URL } from '@de-care/shared/configuration-tokens-oac';
import { LoginFormWidgetComponentModule, LoginFormWidgetComponent } from '@de-care/sxm-ui-navigation/ui-login';
import { registerLocaleData } from '@angular/common';
import localeFrCa from '@angular/common/locales/fr-CA';
import localeFrCaExtra from '@angular/common/locales/extra/fr-CA';
import localeEnCa from '@angular/common/locales/en-CA';
import localeEnCaExtra from '@angular/common/locales/extra/en-CA';
import { SmartLinkUrls, SMART_LINK_URLS } from '@de-care/shared/configuration-tokens-smart-link';

registerLocaleData(localeFrCa, localeFrCaExtra);
registerLocaleData(localeEnCa, localeEnCaExtra);

export function settingsFactory(localStorageService: LocalStorageService): AppSettings {
    const settings = environment.production && window ? window['sxmUiNavigationElementsSettings'] : environment;
    const settingsToOverride = localStorageService.get('sxmui_navigation_settings');
    const useOverrides = localStorageService.get('sxmui_navigation_useOverrideSettings');
    if (useOverrides && !!settingsToOverride) {
        return { ...settings, ...settingsToOverride };
    } else {
        return settings;
    }
}

export function microserviceApiBaseUrlFactory(appSettings: AppSettings) {
    return `${appSettings?.apiUrl}`;
}

export function initOacBaseUrl(appSettings: AppSettings) {
    return appSettings?.oacUrl?.endsWith('/') ? appSettings?.oacUrl?.slice(0, -1) : appSettings?.oacUrl;
}

export function initDotComUrl(appSettings: AppSettings) {
    return appSettings?.dotComUrl?.endsWith('/') ? appSettings?.dotComUrl?.slice(0, -1) : appSettings?.dotComUrl;
}

export function nuDetectSettingsFactory(appSettings: AppSettings): NuDetectSettings {
    return {
        ndClientId: appSettings?.ndClientId,
        ndClientEnabled: appSettings?.ndClientEnabled,
    };
}

export function navigationUrlsFactory(appSettings: AppSettings, oacUrl: string, dotComUrl: string): NavigationElementsBaseUrls {
    return {
        oacUrl,
        careUrl: appSettings?.careUrl.endsWith('/') ? appSettings?.careUrl.slice(0, -1) : appSettings?.careUrl,
        dotComUrl,
    };
}

export function countrySettingsFactory(appSettings: AppSettings): CountrySettingsToken {
    return { countryCode: appSettings?.countryCode };
}

export function translationSettingsFactory(countrySettingsToken: CountrySettingsToken, appSettings: AppSettings): TranslationSettingsToken {
    return countrySettingsToken.countryCode.toLowerCase() === 'ca'
        ? {
              canToggleLanguage: true,
              languagesSupported: ['en-CA', 'fr-CA'],
              defaultLanguage: appSettings.defaultLocale,
          }
        : { canToggleLanguage: false, languagesSupported: ['en-US'] };
}

export function initSmartLinkUrls(appSettings: AppSettings): SmartLinkUrls {
    return {
        toPlayer: appSettings?.smartLinkUrls?.toPlayerApp,
        toPlayerAppForInstantStream: appSettings?.smartLinkUrls?.toPlayerAppForInstantStream,
    };
}

@NgModule({
    declarations: [],
    imports: [BrowserModule, HttpClientModule, TranslateModule.forRoot(), SxmUiNavigationUiNavigationElementsModule, LoginFormWidgetComponentModule],
    providers: [
        { provide: DeCareEnvironmentToken, useValue: environment },
        { provide: APP_SETTINGS, useFactory: settingsFactory, deps: [LocalStorageService] },
        { provide: MICROSERVICE_API_BASE_URL, useFactory: microserviceApiBaseUrlFactory, deps: [APP_SETTINGS] },
        { provide: OAC_BASE_URL, useFactory: initOacBaseUrl, deps: [APP_SETTINGS] },
        { provide: DOT_COM_URL, useFactory: initDotComUrl, deps: [APP_SETTINGS] },
        { provide: NU_DETECT_SETTINGS, useFactory: nuDetectSettingsFactory, deps: [APP_SETTINGS] },
        { provide: NAVIGATION_ELEMENTS_BASE_URLS, useFactory: navigationUrlsFactory, deps: [APP_SETTINGS, OAC_BASE_URL, DOT_COM_URL] },
        { provide: COUNTRY_SETTINGS, useFactory: countrySettingsFactory, deps: [APP_SETTINGS] },
        { provide: TRANSLATION_SETTINGS, useFactory: translationSettingsFactory, deps: [COUNTRY_SETTINGS, APP_SETTINGS] },
        { provide: SMART_LINK_URLS, useFactory: initSmartLinkUrls, deps: [APP_SETTINGS] },
    ],
    entryComponents: [MyAccountHeaderComponent, AccountPresenceIconsWidgetComponent, LoginFormWidgetComponent],
})
export class AppModule implements DoBootstrap {
    constructor(private injector: Injector) {}

    ngDoBootstrap() {
        customElements.define(
            'sxm-ui-nav-my-account-header',
            createCustomElement(MyAccountHeaderComponent, { injector: this.injector }) as unknown as CustomElementConstructor
        );
        customElements.define(
            'sxm-ui-nav-account-presence-icons',
            createCustomElement(AccountPresenceIconsWidgetComponent, { injector: this.injector }) as unknown as CustomElementConstructor
        );
        customElements.define('sxm-ui-login-form', createCustomElement(LoginFormWidgetComponent, { injector: this.injector }) as unknown as CustomElementConstructor);
    }
}
