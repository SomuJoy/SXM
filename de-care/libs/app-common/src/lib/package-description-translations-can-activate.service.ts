import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SettingsService } from '@de-care/settings';
import { PackageDescriptionTranslationsService } from './package-description-translations.service';
import { Locales } from '@de-care/data-services';

@Injectable({ providedIn: 'root' })
export class PackageDescriptionTranslationsCanActivate implements CanActivate {
    constructor(
        private _packageDescriptionTranslationsService: PackageDescriptionTranslationsService,
        private _settingsService: SettingsService,
        private _translateService: TranslateService
    ) {}

    canActivate(): Observable<boolean> {
        const localesToLoad: Locales[] = ['en_US'];
        if (this._settingsService.isCanadaMode) {
            localesToLoad.push('fr_CA');
        }
        return this._packageDescriptionTranslationsService.packageDescriptionsTranslations(this._translateService, localesToLoad, this._settingsService.settings.isOem);
    }
}
