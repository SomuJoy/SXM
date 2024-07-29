import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiIconCheckmarkModule } from '@de-care/shared/sxm-ui/ui-icon-checkmark';

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
})
export class PaymentInterstitialInfoComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [PaymentInterstitialInfoComponent],
    exports: [PaymentInterstitialInfoComponent],
    imports: [CommonModule, TranslateModule, SharedSxmUiUiIconCheckmarkModule],
})
export class PaymentInterstitialInfoComponentModule {}
