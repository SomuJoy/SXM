import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiModule } from '@de-care/sxm-ui';
import { RefreshSignalComponent } from './refresh-signal/refresh-signal.component';
import { ErrorMessageComponent } from './refresh-signal/error-message/error-message.component';
import { ActivateRadioComponent } from './refresh-signal/activate-radio/activate-radio.component';
import { SuccessMessageComponent } from './refresh-signal/success-message/success-message.component';
import { SharedSxmUiUiTabsModule } from '@de-care/shared/sxm-ui/ui-tabs';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomainsDeviceStateDeviceRefreshModule } from '@de-care/domains/device/state-device-refresh';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { StoreModule } from '@ngrx/store';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiIconCheckmarkModule } from '@de-care/shared/sxm-ui/ui-icon-checkmark';

const declarations = [RefreshSignalComponent, ErrorMessageComponent, ActivateRadioComponent, SuccessMessageComponent];

@NgModule({
    imports: [
        HttpClientModule,
        TranslateModule.forChild(),
        SxmUiModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        DomainsDeviceStateDeviceRefreshModule,
        SharedSxmUiUiTabsModule,
        StoreModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiIconCheckmarkModule,
    ],
    declarations,
    exports: [RefreshSignalComponent],
})
export class DomainsDeviceUiRefreshDeviceModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/refresh-device.en-CA.json'),
            'en-US': require('./i18n/refresh-device.en-US.json'),
            'fr-CA': require('./i18n/refresh-device.fr-CA.json'),
        };
        super(translateService, languages);
    }
}
