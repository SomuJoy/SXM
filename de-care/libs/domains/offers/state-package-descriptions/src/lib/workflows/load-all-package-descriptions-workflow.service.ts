import { Injectable, Inject } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { tap, map, mapTo, mergeMap, take, concatMap } from 'rxjs/operators';
import { setPackageDescriptions } from '../state/actions';
import { locales } from '../state/models';
import { DataPackageDescriptionsService } from '../data-services/data-package-descriptions.service';
import { normalizeLocaleToLangForEndpoint, loadPackageDescriptionsIntoTranslateService } from '../state/helpers';
import { TranslationSettingsToken, TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { TranslateService } from '@ngx-translate/core';
import { getPackageDescriptionsExist } from '../state/selectors';

@Injectable({ providedIn: 'root' })
export class LoadAllPackageDescriptionsWorkflowService implements DataWorkflow<{ oemDevice: boolean }, boolean> {
    constructor(
        private readonly _dataPackageDescriptionsService: DataPackageDescriptionsService,
        private readonly _store: Store,
        @Inject(TRANSLATION_SETTINGS) private readonly _translationSettingsToken: TranslationSettingsToken,
        private readonly _translateService: TranslateService
    ) {}

    build(payload = { oemDevice: false }): Observable<boolean> {
        return this._store.pipe(
            select(getPackageDescriptionsExist),
            take(1),
            concatMap((packageDescriptionsExist) => {
                // if we already have package descriptions in state then skip loading from endpoint and just return
                if (packageDescriptionsExist) {
                    return of(true);
                }
                let stream: Observable<boolean>;
                this._translationSettingsToken.languagesSupported.forEach((locale) => {
                    if (!stream) {
                        stream = this._createLoadStreamForLocale(locale, payload.oemDevice);
                    } else {
                        stream = stream.pipe(mergeMap(() => this._createLoadStreamForLocale(locale, payload.oemDevice)));
                    }
                });
                return stream ? stream : of(false);
            })
        );
    }

    private _createLoadStreamForLocale(locale: locales, oemDevice = false): Observable<boolean> {
        return this._dataPackageDescriptionsService.allPackageDescriptions({ locale: normalizeLocaleToLangForEndpoint(locale), oemDevice: oemDevice || undefined }).pipe(
            map((packageDescriptions) => packageDescriptions.map((packageDescription) => ({ ...packageDescription, locale }))),
            tap((packageDescriptions) => {
                this._store.dispatch(setPackageDescriptions({ packageDescriptions }));

                // NOTE: This is here until we can go through all the UI code
                //       and refactor it to get package description content from this
                //       state lib via selectors instead of from the translate service.
                loadPackageDescriptionsIntoTranslateService(packageDescriptions, this._translateService, locale);
            }),
            mapTo(true)
        );
    }
}
