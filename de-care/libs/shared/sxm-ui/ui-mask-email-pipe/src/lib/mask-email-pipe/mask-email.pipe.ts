import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'maskEmail',
})
export class MaskEmailPipe implements PipeTransform {
    transform(email: string, length: number = 1) {
        const letterArray = email?.split('');
        const emailString = letterArray?.splice(letterArray.indexOf('@'), letterArray.length).join('');
        return letterArray ? `${letterArray.slice(0, length).join('')}*****${emailString}` : null;
    }
}
