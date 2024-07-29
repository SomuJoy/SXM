import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    pure: true,
    name: 'updatePriceAndTerm',
})
export class UpdatePriceAndTermPipe implements PipeTransform {
    transform(copyText: string, args: { price: string; termLength: string }) {
        if (copyText) {
            return copyText.replace(/{{amount}}/g, args.price).replace(/{{termLength}}/g, args.termLength);
        }
        return '';
    }
}
