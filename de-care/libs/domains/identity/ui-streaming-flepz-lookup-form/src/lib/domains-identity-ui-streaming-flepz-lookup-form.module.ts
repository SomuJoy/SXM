import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamingFlepzLookupFormComponent } from './streaming-flepz-lookup-form/streaming-flepz-lookup-form.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiFlepzFormFieldsModule } from '@de-care/shared/sxm-ui/ui-flepz-form-fields';
import { DomainsIdentityStateStreamingFlepzLookupModule } from '@de-care/domains/identity/state-streaming-flepz-lookup';
import { StreamingFlepzLookupComponent } from './page-parts/streaming-flepz-lookup/streaming-flepz-lookup.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        ReactiveFormsModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiFlepzFormFieldsModule,
        SharedSxmUiUiProceedButtonModule,
        DomainsIdentityStateStreamingFlepzLookupModule,
    ],
    declarations: [StreamingFlepzLookupFormComponent, StreamingFlepzLookupComponent],
    exports: [StreamingFlepzLookupFormComponent, StreamingFlepzLookupComponent],
})
export class DomainsIdentityUiStreamingFlepzLookupFormModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };

        super(translateService, languages);
    }
}
