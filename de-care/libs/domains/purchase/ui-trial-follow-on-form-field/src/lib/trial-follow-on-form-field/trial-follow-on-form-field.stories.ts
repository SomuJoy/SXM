// TODO: STORYBOOK_AUDIT

// import { action } from '@storybook/addon-actions';
// import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
// import { withKnobs } from '@storybook/addon-knobs';
// import { TrialFollowOnFormFieldComponent, FollowOnData } from './trial-follow-on-form-field.component';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { DomainsPurchaseUiTrialFollowOnFormFieldModule } from '@de-care/domains/purchase/ui-trial-follow-on-form-field';
// import { TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { SettingsService } from '@de-care/settings';
// import { DataOfferService } from '@de-care/data-services';
// import { of } from 'rxjs';
//
// const mockPackageName = 'SIR_IP_SA';
// const mockPrice = 9.99;
//
// const mockPackageDescriptions = {
//     provide: DataOfferService,
//     useValue: {
//         allPackageDescriptions: ({ locale }) => {
//             if (locale === 'fr_CA') {
//                 return of([{ name: 'FR:: Premier Streaming', packageName: mockPackageName }]);
//             } else {
//                 return of([{ name: 'Premier Streaming', packageName: mockPackageName }]);
//             }
//         }
//     }
// };
//
// const stories = storiesOf('domains/purchase/trial-follow-on-form-fields', module)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsPurchaseUiTrialFollowOnFormFieldModule],
//             providers: [...TRANSLATE_PROVIDERS, mockPackageDescriptions]
//         })
//     )
//     .addDecorator(withKnobs)
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     component: TrialFollowOnFormFieldComponent,
//     props: {
//         followOnData: { packageName: mockPackageName, pricePerMonth: mockPrice } as FollowOnData
//     }
// }));
//
// stories.add('in Canada', () => ({
//     component: TrialFollowOnFormFieldComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true
//                 }
//             }
//         ]
//     },
//     props: {
//         followOnData: { packageName: mockPackageName, pricePerMonth: mockPrice } as FollowOnData
//     }
// }));
//
// stories.add('in Canada French', () => ({
//     component: TrialFollowOnFormFieldComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true
//                 }
//             }
//         ]
//     },
//     props: {
//         followOnData: { packageName: mockPackageName, pricePerMonth: mockPrice } as FollowOnData
//     }
// }));
//
// stories.add('in a form', () => ({
//     template: `
//         <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)">
//             <trial-follow-on-form-field
//                 formControlName="acceptFollowOn"
//                 [followOnData]="followOnData"
//             >
//             </trial-follow-on-form-field>
//             <button type="submit">Submit</button>
//         </form>
//     `,
//     moduleMetadata: {
//         imports: [ReactiveFormsModule]
//     },
//     props: {
//         form: new FormGroup({ acceptFollowOn: new FormControl(false) }),
//         onSubmit: action('onSubmit'),
//         followOnData: { packageName: mockPackageName, pricePerMonth: mockPrice } as FollowOnData
//     }
// }));
