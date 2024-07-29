// ===============================================================================
// Angular
import { Inject, Injectable } from '@angular/core';
import { DeCareEnvironmentToken, DeCareEnvironment } from '@de-care/de-care/shared/environment';

import { IAppDynamicsError } from '../core.interface';

// ===============================================================================
// Global Declares
//declare var ADRUM: any;

//********************************************************************************
@Injectable({
    providedIn: 'root'
})
export class CoreAppDynLoggerService {
    constructor(@Inject(DeCareEnvironmentToken) private readonly _environment: DeCareEnvironment) {}
    //================================================
    //===            Public Functions              ===
    //================================================
    error(error: IAppDynamicsError): void {
        if (!this._environment.appDynamicsReport) {
            return;
        }

        try {
            // const errorT = new ADRUM.events.Error({
            //     msg: error.message,
            //     line: error.line
            // });

            // ADRUM.report(errorT);

            /* tslint:disable */
            console.warn(`Error log was reported to AppDynamics.`);
            /* tslint:enable */
        } catch (err) {
            /* tslint:disable */
            console.error(`Failed to report to AppDynamics.  Error: `, err);
            /* tslint:enable */
        }
    }
}
