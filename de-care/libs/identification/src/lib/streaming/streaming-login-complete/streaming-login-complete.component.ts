import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VehicleModel } from '@de-care/data-services';

export interface StreamingLoginSubscriptionModel {
    packageName: string;
    vehicleInfo: VehicleModel;
    last4DigitsOfRadioId: string;
    allowedAction: StreamingLoginActionEnum;
}

export enum StreamingLoginActionEnum {
    SignIn = 'SIGN_IN',
    CreateLogin = 'CREATE_LOGIN',
    Upgrade = 'UPGRADE'
}

@Component({
    selector: 'streaming-login-complete',
    templateUrl: './streaming-login-complete.component.html',
    styleUrls: ['./streaming-login-complete.component.scss']
})
export class StreamingLoginCompleteComponent implements OnInit {
    @Input() subscriptions: StreamingLoginSubscriptionModel[];

    @Output() createLoginRequested = new EventEmitter<string>();
    @Output() signInRequested = new EventEmitter<string>();
    @Output() upgradeRequested = new EventEmitter<string>();
    @Output() getAppRequested = new EventEmitter();

    streamingLoginActionEnum = StreamingLoginActionEnum;

    constructor() {}

    ngOnInit() {}

    getApp() {
        this.getAppRequested.emit();
    }

    createLogin(last4DigitsOfRadioId: string) {
        this.createLoginRequested.emit(last4DigitsOfRadioId);
    }

    signIn(last4DigitsOfRadioId: string) {
        this.signInRequested.emit(last4DigitsOfRadioId);
    }

    upgrade(last4DigitsOfRadioId: string) {
        this.upgradeRequested.emit(last4DigitsOfRadioId);
    }
}
