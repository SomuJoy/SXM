// TODO: STORYBOOK_AUDIT

// import { boolean, number, select, text, withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { HeroComponent } from './hero.component';
// import { withMockSettings, TRANSLATE_PROVIDERS } from '@de-care/shared/storybook/util-helpers';
// import { TranslateModule } from '@ngx-translate/core';
// import { DomainsOffersUiHeroModule } from '../domains-offers-ui-hero.module';
//
// const stories = storiesOf('offers/hero', module)
//     .addDecorator(
//         moduleMetadata({
//             imports: [TranslateModule.forRoot(), DomainsOffersUiHeroModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(withMockSettings);
//
// stories.add('with calculated header text', () => ({
//     component: HeroComponent,
//     props: {
//         heroTitleType: select(
//             '@Input() heroTitleType',
//             {
//                 Get: 'GET',
//                 Keep: 'KEEP',
//                 TrialExtension: 'TRIAL_EXTENSION',
//                 Streaming: 'STREAMING',
//                 Thanks: 'THANKS',
//                 ThanksStreaming: 'THANKS_STREAMING'
//             },
//             'GET'
//         ),
//         price: number('@Input() price', 29.99),
//         pricePerMonth: number('@Input() pricePerMonth', 4.99),
//         termLength: number('@Input() termLength', 6),
//         showImage: boolean('@Input() showImage', false),
//         platform: text('@Input() platform', 'XM')
//     }
// }));
//
// stories.add('with custom header text', () => ({
//     component: HeroComponent,
//     props: {
//         headerState: text('@Input() headerState', 'This is a custom header message'),
//         showImage: boolean('@Input() showImage', false)
//     }
// }));
