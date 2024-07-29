import { Observable } from 'rxjs';

export interface DataWorkflow<T, R> {
    build(request: T): Observable<R>;
}
