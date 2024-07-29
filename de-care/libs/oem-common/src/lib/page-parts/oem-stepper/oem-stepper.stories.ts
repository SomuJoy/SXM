// TODO: STORYBOOK_AUDIT

// import { OEM_COMMON_STORYBOOK_STORIES } from '../../oem-common.stories';
// import { boolean } from '@storybook/addon-knobs';
// import { OemStepperComponent } from './oem-stepper.component';
// import { CdkStepperModule } from '@angular/cdk/stepper';
//
// OEM_COMMON_STORYBOOK_STORIES.add('oem-stepper', () => ({
//     moduleMetadata: { imports: [CdkStepperModule] },
//     component: OemStepperComponent,
//     template: `
//         <oem-stepper [advanceStepper]="advanceStepper" #stepper>
//             <cdk-step>
//                 <h3>Step 1 Content</h3>
//
//                 <button (click)="stepper.next()">Subscribe Now</button>
//                 <br />
//                 <span>legal copy</span>
//             </cdk-step>
//             <cdk-step *ngIf="showUpsell"><h3>Step 2 Content</h3></cdk-step>
//             <cdk-step><h3>Step 3 Content</h3></cdk-step>
//         </oem-stepper>
//     `,
//     props: {
//         advanceStepper: boolean('@Input() advanceStepper', false)
//     }
// }));
