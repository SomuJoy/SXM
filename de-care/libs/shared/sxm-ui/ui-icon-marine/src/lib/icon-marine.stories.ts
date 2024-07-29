import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconMarineModule } from './shared-sxm-ui-ui-icon-marine.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Marine',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconMarineModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="marine" style="color: black;"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="marine" style="color: black; width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="marine" style="color: black;"></mat-icon>
    <mat-icon svgIcon="marine" style="color: black;"></mat-icon>
    <mat-icon svgIcon="marine" style="color: black;"></mat-icon>
    `,
});

export const Color: Story = () => ({
    template: `<mat-icon svgIcon="marine" style="color: rgb(0,110,215);"></mat-icon>`,
});