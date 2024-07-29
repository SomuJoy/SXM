import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService, UserSettingsService } from '@de-care/settings';

@Component({
    selector: 'trial-activation-offer-details',
    templateUrl: './trial-activation-offer-details.component.html',
    styleUrls: ['./trial-activation-offer-details.component.scss']
})
export class TrialActivationOfferDetailsComponent implements OnInit {
    isQuebec$: Observable<boolean>;
    isCanada: boolean;
    @Input() termLength: number;
    @Input() packageName: string;

    constructor(private _settingsSrv: SettingsService, private _userSettings: UserSettingsService) {}

    ngOnInit(): void {
        this.isCanada = this._settingsSrv.isCanadaMode;
        this.isQuebec$ = this._userSettings.isQuebec$;
    }
}
