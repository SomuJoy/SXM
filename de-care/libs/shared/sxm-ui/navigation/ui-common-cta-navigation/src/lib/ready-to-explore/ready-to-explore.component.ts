import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
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
    selector: 'sxm-ui-ready-to-explore',
    templateUrl: './ready-to-explore.component.html',
    styleUrls: ['./ready-to-explore.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiReadyToExploreComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiReadyToExploreComponent],
    exports: [SxmUiReadyToExploreComponent],
    imports: [CommonModule, TranslateModule.forChild()],
})
export class SxmUiReadyToExploreComponentModule {}
