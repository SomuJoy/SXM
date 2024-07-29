import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconLogoModule } from './shared-sxm-ui-ui-icon-logo.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Logo',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconLogoModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="logo" style="width:135px; height:26px;"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="logo" style="width:270px; height:52px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="logo" style="width:135px; height:26px;"></mat-icon>
    <mat-icon svgIcon="logo" style="width:135px; height:26px;"></mat-icon>
    <mat-icon svgIcon="logo" style="width:135px; height:26px;"></mat-icon>
    `,
});

export const Color: Story = () => ({
    template: `<mat-icon svgIcon="logo" style="color: #0000eb; fill: #000; width:135px; height:26px;"></mat-icon>`,
});
