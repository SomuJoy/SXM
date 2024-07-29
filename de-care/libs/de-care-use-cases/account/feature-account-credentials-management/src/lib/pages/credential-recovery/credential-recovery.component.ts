import { Component, OnInit, ViewChild } from '@angular/core';
import { RecoveryOptionSelection, SxmUiCredentialRecoveryComponent, RecoveryOptionFormComponentApi } from '@de-care/shared/sxm-ui/ui-credential-recovery-form-fields';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { getSrcQueryParam, processInboundQueryParams, setIsCredentialRecoveryFlow } from '@de-care/de-care-use-cases/account/state-account-credentials-management';
import { take } from 'rxjs/operators';
import { behaviorEventImpressionForComponent, behaviorEventReactionFeatureTransactionStarted } from '@de-care/shared/state-behavior-events';

@Component({
    selector: 'de-care-credential-recovery',
    templateUrl: './credential-recovery.component.html',
    styleUrls: ['./credential-recovery.component.scss'],
})
export class CredentialRecoveryComponent implements OnInit {
    @ViewChild(SxmUiCredentialRecoveryComponent) recoveryOptionFormComponentApi: RecoveryOptionFormComponentApi;

    constructor(private readonly _router: Router, private readonly _activatedRoute: ActivatedRoute, private _store: Store) {
        this._store.dispatch(setIsCredentialRecoveryFlow({ isCredentialRecoveryFlow: true }));
        this._store
            .select(getSrcQueryParam)
            .pipe(take(1))
            .subscribe((queryParams) => {
                if (queryParams === 'oac' || queryParams === 'sclogin') {
                    this._store.dispatch(processInboundQueryParams());
                }
                if (queryParams) {
                    if (queryParams === 'everestplayer' || queryParams === 'player') {
                        this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'credentialrecovery', flowVariation: 'streaming' }));
                    } else {
                        this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'credentialrecovery', flowVariation: queryParams }));
                    }
                } else {
                    this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'credentialrecovery' }));
                }
            });
    }

    ngOnInit(): void {
        console.log('Credential recovery landing page');
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'credrecoverylanding' }));
    }

    onRecoveryCredentialOptionSelected(deviceIdSelection: RecoveryOptionSelection) {
        this._navigateTo(deviceIdSelection?.recoveryOption === 'password' ? '../credentials/forgot-password' : '../credentials/forgot-username');
    }

    private _navigateTo(destination: string): void {
        this._router.navigate([destination], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' }).then(() => {
            this.recoveryOptionFormComponentApi.completedProcessing();
        });
    }
}
