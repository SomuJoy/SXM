import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DataLayerService } from '@de-care/data-layer';
import { DataLayerDataTypeEnum, ComponentNameEnum, FlowNameEnum } from '@de-care/data-services';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'subscription-error',
    templateUrl: './subscription-error.component.html',
    styleUrls: ['./subscription-error.component.scss']
})
export class SubscriptionErrorComponent implements OnInit, OnDestroy {
    @Output() call = new EventEmitter();
    private _subscription: Subscription;

    constructor(private _dataLayerService: DataLayerService, private titleService: Title, private _translateService: TranslateService) {}

    ngOnInit() {
        this._dataLayerService.updateAndSendPageTrackEvent(DataLayerDataTypeEnum.PageInfo, ComponentNameEnum.OemErrorPage, {
            flowName: FlowNameEnum.Oem,
            componentName: ComponentNameEnum.OemErrorPage
        });
        this._subscription = this._translateService.get('oemCommon.subscriptionErrorComponent.PAGE_TITLE').subscribe(title => this.titleService.setTitle(title));
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}
