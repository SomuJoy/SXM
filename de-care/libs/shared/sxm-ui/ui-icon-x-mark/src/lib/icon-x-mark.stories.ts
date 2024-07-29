import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconXMarkModule } from './shared-sxm-ui-ui-icon-x-mark.module';

export default {
    title: 'Component Library/Icons (Angular Material)/X Mark',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconXMarkModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="x-mark" style="color: black;"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="x-mark" style="color: black; width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="x-mark" style="color: black;"></mat-icon>
    <mat-icon svgIcon="x-mark" style="color: black;"></mat-icon>
    <mat-icon svgIcon="x-mark" style="color: black;"></mat-icon>
    `,
});

export const Color: Story = () => ({
    template: `<mat-icon svgIcon="x-mark" style="color: rgb(0,110,215);"></mat-icon>`,
});

export const StrokeSize: Story = () => ({
    template: `
        <mat-icon svgIcon="x-mark" style="color: black; stroke-width: 4px;"></mat-icon>
        <mat-icon svgIcon="x-mark" style="color: black; stroke-width: 3px;"></mat-icon>
        <mat-icon svgIcon="x-mark" style="color: black; stroke-width: 2px;"></mat-icon>
        <mat-icon svgIcon="x-mark" style="color: black; stroke-width: 1px;"></mat-icon>
    `,
});
