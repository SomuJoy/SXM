import { Injectable } from '@angular/core';
import { behaviorEventReactionBuildVersion } from '@de-care/shared/state-behavior-events';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map, take, tap, withLatestFrom } from 'rxjs/operators';
import { DataEnvironmentInfoService } from '../data-services/data-environment-info.service';
import { loadEnvironmentInfoError, setEnvironmentInfo } from '../state/actions';
import { getBuildInfoTag, getEnvironmentLoaded } from '../state/selectors';

@Injectable({ providedIn: 'root' })
export class LoadEnvironmentInfoWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _dataEnvironmentInfoService: DataEnvironmentInfoService, private readonly _store: Store) {}

    build(): Observable<boolean> {
        return this._store.pipe(
            select(getEnvironmentLoaded),
            take(1),
            concatMap((envInfo) => {
                if (envInfo) {
                    return of(true);
                }

                return this.fetchAndLoadEnvInfo();
            })
        );
    }

    fetchAndLoadEnvInfo() {
        return this._dataEnvironmentInfoService.getEnvironmentInfo().pipe(
            tap((environmentInfo) => this._store.dispatch(setEnvironmentInfo({ environmentInfo }))),
            withLatestFrom(this._store.select(getBuildInfoTag)),
            tap(([, buildVersion]) => this._store.dispatch(behaviorEventReactionBuildVersion({ buildVersion }))),
            catchError((error) => {
                this._store.dispatch(loadEnvironmentInfoError({ error }));
                return throwError(error);
            }),
            map(() => true)
        );
    }
}
