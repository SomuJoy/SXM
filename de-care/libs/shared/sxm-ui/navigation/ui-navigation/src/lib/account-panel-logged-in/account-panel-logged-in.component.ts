import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input, NgModule } from '@angular/core';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { getPlatform } from '../helper';
import { SharedSxmUiMobileAppCtaModule } from '../mobile-app-cta/mobile-app-cta.component';

interface DataModel {
    firstName: string;
    careUrl: string;
    oacUrl: string;
    dotComUrl: string;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-account-panel-logged-in',
    templateUrl: './account-panel-logged-in.component.html',
    styleUrls: ['./account-panel-logged-in.component.scss'],
})
export class SxmUiAccountPanelLoggedInComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    @Input() data: DataModel;

    @Output() logout = new EventEmitter();
    @Output() closed = new EventEmitter();

    platform: string;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
        this.platform = getPlatform();
    }
}

@NgModule({
    declarations: [SxmUiAccountPanelLoggedInComponent],
    exports: [SxmUiAccountPanelLoggedInComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiMobileAppCtaModule, SharedSxmUiUiDataClickTrackModule],
})
export class SharedSxmUiAccountPanelLoggedInModule {}
