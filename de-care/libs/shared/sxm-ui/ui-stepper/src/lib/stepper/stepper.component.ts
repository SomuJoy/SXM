import { Component, ContentChildren, QueryList, OnInit, AfterViewInit } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';
import { SxmUiStepComponent } from './step.component';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'sxm-ui-stepper',
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.scss'],
    providers: [{ provide: CdkStepper, useExisting: SxmUiStepperComponent }]
})
export class SxmUiStepperComponent extends CdkStepper implements OnInit, AfterViewInit {
    @ContentChildren(SxmUiStepComponent) stepList: QueryList<SxmUiStepComponent>;
    ngOnInit() {
        this.selectionChange.pipe(takeUntil(this._destroyed)).subscribe(step => {
            const accordionStep = step.selectedStep as SxmUiStepComponent;
            accordionStep.active.emit(true);
        });
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
        if (this.selected) {
            (this.selected as SxmUiStepComponent).active.emit(true);
        }
    }
}
