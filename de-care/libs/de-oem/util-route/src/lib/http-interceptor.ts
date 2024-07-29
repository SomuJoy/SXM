import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { OemNavigationService } from './oem-navigation.service';

@Injectable()
export class OemHttpInterceptor implements HttpInterceptor {
    constructor(private _router: Router, private _oemNavigationService: OemNavigationService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            map((event: HttpEvent<any>) => event),
            catchError((error: HttpErrorResponse) => {
                if (!error.url.endsWith('/utility/card-bin-ranges')) {
                    this._oemNavigationService.goToErrorPage();
                }
                return throwError(error);
            })
        );
    }
}
