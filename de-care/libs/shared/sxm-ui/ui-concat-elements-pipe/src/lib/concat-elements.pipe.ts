import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'concatElements', pure: true })
export class ConcatElementsPipe implements PipeTransform {
    transform(value: any): string {
        if (value === null || value === undefined) {
            return '';
        }
        return Object.keys(value)
            .map(key => value[key] || '')
            .join(' ');
    }
}
