import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconRemoveModule } from './shared-sxm-ui-ui-icon-remove.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Remove',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconRemoveModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="remove" style="color: black;"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="remove" style="color: black; width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="remove" style="color: black;"></mat-icon>
    <mat-icon svgIcon="remove" style="color: black;"></mat-icon>
    <mat-icon svgIcon="remove" style="color: black;"></mat-icon>
    `,
});

export const Color: Story = () => ({
    template: `<mat-icon svgIcon="remove" style="color: rgb(0,110,215);"></mat-icon>`,
});
