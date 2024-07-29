import { Component, Input } from '@angular/core';
import { CdkStep } from '@angular/cdk/stepper';
import { ComponentNameEnum } from '@de-care/data-services';

@Component({
    selector: 'oem-step',
    template: `
        <ng-template><ng-content></ng-content></ng-template>
    `,
    providers: [{ provide: CdkStep, useExisting: OemStepComponent }]
})
export class OemStepComponent extends CdkStep {
    @Input() dataLayerTitle: ComponentNameEnum;
}
