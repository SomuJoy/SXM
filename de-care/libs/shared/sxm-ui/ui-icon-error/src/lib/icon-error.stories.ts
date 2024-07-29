import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconErrorModule } from './shared-sxm-ui-ui-icon-error.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Error',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconErrorModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="error" style="stroke: white;"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="error" style="stroke: white; width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="error" style="stroke: white;"></mat-icon>
    <mat-icon svgIcon="error" style="stroke: white;"></mat-icon>
    <mat-icon svgIcon="error" style="stroke: white;"></mat-icon>
    `,
});

export const Color: Story = () => ({
    template: `<mat-icon svgIcon="error" style="stroke: white;"></mat-icon>`,
});
