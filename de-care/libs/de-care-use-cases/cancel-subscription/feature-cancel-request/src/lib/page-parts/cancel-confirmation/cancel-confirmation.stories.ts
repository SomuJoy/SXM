// TODO: STORYBOOK_AUDIT

// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { CancelConfirmationComponent } from './cancel-confirmation.component';
// import { DomainsCancellationUiCancelModule } from '../domains-cancellation-ui-cancel.module';
// import { DataOfferService } from '@de-care/data-services';
// import { of } from 'rxjs';
// import { UserSettingsService } from '@de-care/settings';
//
// const stories = storiesOf('domains/cancellation/ui-cancel/cancel-confirmation', module)
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
// const mockPackageDescriptions = {
//     provide: DataOfferService,
//     useValue: {
//         allPackageDescriptions: ({ locale }) => {
//             if (locale === 'fr_CA') {
//                 return of([{ name: 'FR:: Sirius Select', packageName: 'SIR_AUD_EVT' }]);
//             } else {
//                 return of([{ name: 'Sirius Select', packageName: 'SIR_AUD_EVT' }]);
//             }
//         }
//     }
// };
//
// stories.add('default', () => ({
//     component: CancelConfirmationComponent,
//     moduleMetadata: {
//         providers: [mockPackageDescriptions, { provide: UserSettingsService, useValue: { dateFormat$: of('MM/dd/yy') } }]
//     },
//     props: {
//         cancellationDetails: {
//             cancellationNumber: '473-WBG-813',
//             refundAmount: 60,
//             creditRemainingOnAccount: 0,
//             amountDue: 0
//         },
//         planInfo: {
//             packageName: 'SIR_AUD_EVT',
//             isTrial: true,
//             endDate: '2020-02-27'
//         }
//     }
// }));
