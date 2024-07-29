import { Pipe, PipeTransform } from '@angular/core';
import { getPlatformFromPackageName, PackagePlatformEnum } from '@de-care/domains/offers/state-offers';

@Pipe({ name: 'withoutPlatformNameWithArticle' })
export class WithoutPlatformNameWithArticlePipe implements PipeTransform {
    transform(value: string, packageName: string): any {
        if (!value || value.length === 0) {
            return value;
        }
        if (!packageName || packageName.length === 0) {
            return value;
        }

        const platform = getPlatformFromPackageName(packageName);
        const words = value.split(' ');
        const anArticleList = ['all', 'essential'];

        if (words[0].toLowerCase() === platform.toLowerCase() || words[0].toLowerCase() === PackagePlatformEnum.Siriusxm.toLowerCase()) {
            words.splice(0, 1);
        }

        if (anArticleList.includes(words[0].toLowerCase())) {
            return 'an ' + words.join(' ');
        }

        return 'a ' + words.join(' ');
    }
}
