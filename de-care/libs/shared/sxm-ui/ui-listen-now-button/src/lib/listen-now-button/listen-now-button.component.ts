import { Component, Inject, Input, HostBinding } from '@angular/core';

@Component({
    selector: 'listen-button',
    templateUrl: 'listen-now-button.component.html',
    styleUrls: ['listen-now-button.component.scss'],
})
export class ListenNowButtonComponent {
    @Input()
    @HostBinding('class.full-width')
    fullWidth: boolean = false;

    @Input() listenNowCustomLink: string;
}
