// TODO: STORYBOOK_AUDIT

// import { DomainsAccountUiYourCurrentPlanModule } from '../domains-account-ui-your-current-plan.module';
// import { SettingsService } from '@de-care/settings';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withCommonDependencies, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { YourCurrentPlanComponent } from './your-current-plan.component';
//
// const stories = storiesOf('domains/account/ui-your-current-plan/your-current-plan', module)
//     .addDecorator(withA11y)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsAccountUiYourCurrentPlanModule]
//         })
//     )
//     .addDecorator(withKnobs)
//     .addDecorator(withTranslation)
//     .addDecorator(withCommonDependencies);
//
// stories.add('full price', () => ({
//     component: YourCurrentPlanComponent,
//     props: {
//         planData: {
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             price: 500,
//             termLength: 12,
//             type: 'SELF_PAID'
//         }
//     }
// }));
//
// stories.add('promotion', () => ({
//     component: YourCurrentPlanComponent,
//     props: {
//         planData: {
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             type: 'PROMO',
//             termLength: 6,
//             price: 5.96,
//             endDate: '05/31/2020'
//         }
//     }
// }));
//
// stories.add('trial', () => ({
//     component: YourCurrentPlanComponent,
//     props: {
//         planData: {
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             type: 'TRIAL',
//             price: 0,
//             endDate: '05/31/2020'
//         }
//     }
// }));
//
// stories.add('full price - in Canada (ROC)', () => ({
//     component: YourCurrentPlanComponent,
//     providers: [{ provide: SettingsService, useValue: { dateFormat: 'dd/MM/y', isCanadaMode: true, settings: { country: 'ca' } } }],
//     props: {
//         planData: {
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             price: 500,
//             termLength: 12,
//             type: 'SELF_PAID',
//             isCanada: true
//         }
//     }
// }));
//
// stories.add('promotion - in Canada (ROC)', () => ({
//     component: YourCurrentPlanComponent,
//     providers: [{ provide: SettingsService, useValue: { dateFormat: 'dd/MM/y', isCanadaMode: true, settings: { country: 'ca' } } }],
//     props: {
//         planData: {
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             type: 'PROMO',
//             termLength: 6,
//             price: 5.96,
//             endDate: '05/31/2020',
//             isCanada: true
//         }
//     }
// }));
//
// stories.add('promotion (MCP) - in Canada (ROC)', () => ({
//     component: YourCurrentPlanComponent,
//     providers: [{ provide: SettingsService, useValue: { dateFormat: 'dd/MM/y', isCanadaMode: true, settings: { country: 'ca' } } }],
//     props: {
//         planData: {
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             type: 'PROMO_MCP',
//             termLength: 6,
//             price: 5.96,
//             endDate: '05/31/2020',
//             isCanada: true,
//             isMCP: true
//         }
//     }
// }));
//
// stories.add('trial - in Canada (ROC)', () => ({
//     component: YourCurrentPlanComponent,
//     providers: [{ provide: SettingsService, useValue: { dateFormat: 'dd/MM/y', isCanadaMode: true, settings: { country: 'ca' } } }],
//     props: {
//         planData: {
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             type: 'TRIAL',
//             price: 0,
//             endDate: '05/31/2020',
//             isCanada: true
//         }
//     }
// }));
//
// stories.add('full price - in Canada (QC)', () => ({
//     component: YourCurrentPlanComponent,
//     providers: [{ provide: SettingsService, useValue: { dateFormat: 'dd/MM/y', isCanadaMode: true, settings: { country: 'ca' } } }],
//     props: {
//         planData: {
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             price: 500,
//             termLength: 12,
//             type: 'SELF_PAID',
//             isCanada: true,
//             isQuebec: true
//         }
//     }
// }));
//
// stories.add('promotion - in Canada (QC)', () => ({
//     component: YourCurrentPlanComponent,
//     providers: [{ provide: SettingsService, useValue: { dateFormat: 'dd/MM/y', isCanadaMode: true, settings: { country: 'ca' } } }],
//     props: {
//         planData: {
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             type: 'PROMO',
//             termLength: 6,
//             price: 5.96,
//             endDate: Date.now(),
//             isCanada: true,
//             isQuebec: true
//         }
//     }
// }));
//
// stories.add('promotion (MCP) - in Canada (QC)', () => ({
//     component: YourCurrentPlanComponent,
//     providers: [{ provide: SettingsService, useValue: { dateFormat: 'dd/MM/y', isCanadaMode: true, settings: { country: 'ca' } } }],
//     props: {
//         planData: {
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             type: 'PROMO_MCP',
//             termLength: 6,
//             price: 5.96,
//             endDate: Date.now(),
//             isCanada: true,
//             isQuebec: true,
//             isMCP: true
//         }
//     }
// }));
//
// stories.add('trial - in Canada (QC)', () => ({
//     component: YourCurrentPlanComponent,
//     providers: [{ provide: SettingsService, useValue: { dateFormat: 'dd/MM/y', isCanadaMode: true, settings: { country: 'ca' } } }],
//     props: {
//         planData: {
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             type: 'TRIAL',
//             price: 0,
//             endDate: '05/31/2020',
//             isCanada: true,
//             isQuebec: true
//         }
//     }
// }));
