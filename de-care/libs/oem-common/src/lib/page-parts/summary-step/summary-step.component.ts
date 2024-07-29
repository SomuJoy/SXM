import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PackageModel, QuoteModel } from '@de-care/data-services';

export interface SummaryStepComponentApi {
    resetProcessingFlag: () => void;
}

@Component({
    selector: 'summary-step',
    templateUrl: './summary-step.component.html',
    styleUrls: ['./summary-step.component.scss']
})
export class SummaryStepComponent implements SummaryStepComponentApi {
    @Input() offer: PackageModel;
    @Input() quote: QuoteModel;
    @Input() isClosedRadio: boolean;
    @Output() completed = new EventEmitter<null>();

    agreementAccepted = false;
    submitted = false;
    processing = false;

    completeOrder(): void {
        this.submitted = true;
        this.processing = true;
        if (this.agreementAccepted) {
            this.completed.emit();
        } else {
            this.processing = false;
        }
    }

    resetProcessingFlag(): void {
        this.processing = false;
    }
}
