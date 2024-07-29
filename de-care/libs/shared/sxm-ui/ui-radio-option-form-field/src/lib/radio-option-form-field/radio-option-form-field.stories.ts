import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { SharedSxmUiUiRadioOptionFormFieldModule } from '../shared-sxm-ui-ui-radio-option-form-field.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';

const stories = storiesOf('Component Library/Forms/Fields/RadioOptionFormField', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiRadioOptionFormFieldModule],
        })
    );

stories.add('default', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value.option)">
            <sxm-ui-radio-option-form-field formControlName="option" label="Use email" value="email"></sxm-ui-radio-option-form-field>
            <sxm-ui-radio-option-form-field formControlName="option" label="Use phone" value="phone"></sxm-ui-radio-option-form-field>
            <br />
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </form>
    `,
    styles: [
        `
        button { all: revert; }
    `,
    ],
    props: {
        form: new FormGroup({ option: new FormControl() }),
        onSubmit: action(`Radio option selected`),
    },
}));

stories.add('bold label with description', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value.option)">
            <sxm-ui-radio-option-form-field class="label-bold" formControlName="option" label="2019 Toyota Camry" description="No active service" value="car"></sxm-ui-radio-option-form-field>
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </form>
    `,
    styles: [
        `
        button { all: revert; }
    `,
    ],
    props: {
        form: new FormGroup({ option: new FormControl() }),
        onSubmit: action(`Radio option selected`),
    },
}));

stories.add('bold label with inline description', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value.option)">
            <sxm-ui-radio-option-form-field class="label-bold description-inline" formControlName="option" label="2019 Toyota Camry" description=" - No active service" value="car"></sxm-ui-radio-option-form-field>
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </form>
    `,
    styles: [
        `
        button { all: revert; }
    `,
    ],
    props: {
        form: new FormGroup({ option: new FormControl() }),
        onSubmit: action(`Radio option selected`),
    },
}));
