import { ModuleWithProviders, NgModule } from '@angular/core';
import { LangPrefRouteInterceptorService } from './lang-pref-route-interceptor.service';
import { SettingsService } from '@de-care/settings';

@NgModule({})
export class LangPrefUrlHandlerModule {
    constructor(langPrefRouteInterceptorService: LangPrefRouteInterceptorService, settingsService: SettingsService) {
        if (settingsService.multiLanguageSupportEnabled) {
            langPrefRouteInterceptorService.langPref$.subscribe();
        }
    }

    static forRoot(): ModuleWithProviders<LangPrefUrlHandlerModule> {
        return {
            ngModule: LangPrefUrlHandlerModule,
            providers: [LangPrefRouteInterceptorService]
        };
    }
}
