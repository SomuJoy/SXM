// TODO: STORYBOOK_AUDIT

// import { DeCareUseCasesTrialActivationUiSl2cFormModule } from '../de-care-use-cases-trial-activation-ui-sl2c-form.module';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withCommonDependencies, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { Sl2cFormComponent } from './sl2c-form.component';
// import { NgControl } from '@angular/forms';
// import { provideMockStore } from '@ngrx/store/testing';
//
// const stories = storiesOf('de-care-use-cases/trial-activation/ui-sl2c-form', module)
//     .addDecorator(withA11y)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DeCareUseCasesTrialActivationUiSl2cFormModule],
//             providers: [NgControl]
//         })
//     )
//     .addDecorator(withKnobs)
//     .addDecorator(withTranslation)
//     .addDecorator(withCommonDependencies);
//
// stories.add('default', () => ({
//     moduleMetadata: {
//         providers: [
//             provideMockStore({
//                 initialState: {
//                     appSettings: {
//                         country: 'us'
//                     },
//                     customerLocale: {
//                         province: '',
//                         provinceSelectionDisabled: true,
//                         provinceSelectionVisible: true,
//                         language: 'en-US',
//                         provinces: []
//                     }
//                 }
//             })
//         ]
//     },
//     component: Sl2cFormComponent
// }));
