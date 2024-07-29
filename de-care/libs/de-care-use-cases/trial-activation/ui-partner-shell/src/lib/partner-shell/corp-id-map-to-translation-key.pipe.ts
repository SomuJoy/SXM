import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sl2cCorpIdMapToTranslationKey'
})
export class Sl2cCorpIdMapToTranslationKeyPipe implements PipeTransform {
    transform(corpId: string, args: { prefix?: string; suffix?: string }): string {
        if (corpId === undefined) {
            return `${args?.prefix}.CORP_ID_NOT_FOUND`;
        }
        return `${args?.prefix || ''}.${corpId}${args?.suffix || ''}`;
    }
}
