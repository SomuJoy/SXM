import { Component, ContentChildren, Input, QueryList, OnInit } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';
import { SxmUiAccordionStepComponent } from './accordion-step.component';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'sxm-ui-accordion-stepper',
    templateUrl: './accordion-stepper.component.html',
    styleUrls: ['./accordion-stepper.component.scss'],
    providers: [{ provide: CdkStepper, useExisting: SxmUiAccordionStepperComponent }],
})
export class SxmUiAccordionStepperComponent extends CdkStepper implements OnInit {
    @Input() dataGroup: string;
    @Input() showStepHeader: boolean = false;
    @ContentChildren(SxmUiAccordionStepComponent) accordionSteps: QueryList<SxmUiAccordionStepComponent>;
    stepNumber: number;
    translateKey = 'sharedSxmUiUiAccordionStepperModule.sxmUiAccordionStepperComponent.';

    ngOnInit() {
        this.selectionChange.pipe(takeUntil(this._destroyed)).subscribe((step) => {
            const accordionStep = step.selectedStep as SxmUiAccordionStepComponent;
            this.stepNumber = step.selectedIndex;
            accordionStep.active.emit(true);
        });
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
        if (this.selected) {
            (this.selected as SxmUiAccordionStepComponent).active.emit(true);
        }
    }
}
