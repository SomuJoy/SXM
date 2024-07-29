import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { TRANSLATE_PROVIDERS } from '@de-care/shared/storybook/util-helpers';
import { SharedSxmUiUiDotProgressBarStepperModule } from '../shared-sxm-ui-ui-dot-progress-bar-stepper.module';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { action } from '@storybook/addon-actions';

export const stories = storiesOf('Component Library/Common/Steppers/DotProgressBarStepper', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiUiDotProgressBarStepperModule, SharedSxmUiUiStepperModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    );

stories.add('default', () => ({
    template: `
        <div style="max-width: 500px;">
            <sxm-ui-dot-progress-bar-stepper #stepper>
                <sxm-ui-dot-progress-bar-step id="step1" (active)="stepActive($event)" (subStepActive)="subStepActive($event)">
                    <h4>[Step 1 content]</h4>
                    <sxm-ui-stepper class="subStepper" #subStepper style="display: block; padding: 16px">
                        <sxm-ui-step id="step1-1">
                            <h4>Step 1-1</h4>
                            <button class="button primary" (click)="subStepper.next()">sub step Continue</button>
                            <button class="button secondary" (click)="subStepper.previous()">sub step Go Back</button>
                        </sxm-ui-step>
                        <sxm-ui-step id="step1-2">
                            <h4>Step 1-2</h4>
                            <button class="button primary" (click)="subStepper.next()">sub step Continue</button>
                            <button class="button secondary" (click)="subStepper.previous()">sub step Go Back</button>
                        </sxm-ui-step>
                    </sxm-ui-stepper>
                    <button class="button primary" (click)="stepper.next()">Continue</button>
                    <button class="button secondary" (click)="stepper.previous()">Go Back</button>
                </sxm-ui-dot-progress-bar-step>
                <sxm-ui-dot-progress-bar-step id="step2" (active)="stepActive($event)">
                    <h4>[Step 2 content]</h4>
                    <button class="button primary" (click)="stepper.next()">Continue</button>
                    <button class="button secondary" (click)="stepper.previous()">Go Back</button>
                </sxm-ui-dot-progress-bar-step>
                <sxm-ui-dot-progress-bar-step id="step3" (active)="stepActive($event)">
                    <h4>[Step 3 content]</h4>
                    <button class="button primary" (click)="stepper.next()">Continue</button>
                    <button class="button secondary" (click)="stepper.previous()">Go Back</button>
                </sxm-ui-dot-progress-bar-step>
            </sxm-ui-dot-progress-bar-stepper>
        </div>
    `,
    props: {
        stepActive: action('@Output() stepActive emitted'),
        subStepActive: action('@Output() subStepActive emitted'),
    },
}));

stories.add('no substeps', () => ({
    template: `
        <div style="max-width: 500px;">
            <sxm-ui-dot-progress-bar-stepper #stepper>
                <sxm-ui-dot-progress-bar-step id="step1" (active)="stepActive($event)" (subStepActive)="subStepActive($event)">
                    <h4>[Step 1 content]</h4>
                    <button class="button primary" (click)="stepper.next()">Continue</button>
                    <button class="button secondary" (click)="stepper.previous()">Go Back</button>
                </sxm-ui-dot-progress-bar-step>
                <sxm-ui-dot-progress-bar-step id="step2" (active)="stepActive($event)">
                    <h4>[Step 2 content]</h4>
                    <button class="button primary" (click)="stepper.next()">Continue</button>
                    <button class="button secondary" (click)="stepper.previous()">Go Back</button>
                </sxm-ui-dot-progress-bar-step>
                <sxm-ui-dot-progress-bar-step id="step3" (active)="stepActive($event)">
                    <h4>[Step 3 content]</h4>
                    <button class="button primary" (click)="stepper.next()">Continue</button>
                    <button class="button secondary" (click)="stepper.previous()">Go Back</button>
                </sxm-ui-dot-progress-bar-step>
            </sxm-ui-dot-progress-bar-stepper>
        </div>
    `,
    props: {
        stepActive: action('@Output() stepActive emitted'),
        subStepActive: action('@Output() subStepActive emitted'),
    },
}));
