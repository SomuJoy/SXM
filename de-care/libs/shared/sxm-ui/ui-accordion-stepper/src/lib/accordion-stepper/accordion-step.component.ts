import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CdkStep } from '@angular/cdk/stepper';

@Component({
    selector: 'sxm-ui-accordion-step',
    template: `
        <ng-template><ng-content></ng-content></ng-template>
    `,
    providers: [{ provide: CdkStep, useExisting: SxmUiAccordionStepComponent }]
})
export class SxmUiAccordionStepComponent extends CdkStep {
    @Input() editButtonLabel: string;
    @Input() id: string;
    @Output() editClicked = new EventEmitter<SxmUiAccordionStepComponent>();
    @Output() active = new EventEmitter<boolean>();
    @ContentChild('inactiveContent', { static: true }) inactiveContent: TemplateRef<any>;
}
