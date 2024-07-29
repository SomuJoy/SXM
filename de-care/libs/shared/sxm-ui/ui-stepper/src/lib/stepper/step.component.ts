import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CdkStep } from '@angular/cdk/stepper';

@Component({
    selector: 'sxm-ui-step',
    template: `
        <ng-template><ng-content></ng-content></ng-template>
    `,
    providers: [{ provide: CdkStep, useExisting: SxmUiStepComponent }]
})
export class SxmUiStepComponent extends CdkStep {
    @Input() id: string;
    @Output() active = new EventEmitter<boolean>();
}
