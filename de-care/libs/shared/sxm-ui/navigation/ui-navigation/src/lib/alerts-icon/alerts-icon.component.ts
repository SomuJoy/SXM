import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'sxm-ui-alerts-icon',
    templateUrl: './alerts-icon.component.html',
    styleUrls: ['./alerts-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiAlertsIconComponent {
    private _alertCount = 0;
    @Input() set alertCount(count: number) {
        // shows transition if currently showing count and new count coming in is zero
        this.showZeroCountTransition = this._alertCount > 0 && count === 0;
        this._alertCount = count;
        this.showCount = count > 0;
    }
    get alertCount(): number {
        return this._alertCount;
    }
    showCount = false;
    showZeroCountTransition = false; // show the transition animation from count to no count
}

@NgModule({
    imports: [CommonModule],
    declarations: [SxmUiAlertsIconComponent],
    exports: [SxmUiAlertsIconComponent],
})
export class SxmUiAlertsIconModule {}
