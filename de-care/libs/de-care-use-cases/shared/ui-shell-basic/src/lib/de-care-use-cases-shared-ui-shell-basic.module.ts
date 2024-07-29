import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainsCustomerStateLocaleModule } from '@de-care/domains/customer/state-locale';
import { SharedStateSettingsModule } from '@de-care/shared/state-settings';
import { SharedSxmUiUiPageHeaderBasicModule } from '@de-care/shared/sxm-ui/ui-page-header-basic';
import { ShellBasicComponent } from './shell-basic/shell-basic.component';
import { SharedSxmUiUiAppFooterModule } from '@de-care/shared/sxm-ui/ui-app-footer';
import { RouterModule } from '@angular/router';
import { ShellBasicWithLangToggleComponent } from './shell-basic-with-lang-toggle/shell-basic-with-lang-toggle.component';

const declarations = [ShellBasicComponent, ShellBasicWithLangToggleComponent];

@NgModule({
    imports: [CommonModule, RouterModule, SharedSxmUiUiAppFooterModule, SharedSxmUiUiPageHeaderBasicModule, SharedStateSettingsModule, DomainsCustomerStateLocaleModule],
    declarations: [...declarations],
    exports: [...declarations]
})
export class DeCareUseCasesSharedUiShellBasicModule {}
