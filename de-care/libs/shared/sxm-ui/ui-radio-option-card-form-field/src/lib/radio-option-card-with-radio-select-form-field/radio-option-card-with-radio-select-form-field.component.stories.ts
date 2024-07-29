import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import {
    SxmUiRadioOptionCardWithRadioSelectFormFieldComponent,
    SxmUiRadioOptionCardWithRadioSelectFormFieldComponentModule,
} from './radio-option-card-with-radio-select-form-field.component';

type StoryType = SxmUiRadioOptionCardWithRadioSelectFormFieldComponent;

const data1 = {
    title: '3 Months',
    description: 'Free',
    value: 'free value',
};
const data2 = {
    title: '12 Months',
    description: '$99',
    value: 'cost value',
};
const onSubmit = action('Form submitted');

export default {
    title: 'Component Library/Forms/Fields/RadioOptionCardWithRadioSelectFormFieldComponent',
    component: SxmUiRadioOptionCardWithRadioSelectFormFieldComponent,
    decorators: [
        moduleMetadata({
            imports: [SxmUiRadioOptionCardWithRadioSelectFormFieldComponentModule, ReactiveFormsModule],
        }),
    ],
} as Meta<SxmUiRadioOptionCardWithRadioSelectFormFieldComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        form: new FormGroup({ option: new FormControl() }),
        data1,
        onSubmit,
    },
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value.option)">
            <sxm-ui-radio-option-card-with-radio-select-form-field formControlName="option" [data]="data1"></sxm-ui-radio-option-card-with-radio-select-form-field>
            <br />
            <button type="submit">Submit</button> | <button type="reset">Clear</button>
        </form>
    `,
});

export const ThemeTransparent: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        form: new FormGroup({ option: new FormControl() }),
        data1,
        onSubmit,
    },
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value.option)">
            <sxm-ui-radio-option-card-with-radio-select-form-field 
                class="theme-transparent"
                formControlName="option" [data]="data1">
            </sxm-ui-radio-option-card-with-radio-select-form-field>
            <br />
            <button type="submit">Submit</button> | <button type="reset">Clear</button>
        </form>
    `,
});

const templateTwoInAForm = `
<form [formGroup]="form" (ngSubmit)="onSubmit(form.value.option)">
    <div style="width: 400px; display: grid; grid-template-columns: auto auto; gap: 8px;">
        <sxm-ui-radio-option-card-with-radio-select-form-field formControlName="option" [data]="data1"></sxm-ui-radio-option-card-with-radio-select-form-field>
        <sxm-ui-radio-option-card-with-radio-select-form-field formControlName="option" [data]="data2"></sxm-ui-radio-option-card-with-radio-select-form-field>
    </div>
    <button type="submit">Submit</button> | <button type="reset">Clear</button>
</form>
`;

export const UsedTwiceInAForm: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        form: new FormGroup({ option: new FormControl() }),
        data1,
        data2,
        onSubmit,
    },
    template: templateTwoInAForm,
});

export const UsedTwiceInAFormWithPreSelected: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        form: new FormGroup({ option: new FormControl('cost value') }),
        data1: {
            title: '3 Months',
            description: 'Free',
            value: 'free value',
        },
        data2: {
            title: '12 Months',
            description: '$99',
            value: 'cost value',
        },
        onSubmit,
    },
    template: templateTwoInAForm,
});

export const WithCallout: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        form: new FormGroup({ option: new FormControl() }),
        data1: {
            ...data1,
            callout: {
                text: '+Free Amazon Echo Dot',
                imageUrl: 'https://www.siriusxm.com/content/dam/sxm-com/devices/amazon/amz-dot-gen4-transparent-bg.png',
            },
        },
        onSubmit,
    },
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value.option)">
            <sxm-ui-radio-option-card-with-radio-select-form-field formControlName="option" [data]="data1"></sxm-ui-radio-option-card-with-radio-select-form-field>
            <br />
            <button type="submit">Submit</button> | <button type="reset">Clear</button>
        </form>
    `,
});

export const WithCalloutWithRichText: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        form: new FormGroup({ option: new FormControl() }),
        data1: {
            ...data1,
            callout: {
                text: '<em>+Free Amazon Echo Dot</em>',
                imageUrl: 'https://www.siriusxm.com/content/dam/sxm-com/devices/amazon/amz-dot-gen4-transparent-bg.png',
            },
        },
        onSubmit,
    },
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value.option)">
            <sxm-ui-radio-option-card-with-radio-select-form-field formControlName="option" [data]="data1"></sxm-ui-radio-option-card-with-radio-select-form-field>
            <br />
            <button type="submit">Submit</button> | <button type="reset">Clear</button>
        </form>
    `,
});

export const WithCalloutWithBrokenImageUrl: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        form: new FormGroup({ option: new FormControl() }),
        data1: {
            ...data1,
            callout: {
                text: '+Free Amazon Echo Dot',
                imageUrl: 'https://localhost/does-not-exist.png',
            },
        },
        onSubmit,
    },
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value.option)">
            <sxm-ui-radio-option-card-with-radio-select-form-field formControlName="option" [data]="data1"></sxm-ui-radio-option-card-with-radio-select-form-field>
            <br />
            <button type="submit">Submit</button> | <button type="reset">Clear</button>
        </form>
    `,
});

export const WithCalloutUsedTwiceInAForm: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        form: new FormGroup({ option: new FormControl() }),
        data1,
        data2: {
            ...data2,
            callout: {
                text: '+Free Amazon Echo Dot',
                imageUrl: 'https://www.siriusxm.com/content/dam/sxm-com/devices/amazon/amz-dot-gen4-transparent-bg.png',
            },
        },
        onSubmit,
    },
    template: templateTwoInAForm,
});
