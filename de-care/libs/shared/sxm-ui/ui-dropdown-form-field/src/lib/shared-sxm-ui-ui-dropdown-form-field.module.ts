import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedSxmUiUiInputFocusModule } from '@de-care/shared/sxm-ui/ui-input-focus';
import { SetFocusDirective } from './set-focus.directive';
import { SxmUiDropdownComponent } from './dropdown/dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedSxmUiUiInputFocusModule],
    declarations: [SetFocusDirective, SxmUiDropdownComponent],
    exports: [SxmUiDropdownComponent, SetFocusDirective]
})
export class SharedSxmUiUiDropdownFormFieldModule {}
