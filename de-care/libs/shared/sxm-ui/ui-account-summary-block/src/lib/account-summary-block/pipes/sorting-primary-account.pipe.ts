import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sortingSubscriptionsPipe',
})
export class SortingSubscriptionsPipe implements PipeTransform {
    transform(subscriptions: any) {
        let sortData = [...subscriptions];
        let isData = false;
        sortData.sort((x, y) => (x.isPrimary === y.isPrimary ? 0 : x.isPrimary ? -1 : 1));
        sortData = sortData.map((x) => ({ ...x, isShowResetCTA: false }));
        sortData.forEach((element, index) => {
            isData = false;
            if (index === 0 && element.isDataOnly) {
                isData = true;
            }
            if (isData) {
                element.isShowResetCTA = true;
            }
        });
        return sortData;
    }
}
