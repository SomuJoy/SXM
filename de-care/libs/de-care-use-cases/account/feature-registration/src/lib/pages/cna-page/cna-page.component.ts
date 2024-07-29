import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
    getCNAFormPreFillData,
    getCNAFormValidationError,
    setCNAFormData,
    setCNAFormDataOnSubmission,
    clearValidateAddresErrorOnModalClose,
    cnaIsLoading
} from '@de-care/de-care-use-cases/account/state-registration';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { CNAForm } from './cna-form';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import * as uuid from 'uuid/v4';
@Component({
    selector: 'de-care-cna-page',
    templateUrl: './cna-page.component.html',
    styleUrls: ['./cna-page.component.scss']
})
export class CnaPageComponent implements OnInit, AfterViewInit {
    translateKey = 'deCareUseCasesAccountFeatureRegistration.CNAComponent';
    form: CNAForm;
    formValidationError$ = this._store.select(getCNAFormValidationError);
    cnaIsLoading$ = this._store.select(cnaIsLoading);
    isCanada$ = this._store.select(getIsCanadaMode);
    cnaPageModalAriaDescribedbyTextId = uuid();

    @ViewChild('addressValidationModal', { static: true }) addressValidationModal: SxmUiModalComponent;

    constructor(private readonly _store: Store) {}

    ngOnInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.pipe(select(getCNAFormPreFillData), take(1)).subscribe(data => (this.form = new CNAForm(data.flepz, data.language, data.country)));
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'registration', componentKey: 'enterCNA' }));
    }

    validate(): void {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            this._store.dispatch(setCNAFormDataOnSubmission({ CNAFormData: this.form.value }));
        }
    }

    submit(): void {
        this._store.dispatch(setCNAFormData({ CNAFormData: this.form.value }));
    }

    closeAddressValidationModel(): void {
        this._store.dispatch(clearValidateAddresErrorOnModalClose());
    }
}
