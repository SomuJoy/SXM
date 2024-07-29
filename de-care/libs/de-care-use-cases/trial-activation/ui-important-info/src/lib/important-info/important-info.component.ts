import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';

@Component({
    selector: 'trial-activation-important-info',
    templateUrl: './important-info.component.html',
    styleUrls: ['./important-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrialActivationImportantInfoComponent implements OnInit {
    @Input() isQuebec = false;

    translateKeyPrefix = 'DeCareUseCasesTrialActivationUiImportantInfo.importantInfoComponent';

    constructor() {}

    ngOnInit() {}
}
