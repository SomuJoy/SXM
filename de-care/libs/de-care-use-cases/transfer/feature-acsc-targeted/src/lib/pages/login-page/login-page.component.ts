import { Component, AfterViewInit, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { Router } from '@angular/router';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { getShowLoginChat } from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';

@Component({
    selector: 'de-care-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit, AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.LoginPageComponent.';
    @Input() showChat: true;
    showLoginChat$ = this._store.pipe(select(getShowLoginChat));
    isProcessingLogin = false;

    constructor(private readonly _store: Store, private readonly _router: Router) {}

    ngOnInit(): void {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'acsc', componentKey: 'signin' }));
    }

    ngAfterViewInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
    }

    onLoginFetchedAccountNumber() {
        this.isProcessingLogin = true;
        this._router.navigate(['/transfer/radio/login-router']);
    }

    onLoginError() {
        this._router.navigate(['/error']);
    }

    onStartRegistration() {
        this._router.navigate(['/account/registration']);
    }
}
