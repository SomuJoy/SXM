import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiSkeletonLoaderPaymentMethodsComponent } from './skeleton-loader-payment-methods.component';

type StoryType = SxmUiSkeletonLoaderPaymentMethodsComponent;

export default {
    title: 'Component Library/UI/SkeletonLoaderPaymentMethodsComponent',
    component: SxmUiSkeletonLoaderPaymentMethodsComponent,
    decorators: [
        moduleMetadata({
            imports: [SxmUiSkeletonLoaderPaymentMethodsComponent],
        }),
    ],
} as Meta<SxmUiSkeletonLoaderPaymentMethodsComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-skeleton-loader-payment-methods></sxm-ui-skeleton-loader-payment-methods>`,
});
