import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiRadioOptionFormFieldPlaceholderComponent } from './radio-option-form-field-placeholder.component';

type StoryType = SxmUiRadioOptionFormFieldPlaceholderComponent;

export default {
    title: 'Component Library/UI/RadioOptionFormFieldPlaceholderComponent',
    component: SxmUiRadioOptionFormFieldPlaceholderComponent,
    decorators: [
        moduleMetadata({
            imports: [SxmUiRadioOptionFormFieldPlaceholderComponent],
        }),
    ],
} as Meta<SxmUiRadioOptionFormFieldPlaceholderComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-radio-option-form-field-placeholder></sxm-ui-radio-option-form-field-placeholder>`,
});
