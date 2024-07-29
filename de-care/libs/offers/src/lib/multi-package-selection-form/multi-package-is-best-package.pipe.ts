import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'multiPackageIsBestPackage', pure: true })
export class MultiPackageIsBestPackage implements PipeTransform {
    transform(packageName: string, packagesType: string, bestPackages: string[]): boolean {
        return packagesType === 'eligiblePackages' && !!packageName && bestPackages && bestPackages.indexOf(packageName) > -1;
    }
}
