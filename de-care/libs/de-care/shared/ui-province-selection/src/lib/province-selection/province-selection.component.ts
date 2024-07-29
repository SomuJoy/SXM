import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PROVINCE_SELECTION, ProvinceSelection } from '../tokens';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'de-care-province-selection',
    templateUrl: './province-selection.component.html',
    styleUrls: ['./province-selection.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProvinceSelectionComponent implements OnDestroy {
    translateKeyPrefix = 'DeCareSharedUiProvinceSelectionModule.ProvinceSelectionComponent.';
    form: FormGroup;
    private _destroy$ = new Subject<boolean>();
    provinceSelectionModalAriaDescribedbyTextId = uuid();

    constructor(
        @Inject(PROVINCE_SELECTION) public readonly provinceSelection: ProvinceSelection,
        private readonly _translateService: TranslateService,
        private readonly _formBuilder: FormBuilder
    ) {
        this.form = this._formBuilder.group({
            province: '',
        });
        this.provinceSelection.selectedProvince$.pipe(takeUntil(this._destroy$)).subscribe((provinceKey) => {
            this.form.controls.province.setValue(provinceKey, { emitEvent: false });
        });
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    onProvinceSet({ province }: { province: string }) {
        this.provinceSelection.setSelectedProvince(province);
    }
}
