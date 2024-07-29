import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'sxm-ui-stepper-progress-breadcrumb',
    template: `
        <p *ngIf="currentStepNumber && numberOfSteps" class="step-header">
            {{ translateKeyPrefix + 'STEPPER_PROGRESS' | translate: { currentStep: currentStepNumber, steps: numberOfSteps } }}
        </p>
    `,
    styleUrls: ['./stepper-progress-breadcrumb.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiStepperProgressBreadcrumbComponent {
    translateKeyPrefix = 'SharedSxmUiUiStepperModule.SxmUiStepperProgressBreadcrumbComponent.';
    @Input() currentStepNumber: number;
    @Input() numberOfSteps: number;
}
