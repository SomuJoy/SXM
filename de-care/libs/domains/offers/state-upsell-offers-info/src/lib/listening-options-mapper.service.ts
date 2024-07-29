import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { normalizeLocaleToLang } from '../helpers';

export type ListeningOn = 'Satellite' | 'Streaming' | 'Pandora';

@Injectable({ providedIn: 'root' })
export class ListeningOptionsMapperService {
    private _translateKeyPrefix = 'DomainsOffersStateUpsellOffersInfoModule';

    constructor(private readonly _translateService: TranslateService) {}

    mapListeningOptionsToTextCopy(listenOn: ListeningOn[], locale: string) {
        if (Array.isArray(listenOn)) {
            const fixedLocale = normalizeLocaleToLang(locale);
            const translationsForLocale = this._translateService.store.translations[fixedLocale]?.[this._translateKeyPrefix];
            return {
                inside: {
                    isActive: listenOn.indexOf('Satellite') !== -1,
                    label: translationsForLocale?.SATELLITE,
                },
                outside: {
                    isActive: listenOn.indexOf('Streaming') !== -1,
                    label: translationsForLocale?.STREAMING,
                },
                pandora: { isActive: listenOn.indexOf('Pandora') !== -1, label: translationsForLocale?.PANDORA },
            };
        } else {
            return null;
        }
    }
}
