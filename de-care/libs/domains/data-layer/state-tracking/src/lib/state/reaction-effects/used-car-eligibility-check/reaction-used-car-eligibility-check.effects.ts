import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { behaviorEventErrorFromBusinessLogic, behaviorEventReactionUsedCarEligibilityCheckErrorCode } from '@de-care/shared/state-behavior-events';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ReactionUsedCarEligibilityCheckEffects {
    constructor(private readonly _actions$: Actions) {}

    usedCarEligibilityCheckErrorCode$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventReactionUsedCarEligibilityCheckErrorCode),
            map(({ errorCode }) => {
                let message: string;
                const errorMessagePrefix: string = `Used car eligibility check failed with error code ${errorCode}: `;

                switch (errorCode) {
                    case '101':
                        message = `${errorMessagePrefix} The device associated with the RID provided does not have any OEM device branding.`;
                        break;

                    case '103':
                        message = `${errorMessagePrefix} The VIN provided did not have an RID associated with it.`;
                        break;

                    case '106':
                        message = `${errorMessagePrefix} The RID provided was not found in the system.`;
                        break;

                    case '107':
                        message = `${errorMessagePrefix} The RID provided already has a paid subscription associated with it.`;
                        break;

                    case '109':
                        message = `${errorMessagePrefix} The RID provided already has an active trial without a follow on plan.`;
                        break;

                    case '110':
                        message = `${errorMessagePrefix} The RID provided already has an active trial with a follow on plan.`;
                        break;

                    case '111':
                        message = `${errorMessagePrefix} The RID provided already has an active used car trial without a follow on plan.`;
                        break;

                    case '112':
                        message = `${errorMessagePrefix} The RID provided has an expired trial associated with it.`;
                        break;

                    case '113':
                        message = `${errorMessagePrefix} The RID provided is inactive, but has been active in the past 12 months. CNA matches the account info with which the radio is associated.`;
                        break;

                    case '114':
                        message = `${errorMessagePrefix} The RID provided is on a new car demo but not eligible for a trial and can't be activated online.`;
                        break;

                    case '3494':
                        message = `${errorMessagePrefix} An invalid RID or VIN was provided.`;
                        break;

                    case '5035':
                        message = `${errorMessagePrefix} The device associated with the RID provided is not audio capable.`;
                        break;

                    default:
                        message = `${errorMessagePrefix} unspecified business error`;
                }

                return behaviorEventErrorFromBusinessLogic({ message, errorCode });
            })
        )
    );
}
