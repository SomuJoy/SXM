import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiDetailsColorWithCtaComponentModule } from './details-color-with-cta.component';
import { MOCK_NGRX_STORE_PROVIDER } from '@de-care/shared/storybook/util-helpers';

const stories = storiesOf('Component Library/Marketing/DetailsColorWithCtaComponent', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiDetailsColorWithCtaComponentModule],
            providers: [MOCK_NGRX_STORE_PROVIDER],
        })
    );

const offerData = {
    title: 'Get all live sports, Pandora stations, every channel, and more',
    subtitle: 'when you upgrade to Platinum plan.',
    buttonLabel: 'subscribe',
    legalCopy: 'Additional $5/mo plus fees. See Offer Details.',
};

const offerDataNoCtaNoLegal = {
    title: 'Get all live sports, Pandora stations, every channel, and more',
    subtitle: 'when you upgrade to Platinum plan.',
};

stories.add('default', () => ({
    template: `
        <sxm-ui-details-color-with-cta [data]="data" (ctaClicked)="onSubmit()"></sxm-ui-details-color-with-cta>
    `,
    props: {
        data: offerData,
        onSubmit: action('Offer button is clicked'),
    },
}));

stories.add('no button, no legal text', () => ({
    template: `
        <sxm-ui-details-color-with-cta [data]="data"></sxm-ui-details-color-with-cta>
    `,
    props: {
        data: offerDataNoCtaNoLegal,
    },
}));

stories.add('lg-width size', () => ({
    template: `
        <div class="lg-width">
            <sxm-ui-details-color-with-cta [data]="data" (ctaClicked)="onSubmit()"></sxm-ui-details-color-with-cta>
        </div>
    `,
    props: {
        data: offerData,
        onSubmit: action('Offer button is clicked'),
    },
}));

stories.add('full-width size', () => ({
    template: `
        <div class="full-width">
            <sxm-ui-details-color-with-cta [data]="data" (ctaClicked)="onSubmit()"></sxm-ui-details-color-with-cta>
        </div>
    `,
    props: {
        data: offerData,
        onSubmit: action('Offer button is clicked'),
    },
}));
