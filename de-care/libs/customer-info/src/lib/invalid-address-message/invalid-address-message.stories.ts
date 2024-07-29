// TODO: STORYBOOK_AUDIT

// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { select, withKnobs } from '@storybook/addon-knobs';
// import { withTranslation, TRANSLATE_PROVIDERS, withMockSettings } from '@de-care/shared/storybook/util-helpers';
// import { TranslateModule } from '@ngx-translate/core';
// import { InvalidAddressMessageComponent } from './invalid-address-message.component';
// import { CustomerInfoModule } from '../customer-info.module';
// import { DataOfferService } from '@de-care/data-services';
// import { of } from 'rxjs';
//
// const stories = storiesOf('customer-info/invalid-address-message', module)
//     .addDecorator(
//         moduleMetadata({
//             imports: [TranslateModule.forRoot(), CustomerInfoModule],
//             providers: [...TRANSLATE_PROVIDERS, { provide: DataOfferService, useValue: { allPackageDescriptions: () => of([]) } }]
//         })
//     )
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     component: InvalidAddressMessageComponent,
//     props: {
//         addressType: select('@Input() addressType', { Billing: 'Billing', Service: 'Service' }, 'Billing')
//     }
// }));
