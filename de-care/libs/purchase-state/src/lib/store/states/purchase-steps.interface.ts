import { TemplateRef } from '@angular/core';
import { PurchaseStepEnum } from '@de-care/data-services';

export interface PurchaseStep {
    titleKey: string;
    templates: {
        active: TemplateRef<any>;
        inactive?: TemplateRef<any>;
        before?: TemplateRef<any>;
    };
    id: PurchaseStepEnum;
    qatag: string;
}
