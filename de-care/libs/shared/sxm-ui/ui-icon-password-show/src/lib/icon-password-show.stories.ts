import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconPasswordShowModule } from './shared-sxm-ui-ui-icon-password-show.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Password Show',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconPasswordShowModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="password-show"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="password-show" style="width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="password-show"></mat-icon>
    <mat-icon svgIcon="password-show"></mat-icon>
    <mat-icon svgIcon="password-show"></mat-icon>
    `,
});

export const Color: Story = () => ({
    template: `<mat-icon svgIcon="password-show" style="fill: rgb(0,110,215);"></mat-icon>`,
});
