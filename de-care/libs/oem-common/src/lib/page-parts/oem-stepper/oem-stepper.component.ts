import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';

@Component({
    selector: 'oem-stepper',
    template: `
        <ng-container [ngTemplateOutlet]="selected.content"></ng-container>
    `,
    providers: [{ provide: CdkStepper, useExisting: OemStepperComponent }]
})
export class OemStepperComponent extends CdkStepper implements OnChanges {
    @Input() advanceStepper: boolean;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.advanceStepper.currentValue) {
            this.next();
        }
    }
}
