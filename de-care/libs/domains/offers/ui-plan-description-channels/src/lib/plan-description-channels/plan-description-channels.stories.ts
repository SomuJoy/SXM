// TODO: STORYBOOK_AUDIT

// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { DomainsOffersUiPlanDescriptionChannelsModule } from '../domains-offers-ui-plan-description-channels.module';
// import { Channel, PlanDescriptionChannelsComponent } from './plan-description-channels.component';
// import { SxmUiModule } from '@de-care/sxm-ui';
// import { withTranslation, withCommonDependencies } from '@de-care/shared/storybook/util-helpers';
//
// const stories = storiesOf('Domains/Offers/PlanDescriptionChannels', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsOffersUiPlanDescriptionChannelsModule]
//         })
//     )
//     .addDecorator(withCommonDependencies)
//     .addDecorator(withTranslation);
//
// const channels = [
//     {
//         title: '<b>XM Select Includes:</b>',
//         descriptions: [
//             '140+ Channels',
//             '85 ad-free music channels',
//             'Premium music channels like Garth Brooks, The Beatles, Pearl Jam, Bruce Springsteen, Grateful Dead, live performances & more',
//             'Listen in your car from coast to coast'
//         ]
//     }
// ] as Channel[];
//
// stories.add('plan-description-channels', () => ({
//     component: PlanDescriptionChannelsComponent,
//     props: { channels }
// }));
//
// stories.add('plan-description-channels: in accordion', () => ({
//     moduleMetadata: {
//         imports: [SxmUiModule]
//     },
//     template: `
//         <sxm-ui-accordion-chevron collapsedText="View details" expandedText="View less">
//         <plan-description-channels [channels]="channels"></plan-description-channels>
//     </sxm-ui-accordion-chevron>
//         `,
//     props: { channels }
// }));
//
// stories.add('plan-description-channels: in modal', () => ({
//     moduleMetadata: {
//         imports: [SxmUiModule]
//     },
//     template: `
//             <sxm-ui-modal [closed]="false" title="Channel Info" [titlePresent]="true">
//                 <plan-description-channels [channels]="channels"></plan-description-channels>
//             </sxm-ui-modal>
//         `,
//     props: { channels }
// }));
