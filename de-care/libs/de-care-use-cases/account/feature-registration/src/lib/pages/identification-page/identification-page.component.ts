import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
    getFlepzSubmissionHasInvalidPhone,
    getFlepzSubmissionHasSystemError,
    getIsFlepzSubmissionInProgress,
    submitFlepzData,
} from '@de-care/de-care-use-cases/account/state-registration';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { select, Store } from '@ngrx/store';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
    selector: 'de-care-identification',
    templateUrl: './identification-page.component.html',
    styleUrls: ['./identification-page.component.scss'],
})
export class IdentificationPageComponent implements OnInit, AfterViewInit, OnDestroy {
    translateKeyPrefix = 'deCareUseCasesAccountFeatureRegistration.identificationPageComponent';
    form: FormGroup;
    lookupSubmitted$ = this._store.pipe(select(getIsFlepzSubmissionInProgress));
    lookupSubmitInitiated = false;
    isInvalidPhone$ = this._store.pipe(select(getFlepzSubmissionHasInvalidPhone));
    unexpectedSubmissionError$ = this._store.select(getFlepzSubmissionHasSystemError);

    private _translateSubscription: Subscription;
    translateKeyPrefixShared = 'deCareUseCasesAccountFeatureRegistration.Shared.';

    constructor(
        private readonly _formBuilder: FormBuilder,
        private readonly _store: Store,
        private readonly _translateService: TranslateService,
        private _titleService: Title
    ) {
        this._translateSubscription = this._translateService.stream(`${this.translateKeyPrefixShared}PAGE_TITLE`).subscribe((pageTitle) => {
            this._titleService.setTitle(pageTitle);
        });
    }

    ngOnInit(): void {
        this.form = this._formBuilder.group({ identification: new FormControl('') });
    }

    ngAfterViewInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'registration', componentKey: 'flepz' }));
    }
    ngOnDestroy() {
        this._translateSubscription?.unsubscribe();
    }

    onLookupSubmit() {
        this.lookupSubmitInitiated = true;
        this.form.markAllAsTouched();
        if (this.form.valid) {
            this._store.dispatch(submitFlepzData({ flepzData: this.form.value.identification }));
        }
    }
}
