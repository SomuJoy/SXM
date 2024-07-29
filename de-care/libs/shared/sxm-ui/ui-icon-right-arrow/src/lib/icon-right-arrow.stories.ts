import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconRightArrowModule } from './shared-sxm-ui-ui-icon-right-arrow.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Right Arrow',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconRightArrowModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="right-arrow" style="color: black;"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="right-arrow" style="color: black; width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="right-arrow" style="color: black;"></mat-icon>
    <mat-icon svgIcon="right-arrow" style="color: black;"></mat-icon>
    <mat-icon svgIcon="right-arrow" style="color: black;"></mat-icon>
    `,
});

export const Color: Story = () => ({
    template: `<mat-icon svgIcon="right-arrow" style="color: rgb(0,110,215);"></mat-icon>`,
});
