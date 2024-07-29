import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiIconDropdownArrowSmallModule } from '@de-care/shared/sxm-ui/ui-icon-dropdown-arrow-small';

interface Options {
    value: string | number;
    label: string | number;
}
// NOTE: Component not ready for use
@Component({
    selector: 'sxm-ui-select-form-field',
    templateUrl: './select-form-field.component.html',
    styleUrls: ['./select-form-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatInputModule, MatFormFieldModule, SharedSxmUiUiIconDropdownArrowSmallModule],
})
export class SxmUiSelectFormFieldComponent {
    @Input() placeholder: string;
    @Input() options: Options[] = [];
    selected: string;
}
