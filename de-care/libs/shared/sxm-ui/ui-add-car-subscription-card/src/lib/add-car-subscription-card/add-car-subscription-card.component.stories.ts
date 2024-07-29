import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { Data, SxmUiAddCarSubscriptionCardComponent, SxmUiAddCarSubscriptionCardComponentModule } from './add-car-subscription-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { action } from '@storybook/addon-actions';

type StoryType = SxmUiAddCarSubscriptionCardComponent;

export default {
    title: 'Component Library/ui/AddCarSubscriptionCardComponent',
    component: SxmUiAddCarSubscriptionCardComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiAddCarSubscriptionCardComponentModule],
            providers: [
                MOCK_NGRX_STORE_PROVIDER,
                ...TRANSLATE_PROVIDERS,
                { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } },
            ],
        }),
        withTranslation,
    ],
} as Meta<SxmUiAddCarSubscriptionCardComponent>;

const sampleData = {
    termLength: 3,
    price: 1,
} as Data;

export const Default: Story<StoryType> = () => ({
    props: {
        data: sampleData,
        onAddCarSubscriptionButtonClick: action('@Output() addCarSubscriptionButtonClick'),
    },
    template: `<sxm-ui-add-car-subscription-card [data]="data" (addCarSubscriptionButtonClick)="onAddCarSubscriptionButtonClick($event)"></sxm-ui-add-car-subscription-card>`,
});

export const WithPrice: Story<StoryType> = () => ({
    props: {
        data: { ...sampleData, price: 1 } as Data,
        onAddCarSubscriptionButtonClick: action('@Output() addCarSubscriptionButtonClick'),
    },
    template: `<sxm-ui-add-car-subscription-card [data]="data" (addCarSubscriptionButtonClick)="onAddCarSubscriptionButtonClick($event)"></sxm-ui-add-car-subscription-card>`,
});

export const WithPriceNoFeesAndTaxes: Story<StoryType> = () => ({
    props: {
        data: { ...sampleData, price: 0 } as Data,
        onAddCarSubscriptionButtonClick: action('@Output() addCarSubscriptionButtonClick'),
    },
    template: `<sxm-ui-add-car-subscription-card [data]="data" (addCarSubscriptionButtonClick)="onAddCarSubscriptionButtonClick($event)"></sxm-ui-add-car-subscription-card>`,
});

export const WithPriceNoFees: Story<StoryType> = () => ({
    props: {
        data: { ...sampleData, price: 2, noFees: true } as Data,
        onAddCarSubscriptionButtonClick: action('@Output() addCarSubscriptionButtonClick'),
    },
    template: `<sxm-ui-add-car-subscription-card [data]="data" (addCarSubscriptionButtonClick)="onAddCarSubscriptionButtonClick($event)"></sxm-ui-add-car-subscription-card>`,
});
export const WithCustomClickTrackTypeRouting: Story<StoryType> = () => ({
    props: {
        data: { ...sampleData, clickTrackType: 'routing' } as Data,
        onAddCarSubscriptionButtonClick: action('@Output() addCarSubscriptionButtonClick'),
    },
    template: `<sxm-ui-add-car-subscription-card [data]="data" (addCarSubscriptionButtonClick)="onAddCarSubscriptionButtonClick($event)"></sxm-ui-add-car-subscription-card>`,
});

export const WithShadowBox: Story<StoryType> = () => ({
    props: {
        data: sampleData,
        onAddCarSubscriptionButtonClick: action('@Output() addCarSubscriptionButtonClick'),
    },
    template: `
        <div style="width: 345px; box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.2);">
            <sxm-ui-add-car-subscription-card [data]="data" (addCarSubscriptionButtonClick)="onAddCarSubscriptionButtonClick($event)"></sxm-ui-add-car-subscription-card>
        </div>`,
});

export const WithShadowBoxAndExtraCta: Story<StoryType> = () => ({
    props: {
        data: sampleData,
        onAddCarSubscriptionButtonClick: action('@Output() addCarSubscriptionButtonClick'),
    },
    template: `
        <div style="width: 345px; box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.2);">
            <sxm-ui-add-car-subscription-card [data]="data" (addCarSubscriptionButtonClick)="onAddCarSubscriptionButtonClick($event)">
                <button extraCta class="button secondary full-width" style="margin: 0; padding; 0;">No, Stream SXM Now</button>
            </sxm-ui-add-car-subscription-card>
        </div>`,
});
