import { Pipe, PipeTransform } from '@angular/core';
import { getPlatformFromPackageName } from '@de-care/data-services';

@Pipe({ name: 'withoutPlatformName' })
export class WithoutPlatformNamePipe implements PipeTransform {
    transform(value: string, packageName: string): any {
        if (!value || value.length === 0) {
            return value;
        }
        if (!packageName || packageName.length === 0) {
            return value;
        }

        const platform = getPlatformFromPackageName(packageName);
        const words = value.split(' ');

        if (words[0].toLowerCase() === platform.toLowerCase()) {
            words.splice(0, 1);
        }

        return words.join(' ');
    }
}
