import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { map, mapTo, mergeMap, tap } from 'rxjs/operators';
import { DataOfferService, PackageDescriptionModel, Locales } from '@de-care/data-services';
import { SettingsService } from '@de-care/settings';

interface PackageDescriptionsObject {
    [packageName: string]: PackageDescriptionModel;
}

interface PackageDescriptionLanguageResource {
    app: {
        packageDescriptions: PackageDescriptionsObject;
    };
}

/**
 * @deprecated Use DomainsOffersStatePackageDescriptionsModule and workflow(s) or CanActivate service to do package descriptions loading
 */
@Injectable({ providedIn: 'root' })
export class PackageDescriptionTranslationsService {
    constructor(private _dataOfferService: DataOfferService, private _settingsService: SettingsService) {}

    // TEMP hard code this until we can completely remove the usage of this service
    private _hasLoadedTranslations = true;

    private static _reduce(packageDescriptions: PackageDescriptionModel[]) {
        return packageDescriptions.reduce((obj, packageDescriptionModel) => ((obj[packageDescriptionModel.packageName] = packageDescriptionModel), obj), {});
    }

    private static _packageDescriptionsToLanguageResource(packageDescriptions): PackageDescriptionLanguageResource {
        return { app: { packageDescriptions } };
    }

    disableModuleLevelLoad(): void {
        this._hasLoadedTranslations = true;
    }

    loadTranslations(translateService: TranslateService) {
        if (!this._hasLoadedTranslations) {
            const localesToLoad: Locales[] = ['en_US'];
            // TODO: might want to reconsider using this here as it can result in different behavior across app
            //       (all the other french resources come with modules so if lang change UX is available those
            //        will translate but the package descriptions won't because the decision to include those was
            //        done here, not related to the others)
            //       Or...could change the other language load logic (in ModuleWithTranslation) to conditionally add
            //        non US if in Canada mode...
            if (this._settingsService.isCanadaMode) {
                localesToLoad.push('fr_CA');
            }
            this.packageDescriptionsTranslations(translateService, localesToLoad, this._settingsService.settings && this._settingsService.settings.isOem).subscribe();
            this._hasLoadedTranslations = true;
        }
    }

    packageDescriptionsTranslations(translateService: TranslateService, localesToLoad: Locales[], isOem = false): Observable<boolean> {
        let stream: Observable<boolean>;
        localesToLoad.forEach((locale) => {
            if (!stream) {
                stream = this._buildStream(translateService, locale, isOem);
            } else {
                stream = stream.pipe(mergeMap(() => this._buildStream(translateService, locale, isOem)));
            }
        });
        return stream ? stream : of(false);
    }

    private _buildStream(translateService: TranslateService, locale: Locales, oemDevice): Observable<boolean> {
        const langCode = locale.replace('_', '-');
        return this._dataOfferService.allPackageDescriptions({ locale, oemDevice }).pipe(
            map(PackageDescriptionTranslationsService._reduce),
            map(PackageDescriptionTranslationsService._packageDescriptionsToLanguageResource),
            tap((languageResource) => {
                translateService.setTranslation(langCode, languageResource, true);
            }),
            mapTo(true)
        );
    }
}
