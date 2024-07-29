import { HttpClientModule } from '@angular/common/http';
import { Injector, NgModule, Inject } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { NormalizeLangPrefHelperService } from '@de-care/app-common';
import { LocalStorageService, SessionStorageService } from '@de-care/browser-common';
import {
    ElementsModule,
    ElementsSettings,
    ElementsSettingsLoaderService,
    ElementsSettingsToken,
    FlepzWidgetComponent,
    LOCAL_STORAGE_ELEMENTS_SETTINGS_OVERRIDE_DATA_NAME,
    LOCAL_STORAGE_ELEMENTS_SETTINGS_OVERRIDE_FLAG_NAME,
    PromoCodeValidationComponent,
    RflzWidgetComponent,
    StreamingFlepzWidgetComponent,
    ZAGWidgetComponent,
} from '@de-care/elements';
import { AppSettings, LOCAL_STORAGE_OVERRIDE_DATA_NAME, LOCAL_STORAGE_SETTINGS_OVERRIDE_FLAG_NAME, Settings, SettingsLoaderService, SettingsService } from '@de-care/settings';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { environment } from '../environments/environment';
import { buildStorageKey } from './build-storage-key.function';
import { DataTrackerService } from '@de-care/shared/data-tracker';
import { DOCUMENT } from '@angular/common';
import { ChatProviderToken } from '@de-care/shared/configuration-tokens-chat';
import { DeCareEnvironmentToken } from '@de-care/de-care/shared/environment';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { NU_DETECT_SETTINGS, NuDetectSettings } from '@de-care/shared/configuration-tokens-nudetect';
import { SmartLinkUrls, SMART_LINK_URLS } from '@de-care/shared/configuration-tokens-smart-link';
import { StreamingPlayerLinkAnchorComponent } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { PlayerAppTokenConfig, PLAYER_APP_TOKEN_CONFIG } from '@de-care/shared/configuration-tokens-player-app';
import { IDENTITY_PARAMETERS, IdentityParameters } from '@de-care/shared/configuration-tokens-identity-parameter';

export function settingsInit(localStorageService: LocalStorageService, settingsLoaderService: SettingsLoaderService): Settings {
    return settingsLoaderService.load(
        environment,
        localStorageService.get(buildStorageKey(LOCAL_STORAGE_OVERRIDE_DATA_NAME)),
        localStorageService.get(buildStorageKey(LOCAL_STORAGE_SETTINGS_OVERRIDE_FLAG_NAME))
    );
}

export function elementsSettingsInit(localStorageService: LocalStorageService, elementsSettingsLoaderService: ElementsSettingsLoaderService): ElementsSettings {
    return elementsSettingsLoaderService.load(
        environment,
        localStorageService.get(buildStorageKey(LOCAL_STORAGE_ELEMENTS_SETTINGS_OVERRIDE_DATA_NAME)),
        localStorageService.get(buildStorageKey(LOCAL_STORAGE_ELEMENTS_SETTINGS_OVERRIDE_FLAG_NAME))
    );
}

export function initMicroserviceApiBaseUrl(appSettings: Settings) {
    return `${appSettings?.apiUrl}${appSettings?.apiPath}`;
}

export function nuDetectSettingsFactory(appSettings: Settings): NuDetectSettings {
    return {
        ndClientId: appSettings?.ndClientId,
        ndClientEnabled: appSettings?.ndClientEnabled,
    };
}

export function getChatProviderFromSettingsService(appSettings: Settings) {
    return appSettings.chatProvider;
}
export function initSmartLinkUrls(appSettings: Settings): SmartLinkUrls {
    return {
        toPlayer: appSettings?.smartLinkUrls?.toPlayerApp,
        toPlayerAppForInstantStream: appSettings?.smartLinkUrls?.toPlayerAppForInstantStream,
    };
}

export function initIdentityParameters(sessionStorageService: SessionStorageService): IdentityParameters {
    const params: any = {};
    sessionStorageService
        .get('paramStr')
        ?.split('&')
        .forEach((v) => {
            const param = v.split('=');
            params[param[0]?.toLowerCase()] = param[1];
        });
    return {
        atok: params?.atok,
        dtok: params?.dtok,
        act: params?.act,
        radioid: params?.radioid,
    };
}

