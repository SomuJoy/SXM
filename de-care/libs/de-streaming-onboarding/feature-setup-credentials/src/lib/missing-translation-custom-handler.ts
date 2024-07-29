import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

export class MissingTranslationCustomHandler implements MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams): Observable<string> {
        return params.key.toLowerCase() === 'app.packagedescriptions.null.name' ? of('') : of(params.key);
    }
}
