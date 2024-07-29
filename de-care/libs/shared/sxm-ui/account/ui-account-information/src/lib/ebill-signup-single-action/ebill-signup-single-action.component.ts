import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-ebill-signup-single-action',
    templateUrl: './ebill-signup-single-action.component.html',
    styleUrls: ['./ebill-signup-single-action.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiEBillSignupSingleActionComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Output() signUpEBill = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiEBillSignupSingleActionComponent],
    exports: [SxmUiEBillSignupSingleActionComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiDataClickTrackModule],
})
export class SharedSxmUiEBillSignupSingleActionComponentModule {}
