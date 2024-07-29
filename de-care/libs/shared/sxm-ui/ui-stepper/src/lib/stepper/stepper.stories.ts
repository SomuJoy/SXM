import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { SharedSxmUiUiStepperModule } from '../shared-sxm-ui-ui-stepper.module';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';

const stories = storiesOf('Component Library/Common/Steppers/Stepper', module)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiUiStepperModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    )
    .addDecorator(withA11y)
    .addDecorator(withTranslation);

stories.add('default', () => ({
    template: `
        <div style="max-width: 500px;">
            <sxm-ui-stepper #stepper>
                <sxm-ui-step id="step1">
                    <h4>Step 1</h4>
                    <button class="button primary" (click)="stepper.next()">Continue</button>
                    <button class="button secondary" (click)="stepper.previous()">Go Back</button>
                </sxm-ui-step>
                <sxm-ui-step id="step2">
                    <h4>Step 2</h4>
                    <button class="button primary" (click)="stepper.next()">Continue</button>
                    <button class="button secondary" (click)="stepper.previous()">Go Back</button>
                </sxm-ui-step>
                <sxm-ui-step id="step3">
                    <h4>Step 3</h4>
                    <button class="button primary" (click)="stepper.next()">Continue</button>
                    <button class="button secondary" (click)="stepper.previous()">Go Back</button>
                </sxm-ui-step>
            </sxm-ui-stepper>
        </div>
    `,
}));
