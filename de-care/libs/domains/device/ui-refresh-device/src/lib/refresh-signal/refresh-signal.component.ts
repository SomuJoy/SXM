import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { RefreshErrorTypesEnum, RefreshTypeEnum } from '../refresh-error.enum';

@Component({
    selector: 'refresh-signal',
    templateUrl: './refresh-signal.component.html',
    styleUrls: ['./refresh-signal.component.scss'],
})
export class RefreshSignalComponent implements OnInit {
    @Input() radioId = '';
    @Input() phone = '';
    @Input() outsideCarSteps = true;
    @Output() signalCompleted = new EventEmitter<{ refreshType: RefreshTypeEnum }>();

    userInCar: boolean;
    activeComponent: string;
    errorTypeToDisplay: RefreshErrorTypesEnum;

    constructor(private readonly _store: Store) {}
    ngOnInit() {
        // Set the Activate Component as the default component to appear
        this.activeComponent = 'active-radio';
    }

    activeComponentUpdate(newComponent: 'success-message' | 'error-message') {
        this.activeComponent = newComponent;
        if (this.userInCar) {
            this.signalCompleted.emit({ refreshType: RefreshTypeEnum.Signal });
        } else {
            this.signalCompleted.emit({ refreshType: RefreshTypeEnum.Text });
        }
    }
}
