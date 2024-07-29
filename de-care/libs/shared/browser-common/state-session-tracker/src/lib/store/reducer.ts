// ===============================================================================
// Internal Features (Store)
import * as fromAppRoot from './actions';
import { initialAppRootState, AppRootState } from './state';

// ===============================================================================
// Imported Features (Account)

/* Reducer for the AppRoot Collection (AppRootState)
 * @param state The AppRootState to update; initial state if not supplied
 * @param action AppRootAction to perform.
 * At runtime will be any action dispatched to the store. */
export function appRootReducer(
    state = initialAppRootState,
    action: fromAppRoot.AppRootActions // Only interested in the AppRootActions.
): AppRootState {
    // Must return AppRootState!

    // Every action has a type
    switch (action.type) {
        case fromAppRoot.SESSION_TIMED_OUT: {
            return {
                ...state,
                sessionTimedOut: true
            };
        }
    }

    // Action wasn't a AppRootAction (at least not one we processed)
    // Always return the original state by default.
    return state;
}
