import { HttpErrorResponse } from '@angular/common/http';

export class SessionTimeoutHttpError extends HttpErrorResponse {
    constructor({ error, headers, status, statusText, url }: HttpErrorResponse) {
        super({
            error,
            headers,
            status,
            statusText,
            url
        });
    }
}
