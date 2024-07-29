import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
    AppSettings,
    SettingsService,
    Settings,
    UserSettingsService,
    SettingsLoaderService,
    LOCAL_STORAGE_OVERRIDE_DATA_NAME,
    LOCAL_STORAGE_SETTINGS_OVERRIDE_FLAG_NAME,
    SharedStateSettingsModule,
    appSettingsLoaded,
} from '@de-care/settings';
import { TRANSLATION_SETTINGS, TranslationSettingsToken, CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { Angulartics2Module } from 'angulartics2';
import { LangPrefUrlHandlerModule, PackageDescriptionTranslationsService } from '@de-care/app-common';
import { registerLocaleData } from '@angular/common';
import { environment } from '../environments/environment';
import { OemHttpInterceptor, OEM_CHECKOUT_SEGMENT } from '@de-care/de-oem/util-route';
import { DataOfferService } from '@de-care/data-services';
import localeFrCa from '@angular/common/locales/fr-CA';
import localeFrCaExtra from '@angular/common/locales/extra/fr-CA';
import localeEnCa from '@angular/common/locales/en-CA';
import localeEnCaExtra from '@angular/common/locales/extra/en-CA';
import { LocalStorageService } from '@de-care/browser-common';
import { buildStorageKey } from './build-storage-key.function';
import { Store, StoreModule } from '@ngrx/store';
import { ChatProviderToken } from '@de-care/shared/configuration-tokens-chat';
import { DeCareEnvironmentToken } from '@de-care/de-care/shared/environment';
import { DataTrackerService } from '@de-care/shared/data-tracker';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { NU_DETECT_SETTINGS, NuDetectSettings } from '@de-care/shared/configuration-tokens-nudetect';
import { DomainsUtilityStateLogMessageModule } from '@de-care/domains/utility/state-log-message';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { BinRangesToken, CardBinRanges } from '@de-care/shared/validation';
import { LoadCardBinRangesWorkflowService } from '@de-care/domains/utility/state-card-bin-ranges';

const routes: Routes = [
    { path: '', redirectTo: OEM_CHECKOUT_SEGMENT, pathMatch: 'full' },
    {
        path: OEM_CHECKOUT_SEGMENT,
        loadChildren: () => import('@de-care/oem-common').then((m) => m.OemCommonModule),
    },
];

export function settingsInit(localStorageService: LocalStorageService, settingsLoaderService: SettingsLoaderService): Settings {
    const settings = settingsLoaderService.load(
        environment,
        localStorageService.get(buildStorageKey(LOCAL_STORAGE_OVERRIDE_DATA_NAME)),
        localStorageService.get(buildStorageKey(LOCAL_STORAGE_SETTINGS_OVERRIDE_FLAG_NAME))
    );
    settings.isOem = true; // Always set isOem to true in the settings for this app (does not need to come from dynamic configuration)
    return settings;
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

export function packageDescriptionTranslationsServiceFactory(dataOfferService: DataOfferService, settingsService: SettingsService) {
    const service = new PackageDescriptionTranslationsService(dataOfferService, settingsService);
    service.disableModuleLevelLoad();
    return service;
}

// TODO: Remove this in favor of loading bin ranges per feature as needed
export function binRangesInit(cardBinRanges: CardBinRanges, workflow: LoadCardBinRangesWorkflowService) {
    return () => {
        return workflow.build().subscribe((binRanges) => {
            cardBinRanges.binRanges = binRanges;
        });
    };
}

export function appSettingsInit(store: Store, appSettings: Settings) {
    return () => {
        store.dispatch(appSettingsLoaded({ settings: appSettings }));
    };
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

export function getChatProviderFromSettingsService(appSettings: Settings) {
    return appSettings.chatProvider;
}

registerLocaleData(localeFrCa, localeFrCaExtra);
registerLocaleData(localeEnCa, localeEnCaExtra);

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(routes),
        TranslateModule.forRoot(),
        LangPrefUrlHandlerModule.forRoot(),
        // TODO: Investigate whether or not this is needed here
        Angulartics2Module.forRoot({
            pageTracking: {
                excludedRoutes: ['checkout'],
            },
        }),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        StoreRouterConnectingModule.forRoot(),
        DomainsUtilityStateLogMessageModule,
        SharedStateSettingsModule,
    ],
    providers: [
        { provide: DeCareEnvironmentToken, useValue: environment },
        Title,
        { provide: AppSettings, useFactory: settingsInit, deps: [LocalStorageService, SettingsLoaderService] },
        { provide: MICROSERVICE_API_BASE_URL, useFactory: initMicroserviceApiBaseUrl, deps: [AppSettings] },
        { provide: NU_DETECT_SETTINGS, useFactory: nuDetectSettingsFactory, deps: [AppSettings] },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: OemHttpInterceptor,
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: binRangesInit,
            deps: [BinRangesToken, LoadCardBinRangesWorkflowService],
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: appSettingsInit,
            deps: [Store, AppSettings],
            multi: true,
        },
        { provide: TRANSLATION_SETTINGS, useFactory: translationSettingsFactory, deps: [SettingsService] },
        { provide: COUNTRY_SETTINGS, useFactory: countrySettingsFactory, deps: [SettingsService] },
        { provide: PackageDescriptionTranslationsService, useFactory: packageDescriptionTranslationsServiceFactory, deps: [DataOfferService, SettingsService] },
        { provide: ChatProviderToken, useFactory: getChatProviderFromSettingsService, deps: [AppSettings] },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(
        translateService: TranslateService,
        settingsService: SettingsService,
        private _userSettingsService: UserSettingsService,
        dataTrackerService: DataTrackerService
    ) {
        translateService.setDefaultLang('en-US');
        const langToUse = settingsService.isCanadaMode ? 'en-CA' : 'en-US';
        translateService.use(langToUse);
        this._userSettingsService.setDateFormatBasedOnLocale(langToUse);
        dataTrackerService.startTracking();
    }
}
