import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

interface DotProgressBarStep {
    subSteps?: any[];
}
@Component({
    selector: 'sxm-ui-dot-progress-bar',
    templateUrl: './dot-progress-bar.component.html',
    styleUrls: ['./dot-progress-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DotProgressBarComponent {
    @Input() steps: DotProgressBarStep[];
    @Input()
    get currentStepData() {
        return { step: this._currentStep, subStep: this._currentSubStep };
    }
    set currentStepData(stepData: { step: number; subStep?: number }) {
        if (stepData) {
            this._currentStep = Math.min(Math.max(1, stepData.step), this.steps?.length);
            this._currentSubStep =
                this.steps[this._currentStep - 1]?.subSteps.length > 0 ? Math.min(Math.max(1, stepData.subStep ?? 1), this.steps[this._currentStep - 1].subSteps.length) : 1;
            this.progressWidth = this._calcProgressWidth(this._currentStep, this._currentSubStep);
        }
    }

    _currentStep: number;
    _currentSubStep: number;
    progressWidth: string;

    constructor() {}

    private _calcProgressWidth(step: number, subStep: number): string {
        const stepPercentage = `((100% - 20px) / ${this.steps.length - 1})`;
        const subStepLength = this.steps[step - 1]?.subSteps?.length > 0 ? this.steps[step - 1]?.subSteps?.length : 1;
        return `calc((${step - 1} * ${stepPercentage}) + ((${stepPercentage} - 20px) / ${subStepLength} * ${subStep - 1}) + 20px)`;
    }
}
