import { Pipe, PipeTransform } from '@angular/core';
import { BrandingTypes } from '@de-care/de-care-use-cases/trial-activation/state-sl2c';
import { TranslateService } from '@ngx-translate/core';
import { partnerInfoTranslationPrefix } from '@de-care/domains/partner/state-partner-info';

@Pipe({
    name: 'sl2cPartnerTextTranslationKey'
})
export class Sl2cPartnerTextTranslationKeyPipe implements PipeTransform {
    constructor(private readonly _translateService: TranslateService) {}

    transform(corpId: string, args: { brandingType: BrandingTypes; prefix?: string }): string {
        const partnerKey = `${partnerInfoTranslationPrefix}.${corpId}.NAME`;

        const partnerVal = this._translateService.instant(partnerKey);
        if (partnerVal === partnerKey) {
            return `${args?.prefix || ''}.${args?.brandingType || ''}.partnerText.NO_PARTNER`;
        }

        return `${args?.prefix || ''}.${args?.brandingType || ''}.partnerText.WITH_PARTNER`;
    }
}
