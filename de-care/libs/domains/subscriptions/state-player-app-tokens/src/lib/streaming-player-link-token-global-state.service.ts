import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { GenerateTokenFromAccountPresenceWorkflowService } from './workflows/generate-token-from-account-presence-workflow.service';
import { IDENTITY_PARAMETERS, IdentityParameters } from '@de-care/shared/configuration-tokens-identity-parameter';

@Injectable({ providedIn: 'root' })
export class StreamingPlayerLinkTokenGlobalStateService {
    token: string | null = null;
    credentialsNotSet = false;

    constructor(
        private readonly _generateTokenFromAccountPresenceWorkflowService: GenerateTokenFromAccountPresenceWorkflowService,
        @Inject(IDENTITY_PARAMETERS) private readonly _identityParameters: IdentityParameters
    ) {
        // TODO: add injected dependency that has logic to get atok/dtok and then use those in the .build call here if they exist
        //       Note - Want to have this from an injected dep so we have a way to change out that logic as needed without having this
        //              service have to know how to get atok/dtok.
        //              Also need to carefully consider how we want to provide these values. If we are using this in an Angular Element
        //              then we don't know what external site might be using it, so we can't ship external site specific logic in the
        //              Elements bundle, it needs to be something that is set up per site usage.
        this._generateTokenFromAccountPresenceWorkflowService
            .build({ atok: this._identityParameters.atok, dtok: this._identityParameters.dtok, radioid: this._identityParameters.radioid, act: this._identityParameters.act })
            .pipe(map((result) => result?.token))
            .subscribe({
                next: (result) => {
                    this.token = result;
                },
                error: (error) => {
                    if (error === 'SUBSCRIPTION_ID_FOUND_SXIR_CREDENTIAL_NOT_SET') {
                        this.credentialsNotSet = true;
                    }
                },
            });
        // TODO: add timer code to expire stored token value after X amount of minutes
    }
}
