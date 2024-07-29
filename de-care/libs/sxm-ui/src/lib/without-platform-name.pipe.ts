import { Pipe, PipeTransform } from '@angular/core';
import { getPlatformFromPackageName } from '@de-care/domains/offers/state-offers';

/**
 * @deprecated use @de-care/shared/sxm-ui/ui-without-platform-name-pipe
 */
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
        const hasPlatform = words.findIndex((p: string) => p.toLowerCase() === platform.toLowerCase());
        const hasPlatformFr = words.findIndex((p: string) => p.toLowerCase() === 'de');

        if (hasPlatform >= 0) {
            words.splice(hasPlatform, 1);
            if (hasPlatformFr >= 0) {
                words.splice(hasPlatformFr, 1);
            }
        }

        return words.join(' ');
    }
}
