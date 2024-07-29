import { Pipe, PipeTransform } from '@angular/core';
import { BrandingTypes } from '@de-care/de-care-use-cases/trial-activation/state-sl2c';
import { partnerInfoTranslationPrefix } from '@de-care/domains/partner/state-partner-info';

@Pipe({
    name: 'sl2cPartnerNameTranslationKey'
})
export class Sl2cPartnerNameTranslationKeyPipe implements PipeTransform {
    transform(corpId: string, args: { brandingType: BrandingTypes; prefix?: string }): string {
        return `${partnerInfoTranslationPrefix}.${corpId}.NAME`;
    }
}
