import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { getBuildInfoTag } from '@de-care/domains/utility/state-environment-info';
import { DataLayerService } from '@de-care/data-layer';
import { DataLayerDataTypeEnum } from '@de-care/data-services';

@Injectable()
export class EnvironmentInfoEffects {
    constructor(private readonly _actions: Actions, private readonly _store: Store, private readonly _dataLayerService: DataLayerService) {}

    environmentInfoBuildVersion$ = createEffect(
        () =>
            this._store.pipe(
                select(getBuildInfoTag),
                filter(tag => !!tag),
                distinctUntilChanged(),
                // TODO: when new application event tracking architecture is in place
                //       have this dispatch an application-event "reaction" action instead of referencing the data layer directly
                tap(tag => this._dataLayerService.update(DataLayerDataTypeEnum.MetaInfo, { buildVersion: tag }))
            ),
        { dispatch: false }
    );
}
