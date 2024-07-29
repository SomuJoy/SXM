import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { ReactiveFormsModule, FormGroup, FormControl, FormsModule } from '@angular/forms';
import { SharedSxmUiUiInputFocusModule } from './shared-sxm-ui-ui-input-focus.module';

const stories = storiesOf('Component Library/Forms/Field Directives/InputFocusDirective', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [FormsModule, ReactiveFormsModule, SharedSxmUiUiInputFocusModule],
        })
    );

stories.add('on form field with NgModel', () => ({
    template: `
        <div class="input-container">
            <label for="input">Test Field</label>
            <input id="input" type="text" [(ngModel)]="field" onFocus/>
        </div>
    `,
    props: {
        field: null,
    },
}));
stories.add('on form field with NgModel (prefilled with string)', () => ({
    template: `
        <div class="input-container">
            <label for="input">Test Field</label>
            <input id="input" type="text" [(ngModel)]="field" onFocus/>
        </div>
    `,
    props: {
        field: 'test value',
    },
}));
stories.add('on form field with NgModel (prefilled with number)', () => ({
    template: `
        <div class="input-container">
            <label for="input">Test Field</label>
            <input id="input" type="text" [(ngModel)]="field" onFocus/>
        </div>
    `,
    props: {
        field: 20,
    },
}));

stories.add('on form field with formControl', () => ({
    template: `
        <div class="input-container">
            <label for="input">Test Field</label>
            <input id="input" type="text" [formControl]="control" onFocus/>
        </div>
    `,
    props: {
        control: new FormControl(),
    },
}));
stories.add('on form field with formControl (prefilled with string)', () => ({
    template: `
        <div class="input-container">
            <label for="input">Test Field</label>
            <input id="input" type="text" [formControl]="control" onFocus/>
        </div>
    `,
    props: {
        control: new FormControl('test value'),
    },
}));
stories.add('on form field with formControl (prefilled with number)', () => ({
    template: `
        <div class="input-container">
            <label for="input">Test Field</label>
            <input id="input" type="text" [formControl]="control" onFocus/>
        </div>
    `,
    props: {
        control: new FormControl(20),
    },
}));

stories.add('on form field with formControlName', () => ({
    template: `
        <form [formGroup]="form">
            <div class="input-container">
                <label for="input">Test Field</label>
                <input id="input" type="text" formControlName="control" onFocus/>
            </div>
        </form>
    `,
    props: {
        form: new FormGroup({
            control: new FormControl(),
        }),
    },
}));
stories.add('on form field with formControlName (prefilled with string)', () => ({
    template: `
        <form [formGroup]="form">
            <div class="input-container">
                <label for="input">Test Field</label>
                <input id="input" type="text" formControlName="control" onFocus/>
            </div>
        </form>
    `,
    props: {
        form: new FormGroup({
            control: new FormControl('test value'),
        }),
    },
}));
stories.add('on form field with formControlName (prefilled with number)', () => ({
    template: `
        <form [formGroup]="form">
            <div class="input-container">
                <label for="input">Test Field</label>
                <input id="input" type="text" formControlName="control" onFocus/>
            </div>
        </form>
    `,
    props: {
        form: new FormGroup({
            control: new FormControl(20),
        }),
    },
}));
