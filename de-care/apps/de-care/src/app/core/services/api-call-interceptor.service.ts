import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { BrowserSessionTrackerService } from '@de-care/shared/browser-common/state-session-tracker';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';

@Injectable({
    providedIn: 'root',
})
export class ApiCallInterceptor implements HttpInterceptor {
    constructor(private readonly _browserInactivityService: BrowserSessionTrackerService, @Inject(MICROSERVICE_API_BASE_URL) private readonly _apiUrl: string) {}

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(req).pipe(
            tap((event) => {
                const apiCall = this._apiUrl && req.url.startsWith(this._apiUrl);
                if (apiCall && event instanceof HttpResponse) {
                    this._browserInactivityService.resetApiLastCalledTimer();
                }
            })
        );
    }
}
