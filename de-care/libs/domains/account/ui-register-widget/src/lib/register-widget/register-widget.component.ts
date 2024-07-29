import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { RegisterDataModel, SecurityQuestionsModel } from '@de-care/domains/account/state-account';
import { MinimumAccountData, PasswordError, RegisterCredentialsState } from '@de-care/domains/account/ui-register';
import { select, Store } from '@ngrx/store';
import { TwoFactorAuthModalComponent, TwoFactorAuthModalComponentApi } from '@de-care/domains/account/ui-two-factor-auth';
import { getTwoFactorAuthData, twoFactorAuthDataNeeded } from '@de-care/domains/account/state-register-widget';
import { filter, take } from 'rxjs/operators';

@Component({
    selector: 'ui-register-widget',
    templateUrl: './register-widget.component.html',
    styleUrls: ['./register-widget.component.scss']
})
export class UiRegisterWidgetComponent {
    @Input() securityQuestions: SecurityQuestionsModel[];
    @Input() registrationCompleted: boolean;
    @Input() account: MinimumAccountData;
    @Input() passwordError: PasswordError;
    @Input() credentialState: RegisterCredentialsState = RegisterCredentialsState.All;
    @Input() isTrialActivation: boolean;

    @Output() register: EventEmitter<RegisterDataModel> = new EventEmitter<RegisterDataModel>();
    @Output() registerClicked: EventEmitter<any> = new EventEmitter<any>();
    private _needsTwoFactorAuth: boolean;

    @Input() set needsTwoFactorAuth(isTwoFactorAuthNeeded: boolean) {
        this._needsTwoFactorAuth = isTwoFactorAuthNeeded;
        if (isTwoFactorAuthNeeded) {
            this._store.dispatch(twoFactorAuthDataNeeded());
        }
    }

    get needsTwoFactorAuth(): boolean {
        return this._needsTwoFactorAuth;
    }

    @ViewChild(TwoFactorAuthModalComponent) twoFactorAuthModal: TwoFactorAuthModalComponentApi;

    private registerData: RegisterDataModel;

    constructor(private readonly _store: Store) {}

    process(data: RegisterDataModel): void {
        this.registerData = data;
        this.needsTwoFactorAuth ? this._getTwofactorAuthData() : this.completed();
    }

    completed(): void {
        this.register.emit(this.registerData);
    }

    private _getTwofactorAuthData(): void {
        this._store
            .pipe(
                select(getTwoFactorAuthData),
                filter(response => !!response),
                take(1)
            )
            .subscribe(response => {
                this.twoFactorAuthModal.start(response);
            });
    }
}
