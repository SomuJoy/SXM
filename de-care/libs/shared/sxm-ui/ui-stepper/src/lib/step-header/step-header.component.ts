import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'sxm-ui-step-header',
    template: `
        <header class="step-header">
            <sxm-ui-stepper-progress-breadcrumb [currentStepNumber]="currentStepNumber" [numberOfSteps]="numberOfSteps"></sxm-ui-stepper-progress-breadcrumb>
            <h1><ng-content select="[title]"></ng-content></h1>
            <div><ng-content select="[body]"></ng-content></div>
        </header>
    `,
    styleUrls: ['./step-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiStepHeaderComponent {
    @Input() currentStepNumber;
    @Input() numberOfSteps;
}
