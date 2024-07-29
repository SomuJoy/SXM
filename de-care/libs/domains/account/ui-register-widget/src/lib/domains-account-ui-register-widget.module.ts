import { DomainsAccountStateRegisterWidgetModule } from '@de-care/domains/account/state-register-widget';
import { UiRegisterWidgetComponent } from './register-widget/register-widget.component';
import { DomainsAccountUiRegisterModule } from '@de-care/domains/account/ui-register';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainsAccountUiTwoFactorAuthModule } from '@de-care/domains/account/ui-two-factor-auth';
@NgModule({
    imports: [CommonModule, DomainsAccountUiRegisterModule, DomainsAccountStateRegisterWidgetModule, DomainsAccountUiTwoFactorAuthModule],
    declarations: [UiRegisterWidgetComponent],
    exports: [UiRegisterWidgetComponent]
})
export class DomainsAccountUiRegisterWidgetModule {}
