import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef, PipeTransform } from '@angular/core';
import { PackageDescriptionModel } from '@de-care/domains/offers/state-package-descriptions';
import { PlanTypeEnum } from '@de-care/domains/account/state-account';

export abstract class PackageDescriptionTranslatePipeBase implements PipeTransform {
    private _keyPrefix = 'app.packageDescriptions';
    protected readonly _translatePipe: TranslatePipe;
    private readonly _cache: { [key: string]: string } = {};

    protected constructor(private readonly _translateService: TranslateService, changeDetectorRef: ChangeDetectorRef) {
        this._translatePipe = new TranslatePipe(this._translateService, changeDetectorRef);
    }

    transform({ packageName, type, isAdvantage }: { packageName: string; type: string, isAdvantage?: boolean }): any {
        const keyType = isAdvantage ? PlanTypeEnum.Advantage : type;
        const cacheKey = `${packageName}_${keyType}_${this._translateService.currentLang}`;
        if (this._cache[cacheKey]) {
            return this._cache[cacheKey];
        }
        const key = `${this._keyPrefix}.${packageName}`;
        const value = this._translateForKey(key, keyType);
        this._cache[cacheKey] = value;
        return value;
    }

    private _translateForKey(key: string, type: string): string {
        const description: PackageDescriptionModel | string = this._translatePipe.transform(key);
        if (description !== key) {
            return this.getDescriptionContent(description as PackageDescriptionModel, type);
        } else {
            return key;
        }
    }

    abstract getDescriptionContent(description: PackageDescriptionModel, type: string): string;
}
