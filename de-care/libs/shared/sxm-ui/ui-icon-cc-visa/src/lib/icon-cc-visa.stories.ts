import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconCcVisaModule } from './shared-sxm-ui-ui-icon-cc-visa.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Cc Visa',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconCcVisaModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="cc-visa"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="cc-visa" style="width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="cc-visa"></mat-icon>
    <mat-icon svgIcon="cc-visa"></mat-icon>
    <mat-icon svgIcon="cc-visa"></mat-icon>
    `,
});
