import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconPasswordHideModule } from './shared-sxm-ui-ui-icon-password-hide.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Password Hide',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconPasswordHideModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="password-hide"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="password-hide" style="width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="password-hide"></mat-icon>
    <mat-icon svgIcon="password-hide"></mat-icon>
    <mat-icon svgIcon="password-hide"></mat-icon>
    `,
});

export const Color: Story = () => ({
    template: `<mat-icon svgIcon="password-hide" style="fill: rgb(0,110,215);"></mat-icon>`,
});
