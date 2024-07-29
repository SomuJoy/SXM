import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    FindAccountByFlepzWorkflowService,
    findAccountPageInitialized,
    findAccountPageRendered,
    backToSignInOverlay,
    selectFlepzData,
    selectInvalidEmailError,
    selectInvalidFirstNameError,
    clearInvalidEmailError,
    clearInvalidFirstNameError,
} from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { BehaviorSubject, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, map, take, tap } from 'rxjs/operators';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'find-account-page',
    templateUrl: './find-account-page.component.html',
    styleUrls: ['./find-account-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindAccountPageComponent implements OnInit, AfterViewInit, OnDestroy {
    private _translateSubscription: Subscription;
    isInvalidEmailError = this._store.select(selectInvalidEmailError);
    isInvalidFirstNameError = this._store.select(selectInvalidFirstNameError);

    translateKeyPrefix = 'DeStreamingOnboardingFeatureSetupCredentialsModule.FindAccountPageComponent.';
    form: FormGroup;
    lookupSubmitInitiated = false;
    loading$ = new BehaviorSubject(false);
    showSystemError$ = new BehaviorSubject(false);
    headlineAndInstructionsTranslateKeys$ = this._store.select(getNormalizedQueryParams).pipe(
        map(({ errorcode }) => {
            const keys = {
                headline: 'HEADLINE',
                instructions: 'INSTRUCTIONS',
            };
            if (errorcode === '127') {
                keys.headline = 'HEADLINE_CODE_127';
                keys.instructions = 'INSTRUCTIONS_CODE_127';
            }
            return keys;
        })
    );

    constructor(
        private readonly _formBuilder: FormBuilder,
        private readonly _store: Store,
        private readonly _findAccountByFlepzWorkflowService: FindAccountByFlepzWorkflowService,
        private readonly _translateService: TranslateService,
        private _titleService: Title
    ) {
        this._translateSubscription = this._translateService.stream(`${this.translateKeyPrefix}PAGE_TITLE`).subscribe((pageTitle) => {
            this._titleService.setTitle(pageTitle);
        });
    }
    ngOnDestroy() {
        this._translateSubscription?.unsubscribe();
    }

    ngOnInit() {
        this.form = this._formBuilder.group({
            flepz: this._formBuilder.control(''),
        });
        this._store
            .pipe(
                select(selectFlepzData),
                take(1),
                filter((flepzData) => !!flepzData),
                tap((flepzData) => {
                    this.form.patchValue(
                        {
                            flepz: { ...flepzData },
                        },
                        { emitEvent: false }
                    );
                })
            )
            .subscribe();
        this._store.dispatch(findAccountPageInitialized());
    }

    ngAfterViewInit(): void {
        this._store.dispatch(findAccountPageRendered());
    }

    onSignInClick() {
        this._store.dispatch(backToSignInOverlay());
    }

    onFormSubmit() {
        this.lookupSubmitInitiated = true;
        this.showSystemError$.next(false);
        this.isInvalidEmailError = this._store.select(clearInvalidEmailError);
        this.isInvalidFirstNameError = this._store.select(clearInvalidFirstNameError);
        this.form.markAllAsTouched();
        if (this.form.valid) {
            this.loading$.next(true);
            this._findAccountByFlepzWorkflowService.build(this.form.value.flepz).subscribe(
                () => {},
                (error) => {
                    if (error && error?.errorType) {
                        if (error?.errorType === 'BUSINESS') {
                            this.showSystemError$.next(true);
                        } else {
                            this.showSystemError$.next(true);
                        }
                    } else {
                        this.showSystemError$.next(true);
                    }
                    this.loading$.next(false);
                }
            );
        }
    }
}
