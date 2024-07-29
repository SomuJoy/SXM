import {
    Component,
    ChangeDetectionStrategy,
    OnInit,
    AfterViewInit,
    ContentChildren,
    QueryList,
    ChangeDetectorRef,
    Output,
    Input,
    EventEmitter,
    ElementRef,
} from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';
import { timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DotProgressBarStepComponent } from './dot-progress-bar-step.component';
import { Directionality } from '@angular/cdk/bidi';

interface DotProgressBarStep {
    subSteps: any[];
}
interface StepData {
    step: number;
    subStep?: number;
}
@Component({
    selector: 'sxm-ui-dot-progress-bar-stepper',
    templateUrl: './dot-progress-bar-stepper.component.html',
    styleUrls: ['./dot-progress-bar-stepper.component.scss'],
    providers: [{ provide: CdkStepper, useExisting: DotProgressBarStepperComponent }],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DotProgressBarStepperComponent extends CdkStepper implements OnInit, AfterViewInit {
    translateKey = 'sharedSxmUiUiDotProgressBarStepperModule.dotProgressBarStepperComponent.STEPPER_PROGRESS';
    dotProgressBarSteps: DotProgressBarStep[];
    dotProgressBarData: StepData;
    @ContentChildren(DotProgressBarStepComponent) stepList: QueryList<DotProgressBarStepComponent>;
    @Input() staticStepData: StepData;
    @Output() handleStepChange = new EventEmitter<any>();
    constructor(_dir: Directionality, _changeDetectorRef: ChangeDetectorRef, _elementRef: ElementRef, private readonly _dotProgressChangeDetectorRef: ChangeDetectorRef) {
        super(_dir, _changeDetectorRef, _elementRef);
    }

    ngOnInit() {
        this.selectionChange.pipe(takeUntil(this._destroyed)).subscribe((evt) => {
            const progressStep = evt.selectedStep as DotProgressBarStepComponent;
            if ((evt.selectedStep as DotProgressBarStepComponent).subStepper) {
                // TODO: Each step retains the selected subStep, change if this is not the desired behavior
                const selectedSubStep = (evt.selectedStep as DotProgressBarStepComponent).subStepper.selectedIndex;
                this.dotProgressBarData = { step: evt.selectedIndex + 1, subStep: selectedSubStep + 1 };
            } else {
                this.dotProgressBarData = { step: evt.selectedIndex + 1 };
            }
            this.handleStepChange.emit(this.dotProgressBarData);
            progressStep.active.emit(true);
        });
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
        this.dotProgressBarSteps = this.stepList.map((item) => {
            // check for a subStepper
            if (item.subStepper) {
                // subscribing to dotProgressBarStep subStepActive observable which fires when a subStep changes
                item.subStepActive.pipe(takeUntil(this._destroyed)).subscribe((index) => {
                    this.dotProgressBarData = { step: this.selectedIndex + 1, subStep: index + 1 };
                    this.handleStepChange.emit(this.dotProgressBarData);
                    this._dotProgressChangeDetectorRef.markForCheck();
                });
                // checking for initial subStep
                if (item.subStepper.selected) {
                    this.dotProgressBarData = { step: this.selectedIndex + 1, subStep: item.subStepper.selectedIndex + 1 };
                    this._dotProgressChangeDetectorRef.markForCheck();
                }
                return { subSteps: item.subStepper.steps.toArray() };
            } else {
                return { subSteps: [] };
            }
        });
        if (this.staticStepData) {
            this.dotProgressBarData = { step: this.selectedIndex + 1 };
            timer(500).subscribe(() => {
                const subStepItem = this.staticStepData.subStep ? { subStep: this.staticStepData.subStep } : {};
                this.dotProgressBarData = { step: this.staticStepData.step, ...subStepItem };
                const step = this.stepList.get(this.staticStepData.step - 1);
                this.selected = step;
                // checking for substep
                if (step.subStepper && this.staticStepData.subStep) {
                    step.subStepper.selected = step.subStepper.steps.get(this.staticStepData.subStep - 1);
                }
            });
        } else {
            if (this.selected) {
                this.dotProgressBarData = { step: this.selectedIndex + 1 };
                (this.selected as DotProgressBarStepComponent).active.emit(true);
            }
        }
        this._dotProgressChangeDetectorRef.detectChanges();
    }
    //TODO: This stepper may have to determine if there are subSteps and traverse them with next() and previous()
}
