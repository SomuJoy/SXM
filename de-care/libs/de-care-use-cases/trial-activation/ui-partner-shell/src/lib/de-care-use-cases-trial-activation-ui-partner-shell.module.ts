import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeCareUseCasesSharedUiHeaderBarModuleCanada } from '@de-care/de-care-use-cases/shared/ui-header-bar-canada';
import { DeCareUseCasesTrialActivationStateSl2cModule } from '@de-care/de-care-use-cases/trial-activation/state-sl2c';
import { DomainsSxmUiUiLogoLinkModule } from '@de-care/shared/sxm-ui/ui-logo-link';
import { SxmUiModule } from '@de-care/sxm-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Sl2cCorpIdMapToTranslationKeyPipe } from './partner-shell/corp-id-map-to-translation-key.pipe';
import { PartnerShellComponent } from './partner-shell/partner-shell.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([]),
        SxmUiModule,
        TranslateModule.forChild(),
        DeCareUseCasesSharedUiHeaderBarModuleCanada,
        DeCareUseCasesTrialActivationStateSl2cModule,
        DomainsSxmUiUiLogoLinkModule
    ],
    declarations: [PartnerShellComponent, Sl2cCorpIdMapToTranslationKeyPipe],
    exports: [PartnerShellComponent]
})
export class DeCareUseCasesTrialActivationUiPartnerShellModule {
    constructor(private _translateService: TranslateService) {
        [
            { lang: 'en-CA', resource: require('./i18n/partner-shell.en-CA.json') },
            { lang: 'en-US', resource: require('./i18n/partner-shell.en-US.json') },
            { lang: 'fr-CA', resource: require('./i18n/partner-shell.fr-CA.json') }
        ].forEach(res => this._translateService.setTranslation(res.lang, res.resource, true));
    }
}
