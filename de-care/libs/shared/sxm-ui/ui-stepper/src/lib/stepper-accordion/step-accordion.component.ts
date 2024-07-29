import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CdkStep } from '@angular/cdk/stepper';

@Component({
    selector: 'sxm-ui-step-accordion',
    template: ` <ng-template><ng-content></ng-content></ng-template> `,
    providers: [{ provide: CdkStep, useExisting: SxmUiStepAccordionComponent }],
})
export class SxmUiStepAccordionComponent extends CdkStep {
    @Input() id: string;
    @Input() editButtonLabelOverride: string;
    @Output() active = new EventEmitter<boolean>();
    @Output() editClicked = new EventEmitter<SxmUiStepAccordionComponent>();
    @ContentChild('inactiveContent', { static: true }) inactiveContent: TemplateRef<any>;
    @ContentChild('activeHeader', { static: true }) activeHeader: TemplateRef<any>;
    @ContentChild('inactiveHeader', { static: true }) inactiveHeader: TemplateRef<any>;
}
