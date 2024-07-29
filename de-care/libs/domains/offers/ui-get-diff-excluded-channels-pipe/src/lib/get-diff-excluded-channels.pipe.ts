import { Pipe, PipeTransform } from '@angular/core';
import { getDiffExcludedChannels } from '@de-care/domains/offers/state-package-descriptions';

@Pipe({ name: 'getDiffExcludedChannels', pure: true })
export class GetDiffExcludedChannelsPipe implements PipeTransform {
    constructor() {}

    transform(packageTranslations: any, packaNameToLookup: string) {
        return getDiffExcludedChannels(packageTranslations, packaNameToLookup);
    }
}
