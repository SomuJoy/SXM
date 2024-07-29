import { Component, Input } from '@angular/core';

export type RflzError = null | 3494 | 5035 | 101 | 103 | 106 | 107 | 109 | 110 | 111 | 112 | 113 | 114;

export interface RflzErrorData {
    radioId?: string;
    lastName?: string;
}

@Component({
    selector: 'rflz-error',
    templateUrl: './rflz-error.component.html',
    styleUrls: ['./rflz-error.component.scss']
})
export class RflzErrorComponent {
    @Input() errorCode: RflzError;

    @Input() errorMsgData: RflzErrorData;

    @Input() sweepstakesEligible: boolean;
}
