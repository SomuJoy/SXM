import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconAdditionalSubscriptionsModule } from './shared-sxm-ui-ui-icon-additional-subscriptions.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Additional Subscriptions',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconAdditionalSubscriptionsModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="additional-subscriptions" style="color: black;"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="additional-subscriptions" style="color: black; width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="additional-subscriptions" style="color: black;"></mat-icon>
    <mat-icon svgIcon="additional-subscriptions" style="color: black;"></mat-icon>
    <mat-icon svgIcon="additional-subscriptions" style="color: black;"></mat-icon>ß
    `,
});

export const Color: Story = () => ({
    template: `<mat-icon svgIcon="additional-subscriptions" style="color: rgb(0,110,215);"></mat-icon>`,
});
