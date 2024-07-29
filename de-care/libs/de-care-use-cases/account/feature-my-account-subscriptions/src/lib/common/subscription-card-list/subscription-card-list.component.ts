import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { EditCreateSubscriptionsDataModel, ManageSubscriptionsDataModel, InactiveRadioModel } from '../../interface';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'my-account-subscription-card-list',
    templateUrl: './subscription-card-list.component.html',
    styleUrls: ['./subscription-card-list.component.scss'],
})
export class SubscriptionCardListComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input() subscriptionCards = [];
    @Input() title;
    @Input() description;
    @Input() subscriptionsExpanded = false;
    @Output() removeInactiveDevice = new EventEmitter();
    @Output() activateInactiveDevice = new EventEmitter<InactiveRadioModel>();
    @Output() manage = new EventEmitter<ManageSubscriptionsDataModel>();
    @Output() editOrCreateUsername = new EventEmitter<EditCreateSubscriptionsDataModel>();
    @Output() carAndStreaming = new EventEmitter();
    @Output() streaming = new EventEmitter();
    @Output() findSubscription = new EventEmitter();
    @Output() cancelInactiveDevice = new EventEmitter<string>();
    @Output() showAllSubscriptions = new EventEmitter<boolean>();
    @Output() openActivateSeasonalSuspendedSubscriptionModal = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }

    onShowAllSubscriptionsClicked(event: { clickCount: number; opened: boolean }) {
        this.showAllSubscriptions.emit(event.opened);
    }
}
