import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'removeSiriusXmPrefix' })
export class RemoveSiriusXmPrefixPipe implements PipeTransform {
    transform(name: string): any {
        return name ? name.replace('SiriusXM ', '') : null;
    }
}
