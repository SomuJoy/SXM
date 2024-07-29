import { AddressFormFieldsComponent } from './address-form-fields.component';
import { FormControl, FormGroup } from '@angular/forms';
import { boolean } from '@storybook/addon-knobs';
import { stories } from '../util.stories';

stories.add('address-form-fields', () => ({
    component: AddressFormFieldsComponent,
    props: {
        submitted: boolean('@Input submitted', false)
    }
}));

stories.add('address-form-fields: inside form element', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)">
            <sxm-ui-address-form-fields addressType = "billing" formControlName="billingAddress" [submitted]="submitted">
            </sxm-ui-address-form-fields>
            <button type="submit">Submit</button>
        </form>
    `,
    props: {
        form: new FormGroup({
            billingAddress: new FormControl()
        }),
        submitted: boolean('@Input submitted', false),
        onSubmit: value => console.log(value)
    }
}));

stories.add('address-form-fields: two address fields', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)">
            <sxm-ui-address-form-fields addressType = "billing" formControlName="billingAddress" [submitted]="submitted">
            </sxm-ui-address-form-fields>
            <br>
            <sxm-ui-address-form-fields addressType = "service" formControlName="serviceAddress" [submitted]="submitted">
            </sxm-ui-address-form-fields>
            <button type="submit">Submit</button>
        </form>
    `,
    props: {
        form: new FormGroup({
            billingAddress: new FormControl(),
            serviceAddress: new FormControl()
        }),
        submitted: boolean('@Input submitted', false),
        onSubmit: value => console.log(value)
    }
}));
