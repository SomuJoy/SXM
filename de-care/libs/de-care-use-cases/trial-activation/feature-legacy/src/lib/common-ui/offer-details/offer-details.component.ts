import { Component, OnInit } from '@angular/core';
import { SettingsService, UserSettingsService } from '@de-care/settings';

@Component({
    selector: 'offer-details',
    templateUrl: './offer-details.component.html',
    styleUrls: ['./offer-details.component.scss']
})
export class OfferDetailsComponent implements OnInit {
    isQuebec$ = this._userSettings.isQuebec$;
    isCanada: boolean;

    constructor(private _settingsSrv: SettingsService, private _userSettings: UserSettingsService) {}

    ngOnInit(): void {
        this.isCanada = this._settingsSrv.isCanadaMode;
    }
}
