// ===============================================================================
// Importes

//********************************************************************************

export interface AppRootState {
    sessionTimedOut: boolean;
}

// Initial state
export const initialAppRootState: AppRootState = {
    sessionTimedOut: false
};
