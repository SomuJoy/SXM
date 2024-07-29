import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OfferDealModel, PackageDescriptionModel, ComponentNameEnum } from '@de-care/data-services';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AmazonAuthResponse } from '../amazon-login/amazon-login.component';
import { SettingsService } from '@de-care/settings';
import { SharedEventTrackService } from '@de-care/data-layer';

export type ClaimDeviceStateType = 'claim' | 'success' | 'error';

@Component({
    selector: 'claim-device',
    templateUrl: './claim-device.component.html',
    styleUrls: ['./claim-device.component.scss']
})
export class ClaimDeviceComponent implements OnInit {
    @Input() deal: OfferDealModel;
    @Input() platform: string;
    @Input() state: ClaimDeviceStateType = 'claim';
    @Input() sessionId: string;
    @Input() termLength: string;
    @Output() amazonAuthResponse = new EventEmitter();
    packageDescription$: Observable<PackageDescriptionModel>;
    amazonClientId: string;

    constructor(private _translateService: TranslateService, private _env: SettingsService, private _eventTrackService: SharedEventTrackService) {}

    ngOnInit() {
        this.packageDescription$ = this._translateService.get(`app.packageDescriptions.${this.deal.type}`).pipe(
            tap(packageDesc => {
                if (packageDesc.linkWithSiteSupported) {
                    this._eventTrackService.track('amazon-link-impression', { componentName: ComponentNameEnum.ClaimDevice });
                }
            })
        );

        if (this._env.settings.amzClientId) {
            this.amazonClientId = this._env.settings.amzClientId;
        }
    }

    onAmazonAuthResponse(authResponse: AmazonAuthResponse) {
        this.amazonAuthResponse.emit(authResponse);
    }
}
