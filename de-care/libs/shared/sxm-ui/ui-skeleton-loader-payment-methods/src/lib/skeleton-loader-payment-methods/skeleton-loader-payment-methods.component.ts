import { Component, ChangeDetectionStrategy } from '@angular/core';
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
    selector: 'sxm-ui-skeleton-loader-payment-methods',
    template: `
        <div class="gradient-animation"></div>
        <article>
            <p>{{ translateKeyPrefix + '.TITLE' | translate }}</p>
            <div class="skeleton-radio-input">
                <input type="radio" name="option" disabled="disabled" />
                <span></span>
            </div>
            <div class="skeleton-radio-input">
                <input type="radio" name="option" disabled="disabled" />
                <span></span>
            </div>
            <div></div>
        </article>
    `,
    styleUrls: ['./skeleton-loader-payment-methods.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [TranslateModule],
})
export class SxmUiSkeletonLoaderPaymentMethodsComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}
