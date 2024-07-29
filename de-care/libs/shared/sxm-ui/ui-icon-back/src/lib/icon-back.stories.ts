import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconBackModule } from './shared-sxm-ui-ui-icon-back.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Back',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconBackModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="back" style="color: black;"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="back" style="color: black; width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="back" style="color: black;"></mat-icon>
    <mat-icon svgIcon="back" style="color: black;"></mat-icon>
    <mat-icon svgIcon="back" style="color: black;"></mat-icon>
    `,
});

export const Color: Story = () => ({
    template: `<mat-icon svgIcon="back" style="color: rgb(0,110,215);"></mat-icon>`,
});
