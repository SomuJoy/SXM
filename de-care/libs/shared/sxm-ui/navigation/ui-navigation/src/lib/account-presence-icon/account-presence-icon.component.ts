import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'sxm-ui-account-presence-icon',
    templateUrl: './account-presence-icon.component.html',
    styleUrls: ['./account-presence-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiAccountPresenceIconComponent {
    private _isLoggedIn = false;
    @Input() set loggedIn(loggedIn: boolean) {
        // shows transition if currently logged in and is now about to be logged out
        this.showLogoutTransition = this._isLoggedIn && loggedIn === false;
        this._isLoggedIn = loggedIn;
    }
    get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }
    showLogoutTransition = false; // show the transition animation from logged in to logged out
}

@NgModule({
    imports: [CommonModule],
    declarations: [SxmUiAccountPresenceIconComponent],
    exports: [SxmUiAccountPresenceIconComponent],
})
export class SxmUiAccountPresenceIconModule {}
