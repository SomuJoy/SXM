import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { SharedSxmUiUiLoadingWithAlertMessageModule } from '@de-care/shared/sxm-ui/ui-loading-with-alert-message';
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
    selector: 'fallback-alert',
    template: `
        <sxm-ui-loading-with-alert-message
            *ngIf="displayLoader"
            [isLoading]="true"
            [pillMessage]="translateKeyPrefix + '.FALLBACK_MESSAGES.' + fallbackMessageKeyPrefix + '.ALERT' | translate"
            [paragraph]="translateKeyPrefix + '.FALLBACK_MESSAGES.' + fallbackMessageKeyPrefix + '.BODY' | translate"
        ></sxm-ui-loading-with-alert-message>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FallbackAlertComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    fallbackMessageKeyPrefix = 'DEFAULT';
    @Input() displayLoader = false;
    @Input() set fallbackReason(reason: 'EXPIRED' | 'DEFAULT') {
        this.fallbackMessageKeyPrefix = reason === 'EXPIRED' ? 'EXPIRED' : 'DEFAULT';
    }

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [FallbackAlertComponent],
    exports: [FallbackAlertComponent],
    imports: [CommonModule, TranslateModule, SharedSxmUiUiLoadingWithAlertMessageModule],
})
export class FallbackAlertComponentModule {}
