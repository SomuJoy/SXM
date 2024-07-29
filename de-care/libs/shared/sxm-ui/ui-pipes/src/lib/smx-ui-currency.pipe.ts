import { CommonModule, formatCurrency } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { LANGUAGE_CODES } from '@de-care/shared/translation';
import { TranslateService } from '@ngx-translate/core';

const DEFAULT_LANG = LANGUAGE_CODES.EN_US;

@Pipe({
    name: 'sxmUiCurrency',
    pure: false,
})
export class SxmUiCurrencyPipe implements PipeTransform {
    constructor(private readonly _translationService: TranslateService) {}
    transform(num: number | string, lang: string = null, forceDecimals = false): string {
        const langToUse = lang || this._translationService.currentLang || DEFAULT_LANG;
        const parsedNumber = parseFloat(num.toString());
        return formatCurrency(parsedNumber, langToUse, '$', 'USD', Number.isInteger(parsedNumber) && !forceDecimals ? '1.0' : '1.2-2');
    }
}

@NgModule({
    imports: [CommonModule],
    declarations: [SxmUiCurrencyPipe],
    exports: [SxmUiCurrencyPipe],
})
export class SharedSxmUiCurrencyPipeModule {}
