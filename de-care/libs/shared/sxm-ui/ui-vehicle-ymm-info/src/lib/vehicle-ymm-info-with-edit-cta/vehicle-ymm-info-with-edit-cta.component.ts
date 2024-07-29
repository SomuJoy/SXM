import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SxmUiVehicleYmmInfoComponentModule } from '../vehicle-ymm-info/vehicle-ymm-info.component';
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-vehicle-ymm-info-with-edit-cta',
    templateUrl: './vehicle-ymm-info-with-edit-cta.component.html',
    styleUrls: ['./vehicle-ymm-info-with-edit-cta.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiVehicleYmmInfoWithEditCtaComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    @Input() vehicleInfoVM;
    @Input() useSelectYourRadioUrlForDeviceEdit;
    @Output() editButton = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private _router: Router) {
        translationsForComponentService.init(this);
    }
    redirectByeditRouterUrl() {
        this.editButton.emit(this.useSelectYourRadioUrlForDeviceEdit);
    }
}

@NgModule({
    declarations: [SxmUiVehicleYmmInfoWithEditCtaComponent],
    exports: [SxmUiVehicleYmmInfoWithEditCtaComponent],
    imports: [CommonModule, SxmUiVehicleYmmInfoComponentModule, TranslateModule.forChild()],
})
export class SxmUiVehicleYmmInfoWithEditCtaComponentModule {}
