import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, Injector, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApiCallInterceptor } from './core/services/api-call-interceptor.service';
import { BrowserSessionTrackerService } from '@de-care/shared/browser-common/state-session-tracker';
import { AppTimer, Timer } from '@de-care/shared/legacy-core/timer';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Angulartics2Module } from 'angulartics2';
import { AppSettings, LOCAL_STORAGE_OVERRIDE_DATA_NAME, LOCAL_STORAGE_SETTINGS_OVERRIDE_FLAG_NAME, SettingsLoaderService, SettingsService } from '@de-care/settings';
import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { APP_BASE_HREF, DOCUMENT, PlatformLocation, registerLocaleData } from '@angular/common';
import localeFrCa from '@angular/common/locales/fr-CA';
import localeFrCaExtra from '@angular/common/locales/extra/fr-CA';
import localeEnCa from '@angular/common/locales/en-CA';
import localeEnCaExtra from '@angular/common/locales/extra/en-CA';
import { ModuleWithTranslation, LanguageResources } from '@de-care/shared/translation';
import { TRANSLATION_SETTINGS, TranslationSettingsToken, COUNTRY_SETTINGS, CountrySettingsToken } from '@de-care/shared/configuration-tokens-locales';
import { AppService } from './app.service';
import { concatMap, take } from 'rxjs/operators';
import { LocalStorageService } from '@de-care/browser-common';
import { buildStorageKey } from './build-storage-key.function';
import { Amazon, AMAZON_OBJECT_KEY } from '@de-care/domains/subscriptions/state-amazon-linking';
import { DataTrackerService } from '@de-care/shared/data-tracker';
import { DomainsCustomerStateLocaleModule } from '@de-care/domains/customer/state-locale';
import { DomainsDataLayerStateTrackingModule } from '@de-care/domains/data-layer/state-tracking';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { SharedStateSettingsModule, Settings, appSettingsLoaded } from '@de-care/shared/state-settings';
import { DeCareEnvironmentToken } from '@de-care/de-care/shared/environment';
import { DomainsUtilityStateEnvironmentInfoModule } from '@de-care/domains/utility/state-environment-info';
import { ChatProviderToken } from '@de-care/shared/configuration-tokens-chat';
import { DeCareSharedStateLoadingModule, pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { DOT_COM_URL } from '@de-care/shared/configuration-tokens-dot-com';
import { OAC_BASE_URL } from '@de-care/shared/configuration-tokens-oac';
import { DomainsUtilityStateIpLocationModule } from '@de-care/domains/utility/state-ip-location';
import { DOT_COM_SHELL_CONFIG, DEFAULT_DOT_COM_SHELL_CONFIG_US, DEFAULT_DOT_COM_SHELL_CONFIG_CANADA } from '@de-care/de-care-use-cases/shared/ui-shell-dot-com';
import { PLAYER_APP_TOKEN_CONFIG, PlayerAppTokenConfig } from '@de-care/shared/configuration-tokens-player-app';
import { SmartLinkUrls, SMART_LINK_URLS } from '@de-care/shared/configuration-tokens-smart-link';
import { SheerIdWidgetUrls, SHEER_ID_WIDGET_URLS } from '@de-care/shared/configuration-tokens-sheer-url';
import { NU_DETECT_SETTINGS, NuDetectSettings } from '@de-care/shared/configuration-tokens-nudetect';
import { CMS_API_BASE_URL } from '@de-care/shared/configuration-tokens-cms';
import { DomainsUtilityStateLogMessageModule } from '@de-care/domains/utility/state-log-message';
import { AmexSdkMode, AmexStaticParams, AMEX_PARAMS } from '@de-care/shared/configuration-tokens-amex';
import { AMAZON_CLIENT_ID } from '@de-care/shared/configuration-tokens-amazon';
import { appRootReducer, StoreAppRootEffects } from '@de-care/shared/browser-common/state-session-tracker';
import { GlobalHttpInterceptor } from './core/services/global-http-interceptor.service';
import { GlobalAppErrorHandler } from './core/services/global-error-handler.service';
import { SharedSxmUiUiIconLogoAnimatedModule } from '@de-care/shared/sxm-ui/ui-icon-logo-animated';
import { CLIENT_SDK_BASE_URL, CLIENT_SDK_ENABLED } from '@de-care/shared/configuration-tokens-client-sdk';

//register locales for currencyPipe
registerLocaleData(localeFrCa, localeFrCaExtra);
registerLocaleData(localeEnCa, localeEnCaExtra);

export function amazonInit(document) {
    return document.defaultView[AMAZON_OBJECT_KEY];
}

export function settingsInit(localStorageService: LocalStorageService, settingsLoaderService: SettingsLoaderService) {
    return settingsLoaderService.load(
        environment,
        localStorageService.get(buildStorageKey(LOCAL_STORAGE_OVERRIDE_DATA_NAME)),
        localStorageService.get(buildStorageKey(LOCAL_STORAGE_SETTINGS_OVERRIDE_FLAG_NAME))
    );
}

export function initMicroserviceApiBaseUrl(appSettings: Settings) {
    return `${appSettings?.apiUrl}${appSettings?.apiPath}`;
}

export function initOacBaseUrl(appSettings: Settings) {
    return appSettings?.oacUrl?.endsWith('/') ? appSettings?.oacUrl?.slice(0, -1) : appSettings?.oacUrl;
}

export function initDotComUrl(appSettings: Settings) {
    return appSettings?.dotComUrl?.endsWith('/') ? appSettings?.dotComUrl?.slice(0, -1) : appSettings?.dotComUrl;
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

export function initSmartLinkUrls(appSettings: Settings): SmartLinkUrls {
    return {
        toPlayer: appSettings?.smartLinkUrls?.toPlayerApp,
        toPlayerAppForInstantStream: appSettings?.smartLinkUrls?.toPlayerAppForInstantStream,
    };
}

export function initSheerIdWidgetUrls(appSettings: Settings): SheerIdWidgetUrls {
    return {
        sheerIdIdentificationWidgetUrl: appSettings?.sheerIdIdentificationWidgetUrl,
        sheerIdIdentificationReVerificationWidgetUrl: appSettings?.sheerIdIdentificationReVerificationWidgetUrl,
    };
}

export function nuDetectSettingsFactory(appSettings: Settings): NuDetectSettings {
    return {
        ndClientId: appSettings?.ndClientId,
        ndClientEnabled: appSettings?.ndClientEnabled,
    };
}

export function initCmsApiToken(appSettings: Settings): string {
    return `${appSettings?.cmsUrlBase}`;
}

export function browserSessionTracker_Init(browserSessionTrackerService: BrowserSessionTrackerService) {
    return () => {
        browserSessionTrackerService.startApiLastCalledTimer();
    };
}

export function appSettingsInit(store: Store, appSettings: Settings) {
    return () => {
        store.dispatch(appSettingsLoaded({ settings: appSettings }));
    };
}

export function initDotComShellConfig(appSettings: Settings) {
    if (!appSettings.dotComConfig || !appSettings.dotComConfig.navigationDomain) {
        return appSettings.country == 'us' ? DEFAULT_DOT_COM_SHELL_CONFIG_US : DEFAULT_DOT_COM_SHELL_CONFIG_CANADA;
    }
    return appSettings.dotComConfig;
}

export function translationSettingsFactory(settingsService: SettingsService): TranslationSettingsToken {
    return settingsService.isCanadaMode
        ? {
              canToggleLanguage: true,
              languagesSupported: ['en-CA', 'fr-CA'],
          }
        : { canToggleLanguage: false, languagesSupported: ['en-US'] };
}

export function countrySettingsFactory(settingsService: SettingsService): CountrySettingsToken {
    return { countryCode: settingsService?.settings?.country };
}

export function amexParamsFactory(settingsService: SettingsService): AmexStaticParams {
    return {
        mode: settingsService?.settings?.amexMode as AmexSdkMode,
        merchantApiKey: settingsService?.settings?.merchantApiKey,
        authRedirectUrl: settingsService?.settings?.amexAuthRedirectUrl,
    };
}

export function amazonCLientId(settingsService: SettingsService): string {
    return settingsService?.settings?.amzClientId;
}

export function getChatProviderFromSettingsService(appSettings: Settings) {
    return appSettings.chatProvider;
}

//********************************************************************************
@NgModule({
    imports: [
        BrowserModule.withServerTransition({ appId: 'app-root' }),
        HttpClientModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),

        StoreModule.forRoot(
            { router: routerReducer },
            {
                // TODO: remove these after code refactoring is done to ensure no mutations
                //       (will need to remove them to be able to find mutation violations at runtime)
                runtimeChecks: {
                    strictStateImmutability: false,
                    strictActionImmutability: false,
                },
            }
        ),
        StoreRouterConnectingModule.forRoot(),
        EffectsModule.forRoot([]),
        environment.production ? [] : StoreDevtoolsModule.instrument({ maxAge: 25 }),
        // TODO: figure this out
        StoreModule.forFeature('appRootStore', appRootReducer),
        EffectsModule.forFeature([StoreAppRootEffects]),

        AppRoutingModule,
        SharedStateSettingsModule,
        DomainsUtilityStateEnvironmentInfoModule,
        Angulartics2Module.forRoot({
            pageTracking: {
                excludedRoutes: [
                    'checkout',
                    'activate/trial',
                    'subscription',
                    'student/re-verify',
                    'subscribe/entitlement',
                    'account',
                    'subscribe/upgrade-vip',
                    'transfer',
                    'subscribe/trial/streaming',
                ],
            },
        }),
        DomainsCustomerStateLocaleModule,
        DomainsDataLayerStateTrackingModule,
        DomainsUtilityStateLogMessageModule,
        DeCareSharedStateLoadingModule,
        DomainsUtilityStateIpLocationModule,
        SharedSxmUiUiIconLogoAnimatedModule,
    ],
    declarations: [AppComponent],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: GlobalHttpInterceptor, multi: true },
        { provide: ErrorHandler, useClass: GlobalAppErrorHandler },
        { provide: DeCareEnvironmentToken, useValue: environment },
        { provide: SHEER_ID_WIDGET_URLS, useFactory: initSheerIdWidgetUrls, deps: [AppSettings] },
        { provide: AppSettings, useFactory: settingsInit, deps: [LocalStorageService, SettingsLoaderService] },
        { provide: MICROSERVICE_API_BASE_URL, useFactory: initMicroserviceApiBaseUrl, deps: [AppSettings] },
        { provide: CLIENT_SDK_BASE_URL, useFactory: (appSettings: Settings) => appSettings?.clientSdkBaseUrl, deps: [AppSettings] },
        { provide: OAC_BASE_URL, useFactory: initOacBaseUrl, deps: [AppSettings] },
        { provide: DOT_COM_URL, useFactory: initDotComUrl, deps: [AppSettings] },
        { provide: NU_DETECT_SETTINGS, useFactory: nuDetectSettingsFactory, deps: [AppSettings] },
        { provide: PLAYER_APP_TOKEN_CONFIG, useFactory: initPlayerAppTokenConfig, deps: [AppSettings] },
        { provide: SMART_LINK_URLS, useFactory: initSmartLinkUrls, deps: [AppSettings] },
        { provide: CMS_API_BASE_URL, useFactory: initCmsApiToken, deps: [AppSettings] },
        { provide: CLIENT_SDK_ENABLED, useFactory: (appSettings) => appSettings.featureFlags?.enableClientSDKIntegration === 'true', deps: [AppSettings] },
        Title,
        { provide: AppTimer, useClass: Timer },
        BrowserSessionTrackerService,
        {
            provide: APP_INITIALIZER,
            useFactory: browserSessionTracker_Init,
            deps: [BrowserSessionTrackerService],
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: appSettingsInit,
            deps: [Store, AppSettings],
            multi: true,
        },
        {
            provide: APP_BASE_HREF,
            useFactory: (pl: PlatformLocation) => {
                const baseHrefFromDom = pl.getBaseHrefFromDOM();
                return baseHrefFromDom?.endsWith('/') ? baseHrefFromDom?.slice(0, -1) : baseHrefFromDom;
            },
            deps: [PlatformLocation],
        },
        { provide: TRANSLATION_SETTINGS, useFactory: translationSettingsFactory, deps: [SettingsService] },
        { provide: COUNTRY_SETTINGS, useFactory: countrySettingsFactory, deps: [SettingsService] },
        { provide: HTTP_INTERCEPTORS, useClass: ApiCallInterceptor, multi: true },
        { provide: Amazon, useFactory: amazonInit, deps: [DOCUMENT] },
        { provide: ChatProviderToken, useFactory: getChatProviderFromSettingsService, deps: [AppSettings] },
        { provide: DOT_COM_SHELL_CONFIG, useFactory: initDotComShellConfig, deps: [AppSettings] },
        { provide: AMEX_PARAMS, useFactory: amexParamsFactory, deps: [SettingsService] },
        { provide: AMAZON_CLIENT_ID, useFactory: amazonCLientId, deps: [SettingsService] },
    ],
    bootstrap: [AppComponent],
})
export class AppModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, appService: AppService, dataTrackerService: DataTrackerService, store: Store) {
        const languages: LanguageResources = {
            'en-CA': require('libs/app-common/src/lib/i18n/app.en-CA.json'),
            'en-US': require('libs/app-common/src/lib/i18n/app.en-US.json'),
            'fr-CA': require('libs/app-common/src/lib/i18n/app.fr-CA.json'),
        };
        super(translateService, languages);
        translateService.setDefaultLang('en-US');
        appService
            .getLanguage()
            .pipe(
                concatMap((lang) => translateService.use(lang)),
                take(1)
            )
            .subscribe();

        appService.onLangChanged
            .pipe(
                concatMap((lang) => {
                    return translateService.use(lang).pipe(take(1));
                })
            )
            .subscribe(() => store.dispatch(pageDataFinishedLoading()));

        appService.pageTitle = translateService.instant('app.pageTitle');

        // TODO: wire up actual data tracker error handling stuff
        //       (NOTE: these errors SHOULD NOT run through the Angular error handler, they
        //              should be handled in a non-blocking way)
        // dataTrackerService.errors$.subscribe(error => console.error(error));
        dataTrackerService.startTracking();
    }
}
