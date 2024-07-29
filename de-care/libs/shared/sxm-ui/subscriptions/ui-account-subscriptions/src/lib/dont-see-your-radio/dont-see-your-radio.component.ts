import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiIconSubscriptionUnavailableModule } from '@de-care/shared/sxm-ui/ui-icon-subscription-unavailable';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-dont-see-your-radio',
    templateUrl: './dont-see-your-radio.component.html',
    styleUrls: ['./dont-see-your-radio.component.scss'],
})
export class SxmUiUpgradeSubscriptionDontSeeYourRadioComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;

    @Output() findSubscription = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiUpgradeSubscriptionDontSeeYourRadioComponent],
    exports: [SxmUiUpgradeSubscriptionDontSeeYourRadioComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiIconSubscriptionUnavailableModule],
})
export class SharedSxmUiSubscriptionsUiDontSeeYourRadioModule {}
