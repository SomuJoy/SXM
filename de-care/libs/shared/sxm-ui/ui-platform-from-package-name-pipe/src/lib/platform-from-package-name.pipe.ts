import { Pipe, PipeTransform } from '@angular/core';
import { getPlatformFromPackageName } from '@de-care/data-services';

@Pipe({ name: 'platformFromPackageName', pure: true })
export class PlatformFromPackageNamePipe implements PipeTransform {
    transform(packaName: string): string {
        if (packaName) {
            return getPlatformFromPackageName(packaName);
        }
        return '';
    }
}
