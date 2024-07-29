import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    pure: true,
    name: 'planComparisionGridTooltipLinkId'
})
export class PlanComparisonGridTooltipLinkIdPipe implements PipeTransform {
    transform(featureName: string, packageType: string) {
        if (featureName) {
            const normalizedFeatureName = featureName.replace(/<sup>\s?&reg;\s?<\/sup>/g, '®');
            return `${packageType} | ${normalizedFeatureName} tooltip`;
        }
        return '';
    }
}
