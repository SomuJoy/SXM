import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DataLayerService } from '@de-care/data-layer';
import { DataLayerDataTypeEnum, ComponentNameEnum, FlowNameEnum } from '@de-care/data-services';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'manage-account',
    templateUrl: './manage-account.component.html',
    styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent implements OnInit, OnDestroy {
    @Output() call = new EventEmitter();
    private _subscription: Subscription;

    constructor(private _dataLayerService: DataLayerService, private titleService: Title, private _translateService: TranslateService) {}

    ngOnInit() {
        this._dataLayerService.updateAndSendPageTrackEvent(DataLayerDataTypeEnum.PageInfo, ComponentNameEnum.OemManageAccount, {
            flowName: FlowNameEnum.Oem,
            componentName: ComponentNameEnum.OemManageAccount
        });
        this._subscription = this._translateService.get('oemCommon.manageAccountComponent.PAGE_TITLE').subscribe(title => this.titleService.setTitle(title));
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}
