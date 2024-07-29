import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeCareUseCasesSharedUiHeaderBarModule } from '@de-care/de-care-use-cases/shared/ui-header-bar';
import { SxmUiModule } from '@de-care/sxm-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ShellWithAccountNumberComponent } from './shell-with-account-number/shell-with-account-number.component';
import { ShellComponent } from './shell/shell.component';

@NgModule({
    imports: [CommonModule, RouterModule.forChild([]), SxmUiModule, TranslateModule.forChild(), DeCareUseCasesSharedUiHeaderBarModule],
    declarations: [ShellComponent, ShellWithAccountNumberComponent],
    exports: [ShellComponent, ShellWithAccountNumberComponent, RouterModule, SxmUiModule]
})
export class DeCareUseCasesSharedUiShellModule {
    constructor(private _translateService: TranslateService) {
        [
            { lang: 'en-CA', resource: require('./i18n/shell.en-CA.json') },
            { lang: 'en-US', resource: require('./i18n/shell.en-US.json') },
            { lang: 'fr-CA', resource: require('./i18n/shell.fr-CA.json') }
        ].forEach(res => this._translateService.setTranslation(res.lang, res.resource, true));
    }
}
