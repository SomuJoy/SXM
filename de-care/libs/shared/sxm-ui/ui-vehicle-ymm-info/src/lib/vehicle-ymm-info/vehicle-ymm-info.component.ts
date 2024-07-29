import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Input } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-vehicle-ymm-info',
    templateUrl: './vehicle-ymm-info.component.html',
    styleUrls: ['./vehicle-ymm-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiVehicleYmmInfoComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    @Input() vehicleInfoVM;
    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}
@NgModule({
    declarations: [SxmUiVehicleYmmInfoComponent],
    exports: [SxmUiVehicleYmmInfoComponent],
    imports: [CommonModule, TranslateModule.forChild()],
})
export class SxmUiVehicleYmmInfoComponentModule {}
