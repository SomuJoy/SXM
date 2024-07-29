import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedSxmUiUiIconCheckmarkModule } from '@de-care/shared/sxm-ui/ui-icon-checkmark';
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
    selector: 'de-care-payment-interstitial-info',
    templateUrl: './payment-interstitial-info.component.html',
    styleUrls: ['./payment-interstitial-info.component.scss'],
    standalone: true,
    imports: [CommonModule, TranslateModule, SharedSxmUiUiIconCheckmarkModule],
})
export class PaymentInterstitialInfoComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}
