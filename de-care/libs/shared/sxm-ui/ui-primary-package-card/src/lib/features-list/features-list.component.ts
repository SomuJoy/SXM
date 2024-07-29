import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
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
    selector: 'sxm-ui-features-list',
    styleUrls: ['./features-list.component.scss'],
    templateUrl: './features-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiFeaturesListComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input() data: {
        planName?: string;
        features: string[];
    };

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiFeaturesListComponent],
    exports: [SxmUiFeaturesListComponent],
    imports: [CommonModule, TranslateModule.forChild()],
})
export class SxmUiFeaturesListComponentModule {}
