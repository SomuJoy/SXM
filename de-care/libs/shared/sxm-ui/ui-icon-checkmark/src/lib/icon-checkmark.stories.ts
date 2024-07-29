import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconCheckmarkModule } from './shared-sxm-ui-ui-icon-checkmark.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Checkmark',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconCheckmarkModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="checkmark" style="color: black;"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="checkmark" style="color: black; width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="checkmark" style="color: black;"></mat-icon>
    <mat-icon svgIcon="checkmark" style="color: black;"></mat-icon>
    <mat-icon svgIcon="checkmark" style="color: black;"></mat-icon>
    `,
});

export const Color: Story = () => ({
    template: `<mat-icon svgIcon="checkmark" style="color: rgb(0,110,215);"></mat-icon>`,
});

export const StrokeSize: Story = () => ({
    template: `
        <mat-icon svgIcon="checkmark" style="color: black; stroke-width: 4px;"></mat-icon>
        <mat-icon svgIcon="checkmark" style="color: black; stroke-width: 3px;"></mat-icon>
        <mat-icon svgIcon="checkmark" style="color: black; stroke-width: 2px;"></mat-icon>
        <mat-icon svgIcon="checkmark" style="color: black; stroke-width: 1px;"></mat-icon>
    `,
});
