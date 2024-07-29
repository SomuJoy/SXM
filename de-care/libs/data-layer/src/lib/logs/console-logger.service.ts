import { DeCareEnvironment, DeCareEnvironmentToken } from '@de-care/de-care/shared/environment';
// ===============================================================================
// Angular
import { Inject, Injectable } from '@angular/core';

// ===============================================================================
// Internal Features (Core)
import { CoreConstant } from '@de-care/shared/legacy-core/core-constants';
import { IAppDynamicsError } from '../core.interface';
import { CoreAppDynLoggerService } from './appdynamics-logger.service';

//********************************************************************************
@Injectable({ providedIn: 'root' })
export class CoreLoggerService {
    constructor(@Inject(DeCareEnvironmentToken) private readonly _environment: DeCareEnvironment, private readonly _adLogger: CoreAppDynLoggerService) {}

    //================================================
    //===                Varibales                 ===
    //================================================
    private _levelStyles = {
        debug: 'color:green',
        info: 'color:blue',
        warn: 'color:orange',
        error: 'color:red'
    };

    private _isDebugMode = !this._environment.production;

    //================================================
    //===            Public Functions              ===
    //================================================
    error(...args: any[]) {
        if (this._isDebugMode) {
            // Report to AppDynamics if flag is true
            if (this._environment.appDynamicsReport) {
                this._reportErrorToAppDynamics(args);
            }

            this.applyConsoleMethod('error', args);
        }
    }

    warn(message?: any, ...optionalParams: any[]) {
        if (this._isDebugMode) {
            console.warn.apply(console, arguments);
        }
    }

    info(message?: any, ...optionalParams: any[]) {
        if (this._isDebugMode) {
            /* tslint:disable */
            console.info.apply(console, arguments);
            /* tslint:enable */
        }
    }

    debug(message?: any, ...optionalParams: any[]) {
        if (this._isDebugMode) {
            console.log.apply(console, arguments);
        }
    }

    log(message?: any, ...optionalParams: any[]) {
        if (this._isDebugMode) {
            console.log.apply(console, arguments);
        }
    }

    //================================================
    //===            Private Functions             ===
    //================================================
    private applyConsoleMethod(method: string, args: any[]) {
        console.group.apply(console, [`%c ${method.toLocaleUpperCase()}:`, this._levelStyles[method]]);
        console[method].apply(console, args);
        console.groupEnd.apply(console);
    }

    private _reportErrorToAppDynamics(args: any[]) {
        if (args && args.length > 0) {
            const arg = args[CoreConstant.APP_DYNAMICS_ERR_INDEX];

            // Return if 1st param is false
            if (typeof arg === 'boolean' && !arg) {
                return;
            } else if (typeof arg === 'boolean') {
                // Remove Boolean flag
                args.shift();
            }

            const MSG_CELL = 0,
                ERR_PAYLOAD_CELL = 0;

            const adErr: IAppDynamicsError = {
                message: args.length === 2 ? `${args[MSG_CELL]} ${JSON.stringify(args[ERR_PAYLOAD_CELL])}` : args[MSG_CELL]
            };

            this._adLogger.error(adErr);
        }
    }
}
