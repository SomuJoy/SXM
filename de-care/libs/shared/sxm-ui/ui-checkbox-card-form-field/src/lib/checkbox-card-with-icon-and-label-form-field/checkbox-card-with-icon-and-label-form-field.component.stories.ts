import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiIconAddCarModule } from '@de-care/shared/sxm-ui/ui-icon-add-car';
import { SharedSxmUiUiIconCarModule } from '@de-care/shared/sxm-ui/ui-icon-car';
import { SharedSxmUiUiIconStreamingModule } from '@de-care/shared/sxm-ui/ui-icon-streaming';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import {
    SxmUiCheckboxCardWithIconAndLabelFormFieldComponent,
    SxmUiCheckboxCardWithIconAndLabelFormFieldComponentModule,
} from './checkbox-card-with-icon-and-label-form-field.component';

type StoryType = SxmUiCheckboxCardWithIconAndLabelFormFieldComponent;

export default {
    title: 'Component Library/Forms/Fields/CheckboxCardWithIconAndLabelFormFieldComponent',
    component: SxmUiCheckboxCardWithIconAndLabelFormFieldComponent,
    decorators: [
        moduleMetadata({
            imports: [
                SxmUiCheckboxCardWithIconAndLabelFormFieldComponentModule,
                ReactiveFormsModule,
                SharedSxmUiUiIconCarModule,
                SharedSxmUiUiIconAddCarModule,
                SharedSxmUiUiIconStreamingModule,
            ],
        }),
    ],
} as Meta<SxmUiCheckboxCardWithIconAndLabelFormFieldComponent>;

const onSubmit = action('Form submitted');

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        form: new FormGroup({ option: new FormControl() }),
        onSubmit,
    },
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)">
            <sxm-ui-checkbox-card-with-icon-and-label-form-field
                formControlName="option"
                label="Option One">
                <mat-icon icon svgIcon="car" style="color: black; width:32px; height:32px;"></mat-icon>
            </sxm-ui-checkbox-card-with-icon-and-label-form-field>
            <br />
            <button type="submit">Submit</button> | <button type="reset">Clear</button>
        </form>
    `,
});

const templateMultipleInAForm = `
<form [formGroup]="form" (ngSubmit)="onSubmit(form.value)" style="display: grid; row-gap: 8px;">
<sxm-ui-checkbox-card-with-icon-and-label-form-field
    formControlName="option1"
    label="In The Car">
    <mat-icon icon svgIcon="car" style="color: black; width:32px; height:32px;"></mat-icon>
</sxm-ui-checkbox-card-with-icon-and-label-form-field>
<sxm-ui-checkbox-card-with-icon-and-label-form-field
    formControlName="option2"
    label="Car Plus Streaming">
    <mat-icon icon svgIcon="add-car" style="width:32px; height:32px;"></mat-icon>
</sxm-ui-checkbox-card-with-icon-and-label-form-field>
<sxm-ui-checkbox-card-with-icon-and-label-form-field
    formControlName="option3"
    label="Streaming Only">
    <mat-icon icon svgIcon="streaming" style="color: black; width:32px; height:32px;"></mat-icon>
</sxm-ui-checkbox-card-with-icon-and-label-form-field>
<div>
    <button type="submit">Submit</button> | <button type="reset">Clear</button>
</div>
</form>
`;

export const UsedMultipleTimesInAForm: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        form: new FormGroup({ option1: new FormControl(), option2: new FormControl(), option3: new FormControl() }),
        onSubmit,
    },
    template: templateMultipleInAForm,
});

export const UsedMultipleTimesInAFormWithPreSelected: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        form: new FormGroup({ option1: new FormControl(true), option2: new FormControl(), option3: new FormControl(true) }),
        onSubmit,
    },
    template: templateMultipleInAForm,
});

export const ThemeFlatMatteWhite: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        form: new FormGroup({ option1: new FormControl(), option2: new FormControl(), option3: new FormControl() }),
        onSubmit,
    },
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)" style="padding: 32px; background: linear-gradient(#19447a, #0f2d54); display: grid; row-gap: 8px;">
            <sxm-ui-checkbox-card-with-icon-and-label-form-field
                class="theme-flat-matte-white"
                formControlName="option1"
                label="In The Car">
                <mat-icon icon svgIcon="car" style="color: black; width:32px; height:32px;"></mat-icon>
            </sxm-ui-checkbox-card-with-icon-and-label-form-field>
            <div style="color: white;">
                <button type="submit">Submit</button> | <button type="reset">Clear</button>
            </div>
        </form>
    `,
});
