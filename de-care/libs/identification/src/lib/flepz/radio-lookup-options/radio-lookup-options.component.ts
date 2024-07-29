import { Component, OnInit, Output, EventEmitter, OnChanges, Input, SimpleChanges } from '@angular/core';
import { buildAndJoinTranslation, initiateTranslationOverride, TranslationOverrides } from '@de-care/app-common';
import { TranslateService } from '@ngx-translate/core';
import * as uuid from 'uuid/v4';
// TODO: change this to not rely on verify device tabs enums
import { SettingsService } from '@de-care/settings';

export enum RadioLookupOptionsComponentValues {
    Radio = 'radio',
    Vin = 'vin',
    LicencePlate = 'licence_plate',
}
interface RadioButton {
    id: string;
    value: RadioLookupOptionsComponentValues;
    text: string;
    qatag: string;
    displayButton: boolean;
    ariaLabel?: string;
}

@Component({
    selector: 'radio-lookup-options',
    templateUrl: './radio-lookup-options.component.html',
    styleUrls: ['./radio-lookup-options.component.scss'],
})
export class RadioLookupOptionsComponent implements OnChanges, OnInit {
    @Input() translationOverrides: TranslationOverrides;
    @Input() nflOptInEnabled = false;
    // TODO: change this to not include the modal suffix as this component doesn't have any knowledge of the modal experience
    @Output() sentValue = new EventEmitter<RadioLookupOptionsComponentValues>();
    @Output() isNFLOptIn = new EventEmitter();

    groupId = uuid();
    selectedOption: RadioLookupOptionsComponentValues;
    // TODO: Move this into the template (no need for class field data to render this as it is not dynamic) and to be able to use translate
    radioButtons: RadioButton[] = [
        {
            id: uuid(),
            value: RadioLookupOptionsComponentValues.Radio,
            text: 'identification.lookupRadioIdComponent.RADIO_BUTTON_LABEL',
            qatag: 'CarInfoRadioIDRadioButton',
            displayButton: true,
        },
        {
            id: uuid(),
            value: RadioLookupOptionsComponentValues.Vin,
            text: 'identification.lookupVinComponent.VIN_BUTTON_LABEL',
            qatag: 'CarInfoVINRadioButton',
            displayButton: true,
            ariaLabel: 'identification.lookupVinComponent.VIN_BUTTON_ARIA_LABEL',
        },
        {
            id: uuid(),
            value: RadioLookupOptionsComponentValues.LicencePlate,
            text: 'identification.lookupLicensePlateComponent.LICENSE_PLATE_BUTTON_LABEL',
            qatag: 'CarInfoLicensePlateRadioButton',
            displayButton: this._settingsService.isCanadaMode ? false : true,
        },
    ];

    constructor(private _settingsService: SettingsService, private _translateService: TranslateService) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.translationOverrides && changes.translationOverrides.currentValue !== changes.translationOverrides.previousValue) {
            initiateTranslationOverride(this.translationOverrides).map((flatTranslation) =>
                flatTranslation
                    .map(buildAndJoinTranslation('identification', 'CarInfoTab'))
                    .forEach(({ locale, translation }) => this._translateService.setTranslation(locale, translation, true))
            );
        }
    }

    ngOnInit() {
        this.selectedOption = RadioLookupOptionsComponentValues.Radio;
    }

    displayModal() {
        this.sentValue.emit(this.selectedOption);
    }

    onVerifyAccountClick(value) {
        this.isNFLOptIn.emit(value?.nflForOptIn);
    }
}
