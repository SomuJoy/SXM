import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-mobile-app-cta',
    templateUrl: './mobile-app-cta.component.html',
    styleUrls: ['./mobile-app-cta.component.scss'],
})
export class SxmUiMobileAppCtaComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input() showAndroid = true;
    @Input() showIOS = true;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiMobileAppCtaComponent],
    exports: [SxmUiMobileAppCtaComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiDataClickTrackModule],
})
export class SharedSxmUiMobileAppCtaModule {}
