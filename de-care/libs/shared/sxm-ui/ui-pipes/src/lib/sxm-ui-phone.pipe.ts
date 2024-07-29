import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { SxmLanguages, LANGUAGE_CODES } from '@de-care/shared/translation';
import { TranslateService } from '@ngx-translate/core';

const DEFAULT_LANG: SxmLanguages = 'en-US';

const SxmPhonePipeFormatMap = {
    [LANGUAGE_CODES.EN_US]: '$1-$2-$3',
    [LANGUAGE_CODES.EN_CA]: '$1-$2-$3',
    [LANGUAGE_CODES.FR_CA]: '$1 $2-$3',
};

@Pipe({
    name: 'sxmUiPhone',
    pure: false,
})
export class SxmUiPhonePipe implements PipeTransform {
    constructor(private readonly _translationService: TranslateService) {}

    transform(tel: string | number, parenthesis: boolean = true, lang: SxmLanguages = null): string {
        const normalized = tel.toString().replace(/\D/g, '');
        const match = normalized.match(/^(\d{3})(\d{3})(\d{4})$/);
        const langToUse = lang || this._translationService.currentLang || DEFAULT_LANG;
        if (match) {
            if (langToUse === 'en-US' && parenthesis) {
                return normalized.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else {
                return normalized.replace(/(\d{3})(\d{3})(\d{4})/, SxmPhonePipeFormatMap[langToUse]);
            }
        }
        return tel.toString();
    }
}

@NgModule({
    imports: [CommonModule],
    declarations: [SxmUiPhonePipe],
    exports: [SxmUiPhonePipe],
})
export class SharedSxmUiUiPhonePipeModule {}
