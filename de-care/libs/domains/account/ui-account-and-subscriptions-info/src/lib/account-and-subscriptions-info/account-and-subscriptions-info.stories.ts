// TODO: STORYBOOK_AUDIT

// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { TRANSLATE_PROVIDERS, withMockSettings } from '@de-care/shared/storybook/util-helpers';
// import { DomainsAccountUiAccountAndSubscriptionsInfoModule } from '../domains-account-ui-account-and-subscriptions-info.module';
//
// const stories = storiesOf('Domains/Account/Accounts and subscriptions/AccountAndSubscriptionsInfo', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsAccountUiAccountAndSubscriptionsInfoModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withMockSettings);
// stories.add('with no subscriptions', () => ({
//     template: `
//         <account-and-subscriptions-info [accountDataInfo]="data"></account-and-subscriptions-info>
//         `,
//     props: {
//         data: {
//             accountLast4Digits: '0709'
//         }
//     }
// }));
// stories.add('with 1 subscription and no vehicle info', () => ({
//     template: `
//     <account-and-subscriptions-info [accountDataInfo]="data"></account-and-subscriptions-info>
//     `,
//     props: {
//         data: {
//             accountLast4Digits: '0709',
//             subscriptions: [{ packageNameText: 'SiriusXM All Access' }]
//         }
//     }
// }));
// stories.add('with 1 subscription', () => ({
//     template: `
//     <account-and-subscriptions-info [accountDataInfo]="data"></account-and-subscriptions-info>
//     `,
//     props: {
//         data: {
//             accountLast4Digits: '0709',
//             subscriptions: [{ packageNameText: 'SiriusXM All Access', vehicle: { year: 2017, make: 'Nissan', model: 'XTrail' } }]
//         }
//     }
// }));
// stories.add('with 2 subscriptions', () => ({
//     template: `
//     <account-and-subscriptions-info [accountDataInfo]="data"></account-and-subscriptions-info>
//     `,
//     props: {
//         data: {
//             accountLast4Digits: '0709',
//             subscriptions: [
//                 { packageNameText: 'SiriusXM All Access', vehicle: { year: 2017, make: 'Nissan', model: 'XTrail' } },
//                 { packageNameText: 'Sirius Select', vehicle: { year: 2018, make: 'Nissan', model: 'Rogue' } }
//             ]
//         }
//     }
// }));
// stories.add('with 2 accounts', () => ({
//     template: `
//     <div *ngFor="let accountItem of data">
//         <account-and-subscriptions-info [accountDataInfo]="accountItem" [displayVerifyLink]="true" (verifyClicked)="onVerifyClicked()"></account-and-subscriptions-info>
//         <hr>
//     </div>
//     `,
//     props: {
//         data: [
//             {
//                 accountLast4Digits: '0709',
//                 subscriptions: [{ packageNameText: 'SiriusXM All Access', vehicle: { year: 2017, make: 'Nissan', model: 'XTrail' } }]
//             },
//             {
//                 accountLast4Digits: '0869',
//                 subscriptions: [{ packageNameText: 'Sirius Select', vehicle: { year: 2018, make: 'Nissan', model: 'Rogue' } }]
//             }
//         ]
//     }
// }));
