import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';

export interface NavLinks {
    url: string;
    text: string;
    altText: string;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-nav-with-user-presence',
    templateUrl: './nav-with-user-presence.component.html',
    styleUrls: ['./nav-with-user-presence.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiNavWithUserPresenceComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    @Input() name = '';
    @Input() accountNumber = '';
    @Input() links: NavLinks[] = [];
    @Input() activeLinkIndex = 0;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    imports: [CommonModule, TranslateModule.forChild()],
    declarations: [SxmUiNavWithUserPresenceComponent],
    exports: [SxmUiNavWithUserPresenceComponent],
})
export class SxmUiNavWithUserPresenceModule {}
