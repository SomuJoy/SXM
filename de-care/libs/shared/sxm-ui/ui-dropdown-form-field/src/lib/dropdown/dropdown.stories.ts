import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { SharedSxmUiUiDropdownFormFieldModule } from '../shared-sxm-ui-ui-dropdown-form-field.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

const stories = storiesOf('Component Library/Forms/Fields/DropdownFormField', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiDropdownFormFieldModule],
        })
    );

stories.add('default', () => ({
    template: `
        <form [formGroup]="form">
            <sxm-ui-dropdown class="dropdown" formControlName="letter" labelText="Letter" [passedValue]="passedValue"></sxm-ui-dropdown>
        </form>
    `,
    styles: [`sxm-ui-dropdown { display: block; }`],
    props: {
        form: new FormGroup({ letter: new FormControl() }),
        passedValue: ['', 'b', 'c', 'd', 'e', 'f'],
    },
}));

stories.add('preset value', () => ({
    template: `
        <form [formGroup]="form">
            <sxm-ui-dropdown class="dropdown" formControlName="letter" labelText="Letter" [passedValue]="passedValue"></sxm-ui-dropdown>
        </form>
    `,
    styles: [`sxm-ui-dropdown { display: block; }`],
    props: {
        form: new FormGroup({ letter: new FormControl('c') }),
        passedValue: ['', 'b', 'c', 'd', 'e', 'f'],
    },
}));
