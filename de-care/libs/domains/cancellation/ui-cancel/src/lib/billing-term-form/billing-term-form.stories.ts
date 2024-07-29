// TODO: STORYBOOK_AUDIT

// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { TRANSLATE_PROVIDERS, withCommonDependencies } from '@de-care/shared/storybook/util-helpers';
// import { BillingTermFormComponent } from './billing-term-form.component';
// import { DomainsCancellationUiCancelModule } from '../domains-cancellation-ui-cancel.module';
// import { action } from '@storybook/addon-actions';
//
// const stories = storiesOf('domains/cancellation/ui-cancel/billing-term-form', module)
//     .addDecorator(withA11y)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsCancellationUiCancelModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withKnobs)
//     .addDecorator(withCommonDependencies);
//
// stories.add('Default', () => ({
//     component: BillingTermFormComponent,
//     props: {
//         plans: [
//             {
//                 planCode: 'Mostly Music - 12mo - wActv',
//                 termLength: 12,
//                 price: 131.88,
//                 savingsPercentage: 70,
//                 retailPrice: 21.99
//             },
//             {
//                 planCode: 'Mostly Music - 1mo - wActv',
//                 termLength: 12,
//                 price: 10.99,
//                 savingsPercentage: 20,
//                 retailPrice: 21.99,
//                 term: 'monthly'
//             },
//             {
//                 planCode: 'Mostly Music - 12mo - wActv',
//                 termLength: 6,
//                 price: 65.99,
//                 savingsPercentage: 50,
//                 retailPrice: 21.99
//             }
//         ],
//         currentLang: 'en-US',
//         planSelected: action('@Output() planSelected')
//     }
// }));
