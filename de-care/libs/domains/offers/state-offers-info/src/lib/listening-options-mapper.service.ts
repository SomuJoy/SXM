import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type ListeningOn = 'Satellite' | 'Streaming' | 'Pandora' | 'Perks';

@Injectable({ providedIn: 'root' })
export class ListeningOptionsMapperService {
    private _translateKeyPrefix = 'DomainsOffersStateOffersInfoModule';

    constructor(private readonly _translateService: TranslateService) {}

    mapListeningOptionsToTextCopy(listenOn: ListeningOn[], locale: string) {
        if (Array.isArray(listenOn)) {
            const translationsForLocale = this._translateService.store.translations[locale.replace('_', '-')]?.[this._translateKeyPrefix];
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
                perks: { isActive: listenOn.indexOf('Perks') !== -1, label: translationsForLocale?.PERKS },
            };
        } else {
            return null;
        }
    }
}
