import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconCcUnionpayModule } from './shared-sxm-ui-ui-icon-cc-unionpay.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Cc Unionpay',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconCcUnionpayModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="cc-unionpay"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="cc-unionpay" style="width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="cc-unionpay"></mat-icon>
    <mat-icon svgIcon="cc-unionpay"></mat-icon>
    <mat-icon svgIcon="cc-unionpay"></mat-icon>
    `,
});
