// ===============================================================================
// Libs: Ngrx Packages
import { Action } from '@ngrx/store';

//================================================
//===     Action Types Constants (AppRoot)    ===
//================================================

export const SESSION_TIMED_OUT = '[AppRoot] Session Timed Out';

export const SYSTEM_ERROR = '[AppRoot] System Error';

//================================================
//===             Action Creators              ===
//================================================
export class SessionTimedOut implements Action {
    readonly type = SESSION_TIMED_OUT;
}

export class SystemError implements Action {
    readonly type = SYSTEM_ERROR;
    constructor(public payload: any) {}
}

//================================================
//===              Union Action Type           ===
//================================================
/* Union type of all Action Creator classes */
export type AppRootActions = SessionTimedOut | SystemError;
