import { BehaviorSubject, Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';

export interface ProvinceSelection {
    selectedProvince$: Observable<string | null>;
    setSelectedProvince: (value: string | null) => void;
    provinceCanBeChanged$: Observable<boolean>;
    setProvinceCanBeChanged: (value: boolean) => void;
}

export const PROVINCE_SELECTION = new InjectionToken<ProvinceSelection>('provinceSelectionToken', {
    providedIn: 'root',
    factory: () => {
        const selectedProvince = new BehaviorSubject<string | null>(null);
        const provinceCanBeChanged = new BehaviorSubject(true);
        return {
            selectedProvince$: selectedProvince.asObservable().pipe(distinctUntilChanged()),
            setSelectedProvince: (value: string | null) => {
                if (selectedProvince.getValue() !== value) {
                    selectedProvince.next(value);
                }
            },
            provinceCanBeChanged$: provinceCanBeChanged.asObservable().pipe(distinctUntilChanged()),
            setProvinceCanBeChanged: (value: boolean) => {
                if (provinceCanBeChanged.getValue() !== value) {
                    provinceCanBeChanged.next(value);
                }
            },
        };
    },
});
