import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'de-care-cancel-reason',
    templateUrl: './cancel-reason.component.html',
    styleUrls: ['./cancel-reason.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelReasonComponent implements OnInit {
    @Input() loading: false;
    @Input() cancelReasons;
    @Output() reasonSubmitted = new EventEmitter<string>();

    cancelReasonForm: FormGroup;
    submitted = false;
    selectionErrorMessage: boolean = false;
    translateKeyPrefix = 'domainsCancellationUiCancel.cancelReasonComponent';

    constructor(private _formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.cancelReasonForm = this.buildForm();
    }

    private buildForm() {
        return this._formBuilder.group({ reason: ['', Validators.required] });
    }

    onSubmit(event: { preventDefault: () => void }): void {
        this.submitted = true;
        event.preventDefault();
        if (this.cancelReasonForm.valid) {
            this.selectionErrorMessage = false;
            this.reasonSubmitted.emit(this.cancelReasonForm.value.reason);
        } else {
            this.selectionErrorMessage = true;
        }
    }

    onReasonSelected() {
        this.selectionErrorMessage = false;
    }
}
