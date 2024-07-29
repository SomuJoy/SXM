import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdatePasswordFormFieldsComponent } from './update-password-form-fields/update-password-form-fields.component';
import { SharedSxmUiUiUsernameFormFieldModule } from '@de-care/shared/sxm-ui/ui-username-form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiTextFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-form-field';
import { ForgotUsernameFormComponent } from './forgot-username-form/forgot-username-form.component';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';

@NgModule({
    imports: [
        CommonModule,
        SharedSxmUiUiUsernameFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiTextFormFieldModule,
        SharedSxmUiUiDataClickTrackModule,
    ],
    declarations: [UpdatePasswordFormFieldsComponent, ForgotUsernameFormComponent],
    exports: [UpdatePasswordFormFieldsComponent, ForgotUsernameFormComponent],
})
export class SharedSxmUiUiUpdatePasswordFormFieldsModule {}
