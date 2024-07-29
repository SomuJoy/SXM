import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiPlaceholderTextCopyComponent, SxmUiPlaceholderTextCopyComponentModule } from './placeholder-text-copy.component';

type StoryType = SxmUiPlaceholderTextCopyComponent;

export default {
    title: 'Component Library/Atoms/Placeholder Text Copy',
    component: SxmUiPlaceholderTextCopyComponent,
    decorators: [
        moduleMetadata({
            imports: [SxmUiPlaceholderTextCopyComponentModule],
        }),
    ],
} as Meta<SxmUiPlaceholderTextCopyComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-placeholder-text-copy></sxm-ui-placeholder-text-copy>`,
});

export const InOffWhitePanel: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<div style="background-color: #f5f5f5; padding: 16px; max-width: 300px;"><sxm-ui-placeholder-text-copy></sxm-ui-placeholder-text-copy><div>`,
});
