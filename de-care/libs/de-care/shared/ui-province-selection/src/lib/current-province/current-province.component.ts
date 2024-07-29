import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { PROVINCE_SELECTION, ProvinceSelection } from '../tokens';

@Component({
    selector: 'de-care-current-province',
    template: `{{ translateKeyPrefix + 'PROVINCE_LABEL_TEXT' | translate }}{{ selectedProvinceText$ | async }}`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentProvinceComponent {
    translateKeyPrefix = 'DeCareSharedUiProvinceSelectionModule.CurrentProvinceComponent.';
    selectedProvinceText$ = combineLatest([
        this._translateService.stream('DeCareSharedUiProvinceSelectionModule.COMMON.PROVINCES'),
        this.provinceSelection.selectedProvince$,
    ]).pipe(
        map(
            ([provinces, selectedProvinceKey]) =>
                provinces?.find((province: { key: string; label: string }) => province.key.toLowerCase() === selectedProvinceKey?.toLowerCase())?.label
        )
    );

    constructor(@Inject(PROVINCE_SELECTION) public readonly provinceSelection: ProvinceSelection, private readonly _translateService: TranslateService) {}
}
