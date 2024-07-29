import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SxmLanguages } from '@de-care/app-common';
import { SettingsService, sxmCountries } from '@de-care/settings';
import { getSxmValidator } from '@de-care/shared/validation';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'zag-form',
    templateUrl: './zag-form.component.html',
    styleUrls: ['./zag-form.component.scss'],
})
export class ZagFormComponent {
    currentCountry: sxmCountries;
    currentLang: SxmLanguages;
    form: FormGroup;
    years: string[];
    yearId = uuid();
    loading = false;
    submitted = false;
    private $langChangeSubscription: Subscription;
    isCanada = false;

    constructor(private readonly _fb: FormBuilder, private readonly _settingsService: SettingsService, private readonly _translate: TranslateService) {}

    ngOnInit(): void {
        this.currentCountry = this._settingsService.settings.country;
        this.currentLang = this._translate.currentLang as SxmLanguages;
        this.isCanada = this._settingsService.isCanadaMode;
        this.$langChangeSubscription = this._translate.onLangChange.subscribe((ev) => {
            this.currentLang = ev.lang as SxmLanguages;
        });
        this.years = this.calcYears();

        this.form = this._fb.group({
            zipCode: ['', { validators: getSxmValidator('zipCodeForLookup', this.currentCountry, this.currentLang), updateOn: 'blur' }],
            birthYear: ['', { validators: getSxmValidator('birthYear', this.currentCountry, this.currentLang) }],
            gender: ['', { validators: getSxmValidator('gender', this.currentCountry, this.currentLang) }],
        });
    }

    calcYears(startYear = 1900): string[] {
        const years: string[] = [];
        while (startYear <= 2005) {
            years.unshift((startYear++).toString());
        }
        return years;
    }

    submitForm(): void {
        this.loading = true;
        this.submitted = true;

        if (this.form.valid) {
            this.loading = false;
        } else {
            this.loading = false;
        }
    }
}
