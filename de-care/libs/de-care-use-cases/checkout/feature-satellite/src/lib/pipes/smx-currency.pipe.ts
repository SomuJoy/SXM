import { formatCurrency } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { LANGUAGE_CODES } from '@de-care/shared/translation';

const DEFAULT_LANG = LANGUAGE_CODES.EN_US;

@Pipe({
    name: 'sxmCurrency',
})
export class SxmCurrencyPipe implements PipeTransform {
    transform(num: number, lang: string): string {
        return formatCurrency(num, lang || DEFAULT_LANG, '$', 'USD', Number.isInteger(num) ? '1.0' : '1.2-2');
    }
}
