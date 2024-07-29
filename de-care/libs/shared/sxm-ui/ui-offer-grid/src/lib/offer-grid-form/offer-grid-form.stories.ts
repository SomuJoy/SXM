import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER } from '@de-care/shared/storybook/util-helpers';
import { SharedSxmUiUiOfferGridModule } from '../shared-sxm-ui-ui-offer-grid.module';
import { OfferData, OfferFeatureData } from './offer-grid-form.component';
import { action } from '@storybook/addon-actions';

const stories = storiesOf('Component Library/Forms/Full Forms/Offer Grid Form', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiUiOfferGridModule],
            providers: [...TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER],
        })
    );

const mockFeatureSet: OfferFeatureData[] = [
    {
        name: 'Feature One',
        tooltipText: '',
    },
    {
        name: 'Feature Two',
        tooltipText: '',
    },
    {
        name: 'Feature Three',
        tooltipText: 'Sample tool tip text copy',
    },
    {
        name: 'Feature Four',
        tooltipText: '',
    },
];
const mockOffers: OfferData[] = [
    {
        selected: false,
        name: 'SiriusXM Mostly Music',
        planCode: 'plan-code-A',
        priceText: '$9.99',
        channelCountText: '20+',
        adFreeChannelCountText: '15+',
        features: [mockFeatureSet[0]],
        channelLineupLink: { text: 'Mostly Music Channels', url: 'some-url-for-A' },
    },
    {
        selected: false,
        name: 'SiriusXM Select',
        planCode: 'plan-code-B',
        priceText: '$14.99',
        channelCountText: '50+',
        features: [mockFeatureSet[2], mockFeatureSet[3]],
        channelLineupLink: { text: 'Select Channels', url: 'some-url-for-B' },
    },
    {
        selected: true,
        name: 'SiriusXM All Access',
        planCode: 'plan-code-C',
        priceText: '$19.99',
        channelCountText: '120+',
        features: [...mockFeatureSet],
        channelLineupLink: { text: 'All Access Channels', url: 'some-url-for-C' },
    },
];

stories.add('default (3 offers)', () => ({
    template: `<sxm-ui-offer-grid-form [offers]="offers" (submitted)="onSubmit($event)"></sxm-ui-offer-grid-form>`,
    props: {
        offers: mockOffers,
        onSubmit: action('Form submitted'),
    },
}));

stories.add('with 2 offers', () => ({
    template: `<sxm-ui-offer-grid-form [offers]="offers" (submitted)="onSubmit($event)"></sxm-ui-offer-grid-form>`,
    props: {
        offers: [mockOffers[0], { ...mockOffers[1], selected: true }],
        onSubmit: action('Form submitted'),
    },
}));

stories.add('with 2 offers none pre-selected', () => ({
    template: `<sxm-ui-offer-grid-form [offers]="offers" (submitted)="onSubmit($event)"></sxm-ui-offer-grid-form>`,
    props: {
        offers: [
            { ...mockOffers[0], selected: false },
            { ...mockOffers[1], selected: false },
        ],
        onSubmit: action('Form submitted'),
    },
}));

stories.add('with custom header instructions', () => ({
    template: `
        <sxm-ui-offer-grid-form [offers]="offers" (submitted)="onSubmit($event)">
            <div headerInstructions>
                <p>Continue with what you had in your trial or pick a different option. Your choice won’t impact your current Platinum promotion.</p>
                <p>See Offer Details below.</p>
            </div>
        </sxm-ui-offer-grid-form>
    `,
    props: {
        offers: mockOffers,
        onSubmit: action('Form submitted'),
    },
}));

stories.add('with custom button text', () => ({
    template: `<sxm-ui-offer-grid-form [offers]="offers" (submitted)="onSubmit($event)" [textCopy]="{ continueButtonText: 'Submit' }"></sxm-ui-offer-grid-form>`,
    props: {
        offers: mockOffers,
        onSubmit: action('Form submitted'),
    },
}));

stories.add('with offer callout text', () => ({
    template: `<sxm-ui-offer-grid-form [offers]="offers" (submitted)="onSubmit($event)"></sxm-ui-offer-grid-form>`,
    props: {
        offers: [mockOffers[0], mockOffers[1], { ...mockOffers[2], calloutText: 'In your trial' }],
        onSubmit: action('Form submitted'),
    },
}));
