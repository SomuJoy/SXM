import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiNumericFormFieldComponent } from './numeric-form-field/numeric-form-field.component';
import { SxmUiModule } from '@de-care/sxm-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SxmUiModule],
    declarations: [SxmUiNumericFormFieldComponent],
    exports: [SxmUiNumericFormFieldComponent]
})
export class SharedSxmUiUiNumericFormFieldModule {}
