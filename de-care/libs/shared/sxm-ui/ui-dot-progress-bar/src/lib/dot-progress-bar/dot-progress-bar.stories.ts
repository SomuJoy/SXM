import { withKnobs, number } from '@storybook/addon-knobs';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { DotProgressBarComponent } from './dot-progress-bar.component';

export const stories = storiesOf('Component Library/Common/Steppers/DotProgressBar', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            declarations: [DotProgressBarComponent],
        })
    );

const stepsNoSubSteps = [{ subSteps: [] }, { subSteps: [] }, { subSteps: [] }];
const stepsWithSubSteps = [{ subSteps: [null, null] }, { subSteps: [null, null, null] }, { subSteps: [] }];
const stepsMixed = [{ subSteps: [null, null] }, { subSteps: [] }, { subSteps: [null, null, null] }, { subSteps: [] }];

stories.add(`${stepsNoSubSteps.length} Steps`, () => ({
    template: `
        <div style = "padding: 20px;">
            <sxm-ui-dot-progress-bar  [currentStepData]="{step: step, subStep: 1}" [steps]="steps"></sxm-ui-dot-progress-bar>
        </div>
    `,
    props: {
        steps: stepsNoSubSteps,
        step: number('@Input {step: step}', 1, { min: 1, max: stepsNoSubSteps.length, range: true }),
    },
}));

stories.add(`${stepsWithSubSteps.length} Steps with subSteps`, () => ({
    template: `
        <div style = "padding: 20px;">
            <sxm-ui-dot-progress-bar  [currentStepData]="{ step: step, subStep: subStep }" [steps]="steps"></sxm-ui-dot-progress-bar>
        </div>
    `,
    props: {
        steps: stepsWithSubSteps,
        step: number('@Input {step: step}', 1, { min: 1, max: stepsNoSubSteps.length, range: true }),
        subStep: number('@Input {subStep: subStep}', 1),
    },
}));

stories.add(`${stepsMixed.length} Steps mixed`, () => ({
    template: `
        <div style = "padding: 20px;">
            <sxm-ui-dot-progress-bar  [currentStepData]="{ step: step, subStep: subStep }" [steps]="steps"></sxm-ui-dot-progress-bar>
        </div>
    `,
    props: {
        steps: stepsMixed,
        step: number('@Input {step: step}', 1, { min: 1, max: stepsMixed.length, range: true }),
        subStep: number('@Input {subStep: subStep}', 1),
    },
}));
