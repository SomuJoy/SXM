// TODO: STORYBOOK_AUDIT

// import { CommonModule } from '@angular/common';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs, boolean } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { VehicleInfoTranslatePipe } from './vehicle-info-translate.pipe';
//
// const story = storiesOf('domains/vehicle-info', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [CommonModule],
//             declarations: [VehicleInfoTranslatePipe]
//         })
//     );
// story.add('pipe: vehicle info translate pipe ', () => ({
//     template: `
//             {{
//                 vehicleInfo | vehicleInfoTranslate: {
//                     isFrench:  isFrench
//                 }
//             }}
//         `,
//     props: {
//         isFrench: boolean('@Input isFrench', false),
//         vehicleInfo: {
//             year: 2018,
//             make: 'Toyota',
//             model: 'Camry'
//         }
//     }
// }));
