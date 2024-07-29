import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiIconCarModule } from '@de-care/shared/sxm-ui/ui-icon-car';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import {
    SxmUiRadioOptionCardWithIconAndRadioSelectFormFieldComponent,
    SxmUiRadioOptionCardWithIconAndRadioSelectFormFieldComponentModule,
} from './radio-option-card-with-icon-and-radio-select-form-field.component';

type StoryType = SxmUiRadioOptionCardWithIconAndRadioSelectFormFieldComponent;

export default {
    title: 'Component Library/Forms/Fields/RadioOptionCardWithIconAndRadioSelectFormFieldComponent',
    component: SxmUiRadioOptionCardWithIconAndRadioSelectFormFieldComponent,
    decorators: [
        moduleMetadata({
            imports: [SxmUiRadioOptionCardWithIconAndRadioSelectFormFieldComponentModule, ReactiveFormsModule, SharedSxmUiUiIconCarModule],
        }),
    ],
} as Meta<SxmUiRadioOptionCardWithIconAndRadioSelectFormFieldComponent>;

const onSubmit = action('Form submitted');

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        form: new FormGroup({ option: new FormControl() }),
        data: { label: 'Option One', value: 1 },
        onSubmit,
    },
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value.option)">
            <sxm-ui-radio-option-card-with-icon-and-radio-select-form-field 
                formControlName="option"
                [data]="data">
                <mat-icon icon svgIcon="car" style="color: black; width:32px; height:32px;"></mat-icon>
            </sxm-ui-radio-option-card-with-icon-and-radio-select-form-field>
            <br />
            <button type="submit">Submit</button> | <button type="reset">Clear</button>
        </form>`,
});

const templateTwoInAForm = `
<form [formGroup]="form" (ngSubmit)="onSubmit(form.value.option)">
    <div style="width: 400px; display: grid; row-gap: 8px;">
        <sxm-ui-radio-option-card-with-icon-and-radio-select-form-field formControlName="option" [data]="data1">
            <mat-icon icon svgIcon="car" style="color: black; width:32px; height:32px;"></mat-icon>
        </sxm-ui-radio-option-card-with-icon-and-radio-select-form-field>
        <sxm-ui-radio-option-card-with-icon-and-radio-select-form-field formControlName="option" [data]="data2">
            <mat-icon icon svgIcon="car" style="color: black; width:32px; height:32px;"></mat-icon>
        </sxm-ui-radio-option-card-with-icon-and-radio-select-form-field>
    </div>
    <button type="submit">Submit</button> | <button type="reset">Clear</button>
</form>
`;

export const UsedTwiceInAForm: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        form: new FormGroup({ option: new FormControl() }),
        data1: { label: 'Option One', value: 1 },
        data2: { label: 'Option Two', value: 2 },
        onSubmit,
    },
    template: templateTwoInAForm,
});

export const UsedTwiceInAFormWithPreSelected: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        form: new FormGroup({ option: new FormControl(2) }),
        data1: { label: 'Option One', value: 1 },
        data2: { label: 'Option Two', value: 2 },
        onSubmit,
    },
    template: templateTwoInAForm,
});
