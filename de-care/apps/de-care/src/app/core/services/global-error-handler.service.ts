import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { GenericErrorHandler } from './generic-error-handler.service';

@Injectable()
export class GlobalAppErrorHandler implements ErrorHandler {
    private _errorHandler: GenericErrorHandler;

    // Must not inject any service in the constructor to avoid circular service dependency.
    // Use the injector to get the dependent service in the handleError(..) method instead.
    constructor(private injector: Injector) {}

    handleError(error: Error | HttpErrorResponse) {
        if (!this._errorHandler) {
            this._errorHandler = this.injector.get(GenericErrorHandler);
        }
        this._errorHandler.handleError(error);
    }
}
