import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiRadioOptionWithTooltipFormFieldSetModule } from '../shared-sxm-ui-ui-radio-option-with-tooltip-form-field-set.module';

const stories = storiesOf('Component Library/Forms/Groups/RadioOptionWithTooltipFormFieldSet', module)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiRadioOptionWithTooltipFormFieldSetModule],
        })
    )
    .addDecorator(withA11y);

const options = [
    {
        name: 'Hip-Hop/R&B',
        value: 'Choice Hip-Hop/R+B - 1mo',
        tooltipTitle: 'Hip-Hop/R&B channels:',
        tooltipText: ['Hip-Hop Nation', 'The Heat', 'SiriusXM FLY'],
    },
    {
        name: 'Pop',
        value: 'Choice Pop - 1mo',
        tooltipTitle: 'Pop channels:',
        tooltipText: ['The Pulse', 'SiriusXM Hits 1', 'PopRocks'],
    },
    {
        name: 'Classic Rock',
        value: 'Choice Classic Rock - 1mo',
        tooltipTitle: 'Classic Rock channels:',
        tooltipText: ['Classic Rewind', 'Classic Vinyl', 'Lithium'],
    },
];

const form = new FormGroup({
    option: new FormControl(),
});

stories.add('default', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)">
            <sxm-ui-radio-option-with-tooltip-form-field-set [options]="options" formControlName="option"></sxm-ui-radio-option-with-tooltip-form-field-set>
            <button type="submit">Submit</button>
        </form>
    `,
    styles: [`button { all: revert; }`],
    props: {
        form,
        options,
        onSubmit: action('Form submitted'),
    },
}));
