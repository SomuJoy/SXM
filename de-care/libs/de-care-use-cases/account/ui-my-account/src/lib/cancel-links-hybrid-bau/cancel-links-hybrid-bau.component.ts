import { Component, Input } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';

// This component is a stop gap measure meant to show the cancel modal as it appears in BAU.  The fully redesigned modal will actaully be handled in the cancel flow itself.
// The dashboard will show this component until the one in the cancel flow is developed, then this component should be deleted.

type linkType = 'CANCEL' | 'CANCEL_NO_OFFER' | 'CHAT_CANCEL' | 'TRANSFER' | 'CHAT' | 'CALL';
interface DataModel {
    types: linkType[];
    subscriptionId: string;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'my-account-cancel-links-hybrid-bau',
    templateUrl: './cancel-links-hybrid-bau.component.html',
    styleUrls: ['./cancel-links-hybrid-bau.component.scss'],
})
export class CancelLinksHybridBauComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @Input() data: DataModel;
    @Input() allowOnlyCancelOnline = false;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}
