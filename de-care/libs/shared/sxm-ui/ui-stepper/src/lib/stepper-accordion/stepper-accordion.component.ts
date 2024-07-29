import { AfterViewInit, Component, ContentChildren, Input, OnInit, QueryList } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';
import { takeUntil } from 'rxjs/operators';
import { SxmUiStepAccordionComponent } from './step-accordion.component';

@Component({
    selector: 'sxm-ui-stepper-accordion',
    templateUrl: './stepper-accordion.component.html',
    styleUrls: ['./stepper-accordion.component.scss'],
    providers: [{ provide: CdkStepper, useExisting: SxmUiStepperAccordionComponent }],
})
export class SxmUiStepperAccordionComponent extends CdkStepper implements OnInit, AfterViewInit {
    translateKeyPrefix = 'SharedSxmUiUiStepperModule.SxmUiStepperAccordionComponent.';
    @Input() dataGroup: string;
    @ContentChildren(SxmUiStepAccordionComponent) stepList: QueryList<SxmUiStepAccordionComponent>;

    ngOnInit() {
        this.selectionChange.pipe(takeUntil(this._destroyed)).subscribe((step) => {
            const accordionStep = step.selectedStep as SxmUiStepAccordionComponent;
            accordionStep.active.emit(true);
        });
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
        if (this.selected) {
            (this.selected as SxmUiStepAccordionComponent).active.emit(true);
        }
    }
}
