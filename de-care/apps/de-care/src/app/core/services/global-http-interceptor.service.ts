import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { GenericErrorHandler } from './generic-error-handler.service';

@Injectable()
export class GlobalHttpInterceptor implements HttpInterceptor {
    constructor(private _erroHandler: GenericErrorHandler) {}

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(req).pipe(
            // To-do: Make sure microservice error response is consistent for retry.
            retry(0), // Must not retry since session timeout error occurs only for the first try
            map((event: HttpEvent<unknown>) => {
                // Intercept http events
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                // This is a temp solution to provide a way to skip this error handler until we can figure out
                //  if 'X-Allow-Error-Handler' was intended to do that and how we can clean up this code
                if (req.headers.get('X-Skip-Http-Interceptor') === 'true') {
                    return throwError(error);
                }
                const commonErrors = req.headers.get('X-Allow-Error-Handler') === 'true';
                this._erroHandler.handleError(error, commonErrors);
                return throwError(error);
            })
        );
    }
}
