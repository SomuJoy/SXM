import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiProductBannerComponent, SxmUiProductBannerComponentModule } from './product-banner.component';

type StoryType = SxmUiProductBannerComponent;

export default {
    title: 'Component Library/ui/ProductBannerComponent',
    component: SxmUiProductBannerComponent,
    decorators: [
        moduleMetadata({
            imports: [SxmUiProductBannerComponentModule],
        }),
    ],
} as Meta<SxmUiProductBannerComponent>;

export const Default: Story<StoryType> = () => ({
    props: {
        data: {
            text: 'Plus, get a Free Echo Dot<br>(4th gen)',
            imageUrl: 'https://www.siriusxm.com/content/dam/sxm-com/devices/amazon/amz-dot-gen4-transparent-bg.png',
            imageAltText: 'Echo dot product image',
        },
    },
    template: `<sxm-ui-product-banner [data]="data"></sxm-ui-product-banner>`,
});
