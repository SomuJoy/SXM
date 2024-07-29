import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { LANGUAGE_CODES } from '@de-care/shared/state-settings';

@Injectable({
    providedIn: 'root'
})
export class UserSettingsService {
    //local value
    private _isQuebec: boolean;
    private _selectedCanadianProvince: string;

    //observable stream used to send out the local _isQuebec value
    private _isQuebec$: BehaviorSubject<boolean>;
    private _selectedCanadianProvince$: BehaviorSubject<string>;
    private _provinceSelectionDisabled$: BehaviorSubject<boolean>;
    private _provinceSelectionVisible$: BehaviorSubject<boolean>;
    private readonly defaultCanadianProv = 'ON';

    //to allow users to subscribe without being able to .next out a new value
    readonly isQuebec$: Observable<boolean>;
    readonly selectedCanadianProvince$: Observable<string>;
    readonly provinceSelectionDisabled$: Observable<boolean>;
    readonly provinceSelectionVisible$: Observable<boolean>;

    private _dateFormat$: BehaviorSubject<string>;
    readonly dateFormat$: Observable<string>;

    private _usDateFormat = 'MM/dd/y';
    private _caDateFormat = 'MMMM d, y';
    private _caFrDateFormat = 'd MMMM y';

    constructor() {
        this._isQuebec = false;
        this._isQuebec$ = new BehaviorSubject<boolean>(this._isQuebec);
        this.isQuebec$ = this._isQuebec$.asObservable();

        this._selectedCanadianProvince = this.defaultCanadianProv;
        this._selectedCanadianProvince$ = new BehaviorSubject<string>(this._selectedCanadianProvince);
        this.selectedCanadianProvince$ = this._selectedCanadianProvince$.asObservable();

        this._provinceSelectionDisabled$ = new BehaviorSubject<boolean>(false);
        this.provinceSelectionDisabled$ = this._provinceSelectionDisabled$.asObservable();

        this._provinceSelectionVisible$ = new BehaviorSubject<boolean>(false);
        this.provinceSelectionVisible$ = this._provinceSelectionVisible$.asObservable();

        this._dateFormat$ = new BehaviorSubject<string>(this._usDateFormat);
        this.dateFormat$ = this._dateFormat$.asObservable();
    }

    private _setIsQuebec(isQuebec: boolean) {
        if (this._isQuebec !== isQuebec) {
            this._isQuebec = isQuebec;
            this._isQuebec$.next(this._isQuebec);
        }
    }

    isQuebec(): boolean {
        return this._isQuebec;
    }

    public setDateFormatBasedOnLocale(locale: string) {
        switch (locale) {
            case LANGUAGE_CODES.EN_CA:
                this._dateFormat$.next(this._caDateFormat);
                break;
            case LANGUAGE_CODES.FR_CA:
                this._dateFormat$.next(this._caFrDateFormat);
                break;
            case LANGUAGE_CODES.EN_US:
            default:
                this._dateFormat$.next(this._usDateFormat);
                break;
        }
    }

    public setSelectedCanadianProvince(selectedCanadianProvince: string = this.defaultCanadianProv) {
        if (this._selectedCanadianProvince !== selectedCanadianProvince) {
            this._setIsQuebec(selectedCanadianProvince === 'QC');
            this._selectedCanadianProvince = selectedCanadianProvince;
            this._selectedCanadianProvince$.next(this._selectedCanadianProvince);
        }
    }

    public setProvinceSelectionDisabled(provinceSelectionDisabled: boolean) {
        this._provinceSelectionDisabled$.next(provinceSelectionDisabled);
    }

    public setProvinceSelectionVisible(provinceSelectionVisible: boolean) {
        this._provinceSelectionVisible$.next(provinceSelectionVisible);
    }
}
