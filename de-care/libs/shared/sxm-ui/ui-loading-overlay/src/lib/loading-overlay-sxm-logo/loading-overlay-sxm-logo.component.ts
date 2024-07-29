import { Component, HostBinding } from '@angular/core';
import { SharedSxmUiUiIconLogoAnimatedModule } from '@de-care/shared/sxm-ui/ui-icon-logo-animated';
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
    selector: 'sxm-ui-loading-overlay-sxm-logo',
    template: `<mat-icon svgIcon="logo-animated" [attr.aria-valuetext]="translateKeyPrefix + '.ARIA_LOADING_TEXT' | translate" aria-busy="true"></mat-icon>`,
    styles: [
        `
            :host {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 2147483638;
                background-color: white;
                width: 100vw;
                height: 100vh;
            }
            mat-icon {
                width: 300px;
                height: 60px;
                position: absolute;
                margin: auto;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
            }
        `,
    ],
    standalone: true,
    imports: [SharedSxmUiUiIconLogoAnimatedModule, TranslateModule],
})
export class SxmUiLoadingOverlaySxmLogoComponent implements ComponentWithLocale {
    @HostBinding('class.sxm-loader') sxmLoaderClass = true;
    @HostBinding('attr.id') id = 'loading-overlay-sxm-loader';

    translateKeyPrefix: string;
    languageResources: LanguageResources;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}
