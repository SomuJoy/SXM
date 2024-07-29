import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconCcJcbModule } from './shared-sxm-ui-ui-icon-cc-jcb.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Cc Jcb',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconCcJcbModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="cc-jcb"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="cc-jcb" style="width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="cc-jcb"></mat-icon>
    <mat-icon svgIcon="cc-jcb"></mat-icon>
    <mat-icon svgIcon="cc-jcb"></mat-icon>
    `,
});
