import { CommonModule } from '@angular/common';
import { Component, NgModule, Output, EventEmitter } from '@angular/core';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';

@Component({
    selector: 'sxm-ui-toast-notification',
    templateUrl: './toast-notification.component.html',
    styleUrls: ['./toast-notification.component.scss'],
})
export class SxmUiToastNotificationComponent {
    @Output() finished = new EventEmitter();

    onAnimationEnd(evt: AnimationEvent) {
        if (evt.animationName === 'hide') {
            this.finished.emit();
        }
    }
}

@NgModule({
    declarations: [SxmUiToastNotificationComponent],
    exports: [SxmUiToastNotificationComponent],
    imports: [CommonModule, SharedSxmUiUiAlertPillModule],
})
export class SharedSxmUiUiToastNotificationModule {}
