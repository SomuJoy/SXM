import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { LANGUAGE_CODES } from '@de-care/shared/translation';

const DEFAULT_LANG = LANGUAGE_CODES.EN_US;

const SxmCurrencyPipeFormatMap = {
    [LANGUAGE_CODES.EN_US]: 'MM/dd/y',
    [LANGUAGE_CODES.EN_CA]: 'MMMM d, y',
    [LANGUAGE_CODES.FR_CA]: 'd MMMM y',
};

@Pipe({
    name: 'sxmDate',
})
export class SxmDatePipe implements PipeTransform {
    transform(date: string | number | Date, lang: string): string {
        const langToUse = lang || DEFAULT_LANG;
        return formatDate(date, SxmCurrencyPipeFormatMap[langToUse], langToUse);
    }
}
