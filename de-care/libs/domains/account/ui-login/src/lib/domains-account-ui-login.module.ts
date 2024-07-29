import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LoginFormComponent } from './login-form/login-form.component';
import { SharedSxmUiUiLoadingIndicatorModule } from '@de-care/shared/sxm-ui/ui-loading-indicator';
import { SharedSxmUiUiNucaptchaModule } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { SharedSxmUiUiInputFocusModule } from '@de-care/shared/sxm-ui/ui-input-focus';
import { SharedSxmUiUiEnableShowPasswordModule } from '@de-care/shared/sxm-ui/ui-enable-show-password';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';

const DECLARATIONS = [LoginFormComponent];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiLoadingIndicatorModule,
        SharedSxmUiUiNucaptchaModule,
        SharedSxmUiUiInputFocusModule,
        SharedSxmUiUiEnableShowPasswordModule,
        SharedSxmUiUiTooltipModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiAlertPillModule,
    ],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS],
})
export class DomainsAccountUiLoginModule {}
