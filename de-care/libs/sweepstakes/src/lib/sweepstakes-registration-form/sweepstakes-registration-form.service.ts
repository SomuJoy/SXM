import { Injectable } from '@angular/core';
import { DataSweepstakesService, SweepstakesRequest, SweepstakesResponse } from '@de-care/data-services';
import { Observable } from 'rxjs';

@Injectable()
export class SweepstakesRegistrationFormService {
    constructor(private _dataSweepstakesService: DataSweepstakesService) {}

    enterSweepstakes(data: SweepstakesRequest): Observable<SweepstakesResponse> {
        return this._dataSweepstakesService.sweepstakesRegister(data);
    }

    calcYears(startYear = 1900): string[] {
        const latestYear = new Date().getFullYear();
        const years: string[] = [];
        while (startYear <= latestYear) {
            years.unshift((startYear++).toString());
        }
        return years;
    }

    calcDays(numOfDays = 31): Array<{ label: number; key: string }> {
        return [...Array(numOfDays).keys()].map(i => ({
            label: i + 1,
            key: this._calcPlaceholder(i + 1)
        }));
    }

    private _calcPlaceholder(num: number): string {
        const split = num.toString().split('');
        return split.length > 1 ? num.toString() : '0' + num.toString();
    }

    getDaysInMonth(month: number): number {
        if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
            return 31;
        } else if (month === 2) {
            return 29;
        } else {
            return 30;
        }
    }
}
