import { Pipe, PipeTransform } from '@angular/core';
//TODO: replace transform with a shared utility function.  One exists in the offers domain state-offers helper file
//TODO: may need to move this pipe file to another location
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
        } else if (words.includes('Streaming') || words.includes('ligne')) {
            //Adding special handling for Streaming as it always has SiriusXM
            words.splice(words.indexOf('SiriusXM'), 1);
        }

        return words.join(' ');
    }
}

function getPlatformFromPackageName(packageName: string): PackagePlatformEnum {
    if (packageName.startsWith('1_')) {
        return PackagePlatformEnum.Xm;
    } else if (packageName.startsWith('SXM_') || packageName.startsWith('3_') || packageName.startsWith('SiriusXM')) {
        return PackagePlatformEnum.Siriusxm;
    } else {
        return PackagePlatformEnum.Sirius;
    }
}

enum PackagePlatformEnum {
    Xm = 'XM',
    Siriusxm = 'SiriusXM',
    Sirius = 'SIRIUS',
}
