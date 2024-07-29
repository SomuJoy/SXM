import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconAddCarModule } from './shared-sxm-ui-ui-icon-add-car.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Add Car',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconAddCarModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="add-car" aria-hidden="false" aria-label="Add car subscription icon"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="add-car" style="width:56px; height:56px;" aria-hidden="false" aria-label="Add car subscription icon"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="add-car" aria-hidden="false" aria-label="Add car subscription icon"></mat-icon>
    <mat-icon svgIcon="add-car" aria-hidden="false" aria-label="Add car subscription icon"></mat-icon>
    <mat-icon svgIcon="add-car" aria-hidden="false" aria-label="Add car subscription icon"></mat-icon>
    `,
});

export const Color: Story = () => ({
    template: `<mat-icon svgIcon="add-car" style="color: rgb(0,110,215);"></mat-icon>`,
});
