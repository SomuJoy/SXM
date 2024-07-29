import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconCcMcModule } from './shared-sxm-ui-ui-icon-cc-mc.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Cc Mc',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconCcMcModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="cc-mc"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="cc-mc" style="width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="cc-mc"></mat-icon>
    <mat-icon svgIcon="cc-mc"></mat-icon>
    <mat-icon svgIcon="cc-mc"></mat-icon>
    `,
});
