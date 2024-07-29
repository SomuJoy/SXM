import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
    selector: 'de-care-header-dot-com',
    templateUrl: './header-dot-com.component.html',
    styleUrls: ['./header-dot-com.component.scss'],
})
export class HeaderDotComComponent {
    @Input() isSimple = false;
    @Output() loaded = new EventEmitter();
}
