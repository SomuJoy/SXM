import { CommonModule } from '@angular/common';
import { Component, Inject, NgModule } from '@angular/core';
import { DOT_COM_URL } from '@de-care/shared/configuration-tokens-dot-com';
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
    selector: 'sxm-ui-pvip-subscription-includes',
    templateUrl: './pvip-subscription-includes.component.html',
    styleUrls: ['./pvip-subscription-includes.component.scss'],
})
export class SxmUiPvipSubscriptionIncludesComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;

    constructor(readonly translationsForComponentService: TranslationsForComponentService, @Inject(DOT_COM_URL) public readonly _dotComBaseUrl: string) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiPvipSubscriptionIncludesComponent],
    exports: [SxmUiPvipSubscriptionIncludesComponent],
    imports: [CommonModule, TranslateModule.forChild()],
})
export class SharedSxmUiPvipSubscriptionIncludesModule {}
