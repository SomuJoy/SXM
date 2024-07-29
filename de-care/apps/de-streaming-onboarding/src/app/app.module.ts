import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { DeCareEnvironmentToken } from '@de-care/de-care/shared/environment';
import {
    DeStreamingOnboardingStateSettingsModule,
    setStreamingOnboardingSettings,
    STREAMING_ONBOARDING_SETTINGS_LOCAL_STORAGE_OVERRIDE_DATA_NAME,
    STREAMING_ONBOARDING_SETTINGS_LOCAL_STORAGE_SETTINGS_OVERRIDE_FLAG_NAME,
    StreamingOnboardingSettingsLoaderService,
} from '@de-care/de-streaming-onboarding/state-settings';
import { DomainsCustomerStateLocaleModule } from '@de-care/domains/customer/state-locale';
import { DomainsDataLayerStateTrackingModule } from '@de-care/domains/data-layer/state-tracking';
import { DomainsUtilityStateEnvironmentInfoModule, LoadEnvironmentInfoResolver } from '@de-care/domains/utility/state-environment-info';
import { ChatProviderToken } from '@de-care/shared/configuration-tokens-chat';
import { LocalStorageService } from '@de-care/shared/browser-common/web-storage';
import { DataTrackerService } from '@de-care/shared/data-tracker';
import {
    AppSettings,
    appSettingsLoaded,
    LOCAL_STORAGE_OVERRIDE_DATA_NAME,
    LOCAL_STORAGE_SETTINGS_OVERRIDE_FLAG_NAME,
    Settings,
    SettingsLoaderService,
    SharedStateSettingsModule,
} from '@de-care/shared/state-settings';
import { SharedSxmUiUiPageHeaderBasicModule } from '@de-care/shared/sxm-ui/ui-page-header-basic';
import { TRANSLATION_SETTINGS, TranslationSettingsToken } from '@de-care/shared/configuration-tokens-locales';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Angulartics2Module } from 'angulartics2';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { buildStorageKey } from './build-storage-key.function';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { PLAYER_APP_TOKEN_CONFIG, PlayerAppTokenConfig } from '@de-care/shared/configuration-tokens-player-app';
import { NU_DETECT_SETTINGS, NuDetectSettings } from '@de-care/shared/configuration-tokens-nudetect';
import { DomainsUtilityStateLogMessageModule } from '@de-care/domains/utility/state-log-message';

export function settingsInit(localStorageService: LocalStorageService, settingsLoaderService: SettingsLoaderService) {
    return settingsLoaderService.load(
        environment,
        localStorageService.get(buildStorageKey(LOCAL_STORAGE_OVERRIDE_DATA_NAME)),
        localStorageService.get(buildStorageKey(LOCAL_STORAGE_SETTINGS_OVERRIDE_FLAG_NAME))
    );
}

export function appSettingsInit(store: Store, appSettings: Settings) {
    return () => {
        store.dispatch(appSettingsLoaded({ settings: appSettings }));
    };
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

export function streamingOnboardingSettingsInit(localStorageService: LocalStorageService, loader: StreamingOnboardingSettingsLoaderService, store: Store) {
    return () => {
        const settings = loader.load(
            environment,
            localStorageService.get(buildStorageKey(STREAMING_ONBOARDING_SETTINGS_LOCAL_STORAGE_OVERRIDE_DATA_NAME)),
            localStorageService.get(buildStorageKey(STREAMING_ONBOARDING_SETTINGS_LOCAL_STORAGE_SETTINGS_OVERRIDE_FLAG_NAME))
        );
        store.dispatch(setStreamingOnboardingSettings({ settings }));
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

export function translationSettingsFactory(appSettings: Settings): TranslationSettingsToken {
    return appSettings.country.toLowerCase() === 'ca'
        ? {
              canToggleLanguage: true,
              languagesSupported: ['en-CA', 'fr-CA'],
          }
        : { canToggleLanguage: false, languagesSupported: ['en-US'] };
}

export function getChatProviderFromSettingsService(appSettings: Settings) {
    return appSettings.chatProvider;
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot({ router: routerReducer }),
        StoreRouterConnectingModule.forRoot(),
        EffectsModule.forRoot([]),
        environment.production ? [] : StoreDevtoolsModule.instrument({ maxAge: 25 }),
        RouterModule.forRoot(
            [
                {
                    path: '',
                    resolve: {
                        environmentInfoLoaded: LoadEnvironmentInfoResolver,
                    },
                    children: [
                        {
                            path: 'setup-credentials',
                            loadChildren: () =>
                                import('@de-care/de-streaming-onboarding/feature-setup-credentials').then(
                                    (module) => module.DeStreamingOnboardingFeatureSetupCredentialsModule
                                ),
                        },
                        {
                            path: '',
                            pathMatch: 'full',
                            redirectTo: 'setup-credentials',
                        },
                    ],
                },
            ],
            { initialNavigation: 'enabledBlocking' }
        ),
        SharedSxmUiUiPageHeaderBasicModule,
        Angulartics2Module.forRoot({
            pageTracking: {
                excludedRoutes: ['setup-credentials'],
            },
        }),
        DomainsDataLayerStateTrackingModule,
        DomainsUtilityStateLogMessageModule,
        SharedStateSettingsModule,
        DeStreamingOnboardingStateSettingsModule,
        DomainsCustomerStateLocaleModule,
        DomainsUtilityStateEnvironmentInfoModule,
    ],
    providers: [
        { provide: DeCareEnvironmentToken, useValue: environment },
        { provide: AppSettings, useFactory: settingsInit, deps: [LocalStorageService, SettingsLoaderService] },
        { provide: MICROSERVICE_API_BASE_URL, useFactory: initMicroserviceApiBaseUrl, deps: [AppSettings] },
        { provide: NU_DETECT_SETTINGS, useFactory: nuDetectSettingsFactory, deps: [AppSettings] },
        {
            provide: APP_INITIALIZER,
            useFactory: appSettingsInit,
            deps: [Store, AppSettings],
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: streamingOnboardingSettingsInit,
            deps: [LocalStorageService, StreamingOnboardingSettingsLoaderService, Store],
            multi: true,
        },
        { provide: PLAYER_APP_TOKEN_CONFIG, useFactory: initPlayerAppTokenConfig, deps: [AppSettings] },
        { provide: TRANSLATION_SETTINGS, useFactory: translationSettingsFactory, deps: [AppSettings] },
        { provide: ChatProviderToken, useFactory: getChatProviderFromSettingsService, deps: [AppSettings] },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(translateService: TranslateService, dataTrackerService: DataTrackerService) {
        translateService.setDefaultLang('en-US');
        dataTrackerService.startTracking();
    }
}
