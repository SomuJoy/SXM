import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ComponentNameEnum, DataLayerDataTypeEnum } from '@de-care/data-services';
import { getProvince, getProvinceSelectionDisabled, getProvinceSelectionVisible } from '@de-care/domains/customer/state-locale';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import * as uuid from 'uuid/v4';

export interface LogoData {
    link: string;
    imageSrc: string;
    altText?: string;
}

@Component({
    selector: 'de-care-header-bar',
    templateUrl: './header-bar-canada.component.html',
    styleUrls: ['./header-bar-canada.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderBarCanadaComponent implements OnInit, OnDestroy {
    private readonly _destroy$: Subject<boolean> = new Subject<boolean>();

    @Input() logoData: LogoData;
    @Input() selectedProvince: string;
    @Input() provinces;
    @Output() languageSelected = new EventEmitter<string>();
    @Output() userChangedProvince = new EventEmitter();
    selectedProvinceLabel$ = this._store.pipe(select(getProvince));
    locationToggleModalOpen = false;
    languageAndProvinceChangeAllowed$ = this._store.pipe(select(getIsCanadaMode));
    languageAndProvinceChangeVisible$ = this._store.pipe(select(getProvinceSelectionVisible));
    provinceSelectionDisabled$ = this._store.pipe(select(getProvinceSelectionDisabled));
    headerBarCanadaModalAriaDescribedbyTextId = uuid();

    constructor(private readonly _store: Store) {}

    ngOnInit() {}

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    onUserChangedProvince(prov: string) {
        this.userChangedProvince.emit(prov);
        this.locationToggleModalOpen = false;
    }

    onModalClosed() {
        this.locationToggleModalOpen = false;
    }

    editButtonClicked() {
        this.locationToggleModalOpen = !this.locationToggleModalOpen;
        //Expose PageName to DataLayer
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: DataLayerDataTypeEnum.PageInfo, componentKey: ComponentNameEnum.LocationToggle }));
    }
}
