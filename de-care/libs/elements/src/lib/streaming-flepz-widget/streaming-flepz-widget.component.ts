import { HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FlepzData } from '@de-care/domains/identity/ui-streaming-flepz-lookup-form';
import { OpenNativeAppService } from '@de-care/domains/utility/state-native-app-integration';
import { ElementsNavigationService } from '../elements-navigation.service';
import { ElementsSettings, ElementsSettingsToken } from '../elements-settings-token';

@Component({
    selector: 'sxm-streaming-flepz-widget',
    template: `
        <streaming-flepz-lookup-form (signInRequested)="onSignInRequested()" (flepzDataReadyToProcess)="onFlepzDataReadyToProcess($event)">
            <privacy-policy privacyPolicy></privacy-policy>
        </streaming-flepz-lookup-form>
    `,
    styles: [
        `
            sxm-streaming-flepz-widget .text-link {
                font-weight: 400 !important;
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class StreamingFlepzWidgetComponent implements OnInit {
    private _paramsToForward: HttpParams;

    constructor(
        private readonly _elementsNavigationService: ElementsNavigationService,
        @Inject(ElementsSettingsToken) private readonly _elementsSettings: ElementsSettings,
        private readonly _openNativeAppService: OpenNativeAppService
    ) {}

    ngOnInit(): void {
        this._paramsToForward = this._elementsNavigationService.getQueryParams();
    }

    onSignInRequested() {
        this._openNativeAppService.openSxmPlayerApp();
    }

    onFlepzDataReadyToProcess(flepzData: FlepzData) {
        this._paramsToForward = this._paramsToForward.set('flepz', btoa(JSON.stringify(flepzData)));
        this._elementsNavigationService.onSuccessNavigateTo(this._elementsSettings.streamingFlepzSuccessUrl, this._paramsToForward.toString());
    }
}
