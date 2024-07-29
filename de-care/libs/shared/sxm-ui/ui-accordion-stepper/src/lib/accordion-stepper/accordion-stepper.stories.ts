import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { action } from '@storybook/addon-actions';
import { TRANSLATE_PROVIDERS } from '@de-care/shared/storybook/util-helpers';
import { SharedSxmUiUiAccordionStepperModule } from '../shared-sxm-ui-ui-accordion-stepper.module';

const stories = storiesOf('Component Library/Common/Steppers/AccordionStepper', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiUiAccordionStepperModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    );

stories.add('default', () => ({
    moduleMetadata: { imports: [CdkStepperModule] },
    template: `
        <div style="max-width: 500px;">
            <sxm-ui-accordion-stepper dataGroup="flow-steps" #stepper>
                <sxm-ui-accordion-step label="The First Step" editButtonLabel="Edit" id="accordion-step1" (editClicked)="stepEditClicked($event)">
                    <button (click)="stepper.next()">Continue</button>
                </sxm-ui-accordion-step>
                <sxm-ui-accordion-step label="The Second Step" editButtonLabel="Edit" id="accordion-step2" (editClicked)="stepEditClicked($event)">
                    <button (click)="stepper.next()">Continue</button>
                </sxm-ui-accordion-step>
                <sxm-ui-accordion-step label="The Third Step" editButtonLabel="Edit" id="accordion-step3" (editClicked)="stepEditClicked($event)">
                    <button (click)="stepper.next()">Continue</button>
                </sxm-ui-accordion-step>
            </sxm-ui-accordion-stepper>
        </div>
    `,
    props: {
        stepEditClicked: action('Step Edit Click Emitted'),
    },
}));

stories.add('with inactive step content', () => ({
    moduleMetadata: { imports: [CdkStepperModule] },
    template: `
        <div style="max-width: 500px;">
            <sxm-ui-accordion-stepper dataGroup="flow-steps" #stepper>
                <sxm-ui-accordion-step label="The First Step" editButtonLabel="Edit" id="accordion-step1" (editClicked)="stepEditClicked($event)">
                    <button (click)="stepper.next()">Continue</button>
                    <ng-template #inactiveContent>First step completed!</ng-template>
                </sxm-ui-accordion-step>
                <sxm-ui-accordion-step label="The Second Step" editButtonLabel="Edit" id="accordion-step2" (editClicked)="stepEditClicked($event)">
                    <button (click)="stepper.next()">Continue</button>
                    <ng-template #inactiveContent>Second step completed!</ng-template>
                </sxm-ui-accordion-step>
                <sxm-ui-accordion-step label="The Third Step" editButtonLabel="Edit" id="accordion-step3" (editClicked)="stepEditClicked($event)">
                    <button (click)="stepper.next()">Continue</button>
                </sxm-ui-accordion-step>
            </sxm-ui-accordion-stepper>
        </div>
    `,
    props: {
        stepEditClicked: action('Step Edit Click Emitted'),
    },
}));

stories.add('with step number header', () => ({
    moduleMetadata: { imports: [CdkStepperModule] },
    template: `
        <div style="max-width: 500px;">
            <sxm-ui-accordion-stepper dataGroup="flow-steps" [showStepHeader]="true" #stepper>
                <sxm-ui-accordion-step label="The First Step" editButtonLabel="Edit" id="accordion-step1" (editClicked)="stepEditClicked($event)">
                    <button (click)="stepper.next()">Continue</button>
                    <ng-template #inactiveContent>First step completed!</ng-template>
                </sxm-ui-accordion-step>
                <sxm-ui-accordion-step label="The Second Step" editButtonLabel="Edit" id="accordion-step2" (editClicked)="stepEditClicked($event)">
                    <button (click)="stepper.next()">Continue</button>
                    <ng-template #inactiveContent>Second step completed!</ng-template>
                </sxm-ui-accordion-step>
                <sxm-ui-accordion-step label="The Third Step" editButtonLabel="Edit" id="accordion-step3" (editClicked)="stepEditClicked($event)">
                    <button (click)="stepper.next()">Continue</button>
                </sxm-ui-accordion-step>
            </sxm-ui-accordion-stepper>
        </div>
    `,
    props: {
        stepEditClicked: action('Step Edit Click Emitted'),
    },
}));
