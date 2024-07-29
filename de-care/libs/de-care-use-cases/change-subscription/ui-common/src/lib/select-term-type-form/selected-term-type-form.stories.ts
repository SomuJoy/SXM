// TODO: STORYBOOK_AUDIT

// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { withCommonDependencies } from '@de-care/shared/storybook/util-helpers';
// import { DeCareUseCasesChangeSubscriptionUiCommonModule } from '../de-care-use-cases-change-subscription-ui-common.module';
// import { SelectTermTypeFormComponent } from './select-term-type-form.component';
// import { action } from '@storybook/addon-actions';
//
// const stories = storiesOf('de-care-use-case/change-subscription/ui-common/select-term-type-form', module)
//     .addDecorator(withA11y)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DeCareUseCasesChangeSubscriptionUiCommonModule]
//         })
//     )
//     .addDecorator(withKnobs)
//     .addDecorator(withCommonDependencies);
//
// stories.add('Default', () => ({
//     component: SelectTermTypeFormComponent,
//     props: {
//         termOptionInfo: { monthlyPrice: 10, annualPrice: 80, currentPlanTermType: null },
//         currentLang: 'en-US',
//         termSelected: action('@Output() termSelected')
//     }
// }));
//
// stories.add('With current text', () => ({
//     component: SelectTermTypeFormComponent,
//     props: {
//         termOptionInfo: { monthlyPrice: 10, annualPrice: 80, currentPlanTermType: 'annual' },
//         currentLang: 'en-US',
//         termSelected: action('@Output() termSelected')
//     }
// }));
