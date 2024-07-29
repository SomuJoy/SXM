import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';

interface DataModel {
    plan: string;
    price: string;
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-upgrade-subscription-single-action',
    templateUrl: './upgrade-subscription-single-action.component.html',
    styleUrls: ['./upgrade-subscription-single-action.component.scss'],
})
export class SxmUiUpgradeSubscriptionSingleActionComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @Input() data: DataModel;
    @Output() upgradePlan = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiUpgradeSubscriptionSingleActionComponent],
    exports: [SxmUiUpgradeSubscriptionSingleActionComponent],
    imports: [CommonModule, TranslateModule.forChild()],
})
export class SharedSxmUiSubscriptionsUiUpgradeSubscriptionSingleActionModule {}
