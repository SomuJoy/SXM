// TODO: STORYBOOK_AUDIT

// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { CancelReasonComponent } from './cancel-reason.component';
// import { DomainsCancellationUiCancelModule } from '../domains-cancellation-ui-cancel.module';
// import { action } from '@storybook/addon-actions';
//
// const stories = storiesOf('domains/cancellation/ui-cancel/cancel-reason', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsCancellationUiCancelModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     component: CancelReasonComponent,
//     props: {
//         reasonsSubmitted: action('@Output() reasonsSubmitted')
//     }
// }));
