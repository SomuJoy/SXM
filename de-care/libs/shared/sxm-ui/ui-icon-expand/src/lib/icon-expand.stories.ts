import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconExpandModule } from './shared-sxm-ui-ui-icon-expand.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Expand',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconExpandModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="expand" style="color: black;"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="expand" style="color: black; width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="expand" style="color: black;"></mat-icon>
    <mat-icon svgIcon="expand" style="color: black;"></mat-icon>
    <mat-icon svgIcon="expand" style="color: black;"></mat-icon>
    `,
});

export const Color: Story = () => ({
    template: `<mat-icon svgIcon="expand" style="color: rgb(0,110,215);"></mat-icon>`,
});
