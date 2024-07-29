import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconDropdownArrowSmallModule } from './shared-sxm-ui-ui-icon-dropdown-arrow-small.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Dropdown Arrow Small',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconDropdownArrowSmallModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="dropdown-arrow-small" style="color: black;"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="dropdown-arrow-small" style="color: black; width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="dropdown-arrow-small" style="color: black;"></mat-icon>
    <mat-icon svgIcon="dropdown-arrow-small" style="color: black;"></mat-icon>
    <mat-icon svgIcon="dropdown-arrow-small" style="color: black;"></mat-icon>
    `,
});

export const Color: Story = () => ({
    template: `<mat-icon svgIcon="dropdown-arrow-small" style="color: rgb(0,110,215);"></mat-icon>`,
});

export const Toggle: Story = () => ({
    props: {
        flipped: false,
    },
    template: `
        <style>
            mat-icon[svgIcon="dropdown-arrow-small"] { cursor: pointer; color: black; }
            mat-icon[svgIcon="dropdown-arrow-small"].flipped { transform: rotate(180deg); }
        </style>
        <mat-icon svgIcon="dropdown-arrow-small" [class.flipped]="flipped" (click)="flipped = !flipped"></mat-icon>
    `,
});
