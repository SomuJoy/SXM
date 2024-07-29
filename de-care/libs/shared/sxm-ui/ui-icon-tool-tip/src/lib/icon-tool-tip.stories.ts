import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconToolTipModule } from './shared-sxm-ui-ui-icon-tool-tip.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Tool Tip',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconToolTipModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="tool-tip" style="color: black; fill: transparent;"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="tool-tip" style="color: black; fill: transparent; width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="tool-tip" style="color: black; fill: transparent;"></mat-icon>
    <mat-icon svgIcon="tool-tip" style="color: black; fill: transparent;"></mat-icon>
    <mat-icon svgIcon="tool-tip" style="color: black; fill: transparent;"></mat-icon>
    `,
});

export const Color: Story = () => ({
    template: `<mat-icon svgIcon="tool-tip" style="color: rgb(0,110,215); fill: transparent;"></mat-icon>`,
});

export const FillBackground: Story = () => ({
    template: `<mat-icon svgIcon="tool-tip" style="color: black; fill: white;"></mat-icon>`,
});
