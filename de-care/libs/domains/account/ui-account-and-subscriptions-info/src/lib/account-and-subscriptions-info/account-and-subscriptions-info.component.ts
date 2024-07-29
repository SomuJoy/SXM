import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

export interface AccountDataInfo {
    accountLast4Digits: string;
    subscriptions: { plans: string[]; vehicle?: { year?: string; make?: string; model?: string }; radioIDLast4Digits?: string; maskedUserName?: string }[];
}

@Component({
    selector: 'account-and-subscriptions-info',
    templateUrl: './account-and-subscriptions-info.component.html',
    styleUrls: ['./account-and-subscriptions-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountAndSubscriptionsInfoComponent implements OnInit {
    @Input() accountDataInfo: AccountDataInfo;
    @Input() displayVerifyLink: boolean;
    @Output() verifyClicked: EventEmitter<string> = new EventEmitter<string>();

    constructor() {}

    ngOnInit(): void {}

    onVerifyClicked(): void {
        this.verifyClicked.emit(this.accountDataInfo.accountLast4Digits);
    }
}
