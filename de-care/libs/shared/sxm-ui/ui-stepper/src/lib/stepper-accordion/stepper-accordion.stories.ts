import { moduleMetadata, storiesOf } from '@storybook/angular';
import { SharedSxmUiUiStepperModule } from '../shared-sxm-ui-ui-stepper.module';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { withA11y } from '@storybook/addon-a11y';

const stories = storiesOf('Component Library/Common/Steppers/StepperAccordion', module)
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
        <sxm-ui-stepper-accordion #stepper>
            <sxm-ui-step-accordion label="First One">
                <button (click)="stepper.next()">Continue</button>
                <button (click)="stepper.previous()">Go Back</button>
            </sxm-ui-step-accordion>
            <sxm-ui-step-accordion label="Second One">
                <button (click)="stepper.next()">Continue</button>
                <button (click)="stepper.previous()">Go Back</button>
            </sxm-ui-step-accordion>
            <sxm-ui-step-accordion label="Third One">
                <button (click)="stepper.next()">Continue</button>
                <button (click)="stepper.previous()">Go Back</button>
            </sxm-ui-step-accordion>
        </sxm-ui-stepper-accordion>`,
}));

stories.add('with long labels', () => ({
    template: `
        <sxm-ui-stepper-accordion #stepper style="width: 300px;">
            <sxm-ui-step-accordion label="First One that is super duper long text that wraps">
                <button (click)="stepper.next()">Continue</button>
                <button (click)="stepper.previous()">Go Back</button>
            </sxm-ui-step-accordion>
            <sxm-ui-step-accordion label="Second One">
                <button (click)="stepper.next()">Continue</button>
                <button (click)="stepper.previous()">Go Back</button>
            </sxm-ui-step-accordion>
            <sxm-ui-step-accordion label="Third One that is super duper long text">
                <button (click)="stepper.next()">Continue</button>
                <button (click)="stepper.previous()">Go Back</button>
            </sxm-ui-step-accordion>
        </sxm-ui-stepper-accordion>`,
}));

stories.add('with inactive content', () => ({
    template: `
        <sxm-ui-stepper-accordion #stepper>
            <sxm-ui-step-accordion label="First One" #step>
                <ng-template #inactiveContent>Step completed!</ng-template>
                <button (click)="stepper.next()">Continue</button>
                <button (click)="stepper.previous()">Go Back</button>
            </sxm-ui-step-accordion>
            <sxm-ui-step-accordion label="Second One">
                <ng-template #inactiveContent>Step completed!</ng-template>
                <button (click)="stepper.next()">Continue</button>
                <button (click)="stepper.previous()">Go Back</button>
            </sxm-ui-step-accordion>
            <sxm-ui-step-accordion label="Third One">
                <ng-template #inactiveContent>Step completed!</ng-template>
                <button (click)="stepper.next()">Continue</button>
                <button (click)="stepper.previous()">Go Back</button>
            </sxm-ui-step-accordion>
        </sxm-ui-stepper-accordion>`,
}));

stories.add('with custom active header labels', () => ({
    template: `
        <sxm-ui-stepper-accordion #stepper>
            <sxm-ui-step-accordion label="First One" #step>
                <ng-template #activeHeader>Step {{ stepper.selectedIndex + 1 }} of {{ stepper.steps?.length }}</ng-template>
                <button (click)="stepper.next()">Continue</button>
                <button (click)="stepper.previous()">Go Back</button>
            </sxm-ui-step-accordion>
            <sxm-ui-step-accordion label="Second One">
                <ng-template #activeHeader>Step {{ stepper.selectedIndex + 1 }} of {{ stepper.steps?.length }}</ng-template>
                <button (click)="stepper.next()">Continue</button>
                <button (click)="stepper.previous()">Go Back</button>
            </sxm-ui-step-accordion>
            <sxm-ui-step-accordion label="Third One">
                <ng-template #activeHeader>Step {{ stepper.selectedIndex + 1 }} of {{ stepper.steps?.length }}</ng-template>
                <button (click)="stepper.next()">Continue</button>
                <button (click)="stepper.previous()">Go Back</button>
            </sxm-ui-step-accordion>
        </sxm-ui-stepper-accordion>`,
}));

stories.add('with custom inactive header labels', () => ({
    template: `
        <sxm-ui-stepper-accordion #stepper>
            <sxm-ui-step-accordion label="First One" #step>
                <ng-template #inactiveHeader>Step {{ stepper.selectedIndex + 1 }} completed</ng-template>
                <button (click)="stepper.next()">Continue</button>
                <button (click)="stepper.previous()">Go Back</button>
            </sxm-ui-step-accordion>
            <sxm-ui-step-accordion label="Second One">
                <ng-template #inactiveHeader>Step {{ stepper.selectedIndex + 1 }} completed</ng-template>
                <button (click)="stepper.next()">Continue</button>
                <button (click)="stepper.previous()">Go Back</button>
            </sxm-ui-step-accordion>
            <sxm-ui-step-accordion label="Third One">
                <ng-template #inactiveHeader>Step {{ stepper.selectedIndex + 1 }} completed</ng-template>
                <button (click)="stepper.next()">Continue</button>
                <button (click)="stepper.previous()">Go Back</button>
            </sxm-ui-step-accordion>
        </sxm-ui-stepper-accordion>`,
}));
