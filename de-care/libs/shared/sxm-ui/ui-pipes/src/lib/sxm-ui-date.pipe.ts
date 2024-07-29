import { CommonModule, formatDate } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { LANGUAGE_CODES } from '@de-care/shared/translation';
import { TranslateService } from '@ngx-translate/core';

const DEFAULT_LANG = LANGUAGE_CODES.EN_US;

const SxmDatePipeFormatMap = {
    [LANGUAGE_CODES.EN_US]: 'MM/dd/y',
    [LANGUAGE_CODES.EN_CA]: 'MMMM d, y',
    [LANGUAGE_CODES.FR_CA]: 'd MMMM y',
};

@Pipe({
    name: 'sxmUiDate',
    pure: false,
})
export class SxmUiDatePipe implements PipeTransform {
    constructor(private readonly _translationService: TranslateService) {}

    transform(date: string | number | Date, format: string = null, lang: string = null): string {
        if (!date) {
            return;
        }
        const langToUse = lang || this._translationService.currentLang || DEFAULT_LANG;
        return formatDate(date, format || SxmDatePipeFormatMap[langToUse], langToUse);
    }
}

@NgModule({
    imports: [CommonModule],
    declarations: [SxmUiDatePipe],
    exports: [SxmUiDatePipe],
})
export class SharedSxmUiUiDatePipeModule {}
