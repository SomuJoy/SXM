import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconCcDciModule } from './shared-sxm-ui-ui-icon-cc-dci.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Cc Dci',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconCcDciModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="cc-dci"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="cc-dci" style="width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="cc-dci"></mat-icon>
    <mat-icon svgIcon="cc-dci"></mat-icon>
    <mat-icon svgIcon="cc-dci"></mat-icon>
    `,
});
