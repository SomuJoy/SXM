import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiSelectFormFieldComponent } from './select-form-field.component';

type StoryType = SxmUiSelectFormFieldComponent;

export default {
    title: 'Component Library/Forms/Fields/SelectFormFieldComponent',
    component: SxmUiSelectFormFieldComponent,
    decorators: [
        moduleMetadata({
            imports: [SxmUiSelectFormFieldComponent, BrowserAnimationsModule],
        }),
    ],
} as Meta<SxmUiSelectFormFieldComponent>;

const list = [
    { value: 'steak-0', label: 'Steak' },
    { value: 'pizza-1', label: 'Pepperoni and mushroom pizza' },
    { value: 'tacos-2', label: 'Tacos' },
    { value: 'cake-3', label: 'Carrot cake' },
];

const list2 = [
    { value: 'coke', label: 'Coke' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'tea', label: 'Tea' },
];

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: { args, options: list, placeholder: 'My favorite food of all time' },
    template: `<sxm-ui-select-form-field [options]="options" [placeholder]="placeholder"></sxm-ui-select-form-field>`,
});

export const Multiple: Story<StoryType> = (args: StoryType) => ({
    props: { args, options1: list, options2: list2, placeholder1: 'My favorite food of all time', placeholder2: 'My favorite drink of all time' },
    template: `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <sxm-ui-select-form-field [options]="options1" [placeholder]="placeholder1"></sxm-ui-select-form-field>
        <sxm-ui-select-form-field [options]="options2" [placeholder]="placeholder2"></sxm-ui-select-form-field>
    </div>`,
});
