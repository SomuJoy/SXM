import { Component, AfterViewInit, ChangeDetectionStrategy, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectResellerCode, setLoginInfo, ProvisionAccountActivateWorkflowService } from '@de-care/de-care-use-cases/third-party-billing/state-provision-account';
import { LoginFormInfo } from '@de-care/domains/account/ui-login-form-fields';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SxmUiStepperComponent } from '@de-care/shared/sxm-ui/ui-stepper';
import { Subject, BehaviorSubject, of } from 'rxjs';
import { behaviorEventImpressionForPage, behaviorEventImpressionForComponent, behaviorEventReactionForCustomerType } from '@de-care/shared/state-behavior-events';
import { TranslateService } from '@ngx-translate/core';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';

@Component({
    selector: 'de-care-third-party-billig-setup-account',
    templateUrl: './setup-account.component.html',
    styleUrls: ['./setup-account.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupAccountComponent implements AfterViewInit, OnInit, OnDestroy {
    translateKeyPrefix = 'deCareUseCasesThirdPartyBillingModule.setupAccountComponent';
    translateRootKeyPrefix = 'deCareUseCasesThirdPartyBillingModule';

    resellerName$ = this._store
        .select(selectResellerCode)
        .pipe(switchMap((_resellerCode) => this._translateService.stream(`${this.translateRootKeyPrefix}.${_resellerCode}.NAME`)));

    resellerURL$ = this._store
        .select(selectResellerCode)
        .pipe(switchMap((_resellerCode) => this._translateService.stream(`${this.translateRootKeyPrefix}.${_resellerCode}.URL`)));

    loginFormInfo: LoginFormInfo;
    loginForm: FormGroup;
    loginFormSubmitted = false;
    personalInfoSubmitted = false;
    activationIsLoading$ = new BehaviorSubject<boolean>(false);

    @ViewChild('stepper', { static: true }) stepper: SxmUiStepperComponent;

    private readonly _unsubscribe$: Subject<void> = new Subject<void>();

    constructor(
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private readonly _provisionAccountActivateWorkflowService: ProvisionAccountActivateWorkflowService,
        private _translateService: TranslateService
    ) {}

    ngOnInit() {
        this._initLoginForm();
    }

    ngAfterViewInit() {
        this._store.dispatch(pageDataFinishedLoading());
    }

    setupAccountActive() {
        this._store.dispatch(behaviorEventReactionForCustomerType({ customerType: 'TBP' }));
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'thirdpartybilling', componentKey: 'TPBcredentialSetup' }));
    }

    confirmationStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'TPBsuccess' }));
    }

    ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    onLoginInfoContinue(): void {
        this.loginFormSubmitted = true;
        if (this.loginForm.pending) {
            this.activationIsLoading$.next(true);
            this.loginForm.statusChanges
                .pipe(
                    filter((status) => status !== 'PENDING'),
                    take(1),
                    takeUntil(this._unsubscribe$),
                    switchMap(() => {
                        if (this.loginForm.status === 'VALID') {
                            this._store.dispatch(setLoginInfo({ loginInfo: this.loginForm.value }));
                            return this._provisionAccountActivateWorkflowService.build();
                        }
                        return of(null);
                    })
                )
                .subscribe({
                    next: (isSuccess) => {
                        if (isSuccess) {
                            this.stepper.next();
                        }
                        this.activationIsLoading$.next(false);
                    },
                    error: () => this.activationIsLoading$.next(false),
                });
        } else if (this.loginForm.status === 'VALID') {
            this._store.dispatch(setLoginInfo({ loginInfo: this.loginForm.value }));
            this.activationIsLoading$.next(true);
            this._provisionAccountActivateWorkflowService.build().subscribe({
                next: (isSuccess) => {
                    if (isSuccess) {
                        this.stepper.next();
                    }
                    this.activationIsLoading$.next(false);
                },
                error: () => this.activationIsLoading$.next(false),
            });
        }
    }
    private _initLoginForm(): void {
        this.loginForm = this._formBuilder.group({});
        this.loginFormInfo = {
            verifyThirdParty: true,
            email: null,
            canEditEmail: true,
            parentForm: this.loginForm,
            passwordControlName: 'password',
            emailControlName: 'email',
        };
    }
}
