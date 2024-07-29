import { Pipe, PipeTransform } from '@angular/core';
import { getPlatformFromPackageName, PackagePlatformEnum } from '@de-care/domains/offers/state-offers';

@Pipe({ name: 'withoutPlatformNameStreaming' })
export class WithoutPlatformNameStreamingPipe implements PipeTransform {
    transform(value: string, packageName: string): any {
        if (!value || value.length === 0) {
            return value;
        }
        if (!packageName || packageName.length === 0) {
            return value;
        }

        const platform = getPlatformFromPackageName(packageName);
        const words = value.split(' ');
        const isSXM = words.findIndex((p: string) => p.toLowerCase() === PackagePlatformEnum.Siriusxm.toLowerCase());
        const isPlatform = words.findIndex((p: string) => p.toLowerCase() === platform.toLowerCase());

        if (isSXM >= 0) {
            words.splice(isSXM, 1);
        } else if (isPlatform >= 0) {
            words.splice(isPlatform, 1);
        }

        return words.join(' ');
    }
}
