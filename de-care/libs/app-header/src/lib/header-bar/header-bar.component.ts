import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ProvinceSelectorComponent } from '../province-selector/province-selector.component';
import { DataLayerService } from '@de-care/data-layer';
import { DataLayerDataTypeEnum, ComponentNameEnum, FlowNameEnum } from '@de-care/data-services';
import * as uuid from 'uuid/v4';

export interface LogoData {
    url: string;
    imageSrcUrl: string;
}

@Component({
    selector: 'header-bar',
    templateUrl: './header-bar.component.html',
    styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit, OnDestroy {
    private _destroy$: Subject<boolean> = new Subject<boolean>();

    @Input() logoData: LogoData;
    @Input() selectedProvince: string;
    @Output() languageSelected = new EventEmitter<string>();
    @Output() userChangedProvince = new EventEmitter();
    @ViewChild('provinceSelector') private _provinceSelectorComponent: ProvinceSelectorComponent;
    selectedProvinceLabel: string;
    locationToggleModalOpen = false;
    languageAndProvinceChangeAllowed = false;
    languageAndProvinceChangeVisible$: Observable<boolean>;
    headerBarModalAriaDescribedbyTextId = uuid();

    constructor(private _settingsService: SettingsService, public userSettingsService: UserSettingsService, private _dataLayerSrv: DataLayerService) {}

    ngOnInit(): void {
        this.languageAndProvinceChangeAllowed = this._settingsService.isCanadaMode;
        this.languageAndProvinceChangeVisible$ = this.userSettingsService.provinceSelectionVisible$.pipe(
            takeUntil(this._destroy$),
            map(provinceSelectionVisible => this._settingsService.isCanadaMode && provinceSelectionVisible)
        );
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    onSelectProvince(provinceLabel: string): void {
        this.selectedProvinceLabel = provinceLabel;
        this.locationToggleModalOpen = false;
    }

    onUserChangedProvince() {
        this.userChangedProvince.emit();
    }

    onModalClosed() {
        this.locationToggleModalOpen = false;
    }

    editButtonClicked() {
        this.locationToggleModalOpen = !this.locationToggleModalOpen;
        //Expose PageName to DataLayer
        this._dataLayerSrv.updateAndSendPageTrackEvent(DataLayerDataTypeEnum.PageInfo, ComponentNameEnum.LocationToggle, {
            flowName: FlowNameEnum.Checkout,
            componentName: ComponentNameEnum.LocationToggle
        });
    }
}
