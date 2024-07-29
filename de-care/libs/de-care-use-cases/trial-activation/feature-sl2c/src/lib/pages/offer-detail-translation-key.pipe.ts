import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sl2cOfferDetailTranslateKey'
})
export class Sl2cOfferDetailTranslateKeyPipe implements PipeTransform {
    transform(prefix: string, args: { isQuebec: boolean; brandingType: string }): string {
        return `${prefix}.${args.brandingType}.OFFER_DETAILS.${args.isQuebec ? 'QUEBEC' : 'DEFAULT'}`;
    }
}
