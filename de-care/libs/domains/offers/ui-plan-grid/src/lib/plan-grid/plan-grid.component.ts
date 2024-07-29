import { Component, Input } from '@angular/core';
import { ListenOn, mapPackageNameToListenOn } from '@de-care/data-services';

@Component({
    selector: 'plan-grid',
    templateUrl: './plan-grid.component.html',
    styleUrls: ['./plan-grid.component.scss']
})
export class PlanGridComponent {
    @Input() set packageName(value: string) {
        this.listenOn = mapPackageNameToListenOn(value);
    }
    listenOn: ListenOn;
}
