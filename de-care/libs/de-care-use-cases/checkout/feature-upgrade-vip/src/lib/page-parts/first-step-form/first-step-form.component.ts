import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Device, DeviceType, Streaming } from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import { VehicleModel } from '@de-care/domains/vehicle/ui-vehicle-info';
import { LANGUAGE_CODES } from '@de-care/shared/translation';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
export interface FirstStepFormData {
    firstName: string;
    currentVehicle: VehicleModel;
    currentRadioId: string;
    currentPackageName: string;
    secondVehicles: Device[];
    isFirstRadioTrial: boolean;
    streamingAccounts: Streaming[];
}
@Component({
    selector: 'de-care-first-step-form',
    templateUrl: './first-step-form.component.html',
    styleUrls: ['./first-step-form.component.scss'],
})
export class FirstStepFormComponent {
    @Input() data: FirstStepFormData;
    @Input() enablePVIPStreamingFlag: boolean;
    @Output() continue = new EventEmitter<DeviceType>();
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeVipModule.FirstStepComponent.';
    currentLang$ = this._translateService.onLangChange.pipe(map((ev) => ev.lang));
    currentLangIsFrench$ = this._translateService.onLangChange.pipe(map((ev) => ev?.lang === LANGUAGE_CODES.FR_CA));

    constructor(private readonly _translateService: TranslateService) {}
}
