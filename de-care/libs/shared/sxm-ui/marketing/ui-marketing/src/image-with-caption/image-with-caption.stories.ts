import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SharedSxmUiImageWithCaptionComponentModule } from './image-with-caption.component';

const stories = storiesOf('Component Library/Marketing/ImageWithCaptionComponent', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiImageWithCaptionComponentModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

const MarketingData = {
    imageUrl: 'https://www.siriusxm.com/content/dam/sxm-com/programming-content/music/rock/whole-lotta-red-hot/WholeLottaRedHot_16x9.jpg',
    bodyContent:
        '<strong>Congratulations</strong> to Helio Castroneves, Tom Blomqvist, Oliver Jarvis, Simon Pagenaud and the entire Meyer Shank Racing team on taking the SXM car to&nbsp; victory at the Rolex 24.<br />\r\n<a href="https://blog.siriusxm.com/rolex-24-msr/" target="_blank">Learn More</a>',
};

stories.add('default', () => ({
    template: `
    <sxm-ui-image-with-caption [data]="data" (submitNht)="onSubmitNht()"></sxm-ui-image-with-caption>
    `,
    props: {
        data: MarketingData,
        onSubmitNht: action('Clicked on NHT Page'),
    },
}));
