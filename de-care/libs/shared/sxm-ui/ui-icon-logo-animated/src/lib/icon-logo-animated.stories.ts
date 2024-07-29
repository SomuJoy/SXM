import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconLogoAnimatedModule } from './shared-sxm-ui-ui-icon-logo-animated.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Logo Animated',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconLogoAnimatedModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="logo-animated" style="width:150px; height:30px;"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="logo-animated" style="width:300px; height:60px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="logo-animated" style="width:150px; height:30px;"></mat-icon>
    <mat-icon svgIcon="logo-animated" style="width:150px; height:30px;"></mat-icon>
    <mat-icon svgIcon="logo-animated" style="width:150px; height:30px;"></mat-icon>
    `,
});

export const Color: Story = () => ({
    template: `<mat-icon svgIcon="logo-animated" style="color: rgb(0,110,215); width:150px; height:30px;"></mat-icon>`,
});