export function initPlayerAppTokenConfig(appSettings: Settings): PlayerAppTokenConfig {
    return {
        baseUrl: appSettings?.synacorPlayerTokenConfig?.baseUrl,
        org: appSettings?.synacorPlayerTokenConfig?.org,
        disableForBrowserUserAgentPlatforms: appSettings?.synacorPlayerTokenConfig?.disableForBrowserUserAgentPlatforms
            ? appSettings?.synacorPlayerTokenConfig?.disableForBrowserUserAgentPlatforms?.split(',').map((item) => item.trim().toLowerCase())
            : [],
    };
}

@NgModule({
    imports: [BrowserModule, HttpClientModule, TranslateModule.forRoot(), Angulartics2RouterlessModule.forRoot(), ElementsModule],
    providers: [
        { provide: DeCareEnvironmentToken, useValue: environment },
        {
            provide: AppSettings,
            useFactory: settingsInit,
            deps: [LocalStorageService, SettingsLoaderService],
        },
        {
            provide: ElementsSettingsToken,
            useFactory: elementsSettingsInit,
            deps: [LocalStorageService, ElementsSettingsLoaderService],
        },
        { provide: MICROSERVICE_API_BASE_URL, useFactory: initMicroserviceApiBaseUrl, deps: [AppSettings] },
        { provide: NU_DETECT_SETTINGS, useFactory: nuDetectSettingsFactory, deps: [AppSettings] },
        { provide: ChatProviderToken, useFactory: getChatProviderFromSettingsService, deps: [AppSettings] },
        { provide: SMART_LINK_URLS, useFactory: initSmartLinkUrls, deps: [AppSettings] },
        { provide: PLAYER_APP_TOKEN_CONFIG, useFactory: initPlayerAppTokenConfig, deps: [AppSettings] },
        { provide: IDENTITY_PARAMETERS, useFactory: initIdentityParameters, deps: [SessionStorageService] },
    ],
    entryComponents: [RflzWidgetComponent, FlepzWidgetComponent, StreamingFlepzWidgetComponent, ZAGWidgetComponent],
})
export class AppModule {
    constructor(
        private injector: Injector,
        translateService: TranslateService,
        dataTrackerService: DataTrackerService,
        settingsService: SettingsService,
        normalizeLangPrefService: NormalizeLangPrefHelperService,
        @Inject(DOCUMENT) document: Document
    ) {
        if (!translateService.defaultLang) {
            translateService.setDefaultLang('en-US');
        }
        if (!translateService.currentLang) {
            translateService.use('en-US');
        }

        const langParam: RegExpMatchArray = document && document.defaultView.location.search.match(/langpref=([^&]*)/i);
        if ((langParam || []).length > 0) {
            translateService.use(normalizeLangPrefService.normalize(langParam[1], settingsService.settings.country));
        }

        // TODO: wire up actual data tracker error handling stuff
        //       (NOTE: these errors SHOULD NOT run through the Angular error handler, they
        //              should be handled in a non-blocking way)
        // dataTrackerService.errors$.subscribe(error => console.error(error));
        dataTrackerService.startTracking();
    }

    ngDoBootstrap() {
        // NOTE:
        // The "as" here after createCustomElement is to fix a TypeScript build error.
        // We should remove it as soon as there is an Angular version that fixes the issue.
        const rflzWidget = createCustomElement(RflzWidgetComponent, { injector: this.injector }) as unknown as CustomElementConstructor;
        customElements.define('sxm-rflz-widget', rflzWidget);

        const flepzWidget = createCustomElement(FlepzWidgetComponent, { injector: this.injector }) as unknown as CustomElementConstructor;
        customElements.define('sxm-flepz-widget', flepzWidget);

        const promoCodeValidationWidget = createCustomElement(PromoCodeValidationComponent, { injector: this.injector }) as unknown as CustomElementConstructor;
        customElements.define('sxm-promo-code-validation-widget', promoCodeValidationWidget);

        const streamingFlepzWidget = createCustomElement(StreamingFlepzWidgetComponent, { injector: this.injector }) as unknown as CustomElementConstructor;
        customElements.define('sxm-streaming-flepz-widget', streamingFlepzWidget);

        const zagWidget = createCustomElement(ZAGWidgetComponent, { injector: this.injector }) as unknown as CustomElementConstructor;
        customElements.define('sxm-zag-widget', zagWidget);

        const streamingPlayerLinkAnchorElement = createCustomElement<StreamingPlayerLinkAnchorComponent>(StreamingPlayerLinkAnchorComponent, { injector: this.injector });
        customElements.define('sxm-player-link', streamingPlayerLinkAnchorElement, { extends: 'a' });
    }
}
