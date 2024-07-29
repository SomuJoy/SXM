import { MatIcon } from '@angular/material/icon';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SharedSxmUiUiIconCcDiscoverModule } from './shared-sxm-ui-ui-icon-cc-discover.module';

export default {
    title: 'Component Library/Icons (Angular Material)/Cc Discover',
    decorators: [
        moduleMetadata({
            imports: [SharedSxmUiUiIconCcDiscoverModule],
        }),
    ],
} as Meta<MatIcon>;

export const Default: Story = () => ({
    template: `<mat-icon svgIcon="cc-discover"></mat-icon>`,
});

export const MediumSize: Story = () => ({
    template: `<mat-icon svgIcon="cc-discover" style="width:56px; height:56px;"></mat-icon>`,
});

export const Multiple: Story = () => ({
    template: `
    <mat-icon svgIcon="cc-discover"></mat-icon>
    <mat-icon svgIcon="cc-discover"></mat-icon>
    <mat-icon svgIcon="cc-discover"></mat-icon>
    `,
});
