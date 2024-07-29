import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SxmLanguages } from '@de-care/shared/translation';

@Pipe({
    name: 'withoutVehicleMake',
    pure: false
})
export class WithoutVehicleMakePipe implements PipeTransform {
    locale: string;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    key = 'sharedSxmUiUiWithoutVehicleMake.';

    constructor(private _translateService: TranslateService) {
        this.locale = _translateService.currentLang;
        this._translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(ev => {
            this.locale = ev.lang as SxmLanguages;
        });
    }

    transform(make: string, old?: boolean): string {
        const carTranslateText = this._translateService.instant(this.key + 'CAR');

        if (make) {
            return `${this.locale === 'fr-CA' ? carTranslateText : ''} ${make}`;
        }
        return `${old === undefined ? '' : this._translateService.instant(this.key + (old ? 'OLD' : 'NEW'))} ${carTranslateText}`;
    }
}
