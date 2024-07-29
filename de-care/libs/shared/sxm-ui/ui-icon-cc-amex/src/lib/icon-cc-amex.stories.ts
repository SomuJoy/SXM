import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconCcAmexModule } from './shared-sxm-ui-ui-icon-cc-amex.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Cc Amex',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconCcAmexModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="cc-amex"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="cc-amex" style="width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="cc-amex"></mat-icon>
    <mat-icon svgIcon="cc-amex"></mat-icon>
    <mat-icon svgIcon="cc-amex"></mat-icon>
    `,
});
