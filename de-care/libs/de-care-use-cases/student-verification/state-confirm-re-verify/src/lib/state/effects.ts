import { selectReverifyGuardWorkflowState } from './selectors';
import { Injectable } from '@angular/core';
import { genericBehaviorEventReaction } from '@de-care/shared/state-behavior-events';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { reverifyGuardWorkflowComplete, reverifyGuardWorkflowReset } from './actions';
import { withLatestFrom, concatMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

enum StateConfirmReverifyEffectsEnum {
    AccountData = 'account',
    StudentReverificationStatus = 'student-reverification-status',
    PaymentInfo = 'PaymentInfo',
}
@Injectable({
    providedIn: 'root',
})
export class StateConfirmReverifyEffects {
    constructor(private _actions: Actions, private _store: Store) {}

    reverifyGuardWorkflowComplete$ = createEffect(() =>
        this._actions.pipe(
            ofType(reverifyGuardWorkflowComplete),
            withLatestFrom(this._store.select(selectReverifyGuardWorkflowState)),
            concatMap(([_, state]) => [
                // TODO: This genericBehaviorEventReaction was created to allow us to transition out of the old data layer coupling, but it still has too much high level coupling to the "dataLayer" concept.
                genericBehaviorEventReaction({
                    dataLayerKeyToUpdate: StateConfirmReverifyEffectsEnum.AccountData,
                    dataLayerPayloadToUpdate: {
                        studentReverification: {
                            verificationIdStatus: state.verificationIdStatus,
                            o2oStatus: state.o2oStatus,
                            changePlanStatus: state.changePlanStatus,
                            eligibility: state.eligibilityResult,
                        },
                    },
                    eventAction: StateConfirmReverifyEffectsEnum.StudentReverificationStatus,
                    eventData: { componentName: StateConfirmReverifyEffectsEnum.PaymentInfo }, // [TODO] Verify the component name in Launch
                }),
                reverifyGuardWorkflowReset(),
            ])
        )
    );
}
