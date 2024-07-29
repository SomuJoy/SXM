import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
    selector: 'sxm-ui-radio-option-form-field-placeholder',
    template: `
        <div class="gradient-animation"></div>
        <article>
            <div class="skeleton-radio-input">
                <input type="radio" name="option" disabled="disabled" />
                <span></span>
            </div>
            <div class="skeleton-radio-input">
                <input type="radio" name="option" disabled="disabled" />
                <span></span>
            </div>
            <div class="skeleton-radio-input">
                <input type="radio" name="option" disabled="disabled" />
                <span></span>
            </div>
            <div></div>
        </article>
    `,
    styleUrls: ['./radio-option-form-field-placeholder.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiRadioOptionFormFieldPlaceholderComponent {}

@NgModule({
    declarations: [SxmUiRadioOptionFormFieldPlaceholderComponent],
    exports: [SxmUiRadioOptionFormFieldPlaceholderComponent],
    imports: [],
})
export class SxmUiRadioOptionFormFieldPlaceholderComponentModule {}
