import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'de-care-footer-dot-com',
    templateUrl: './footer-dot-com.component.html',
    styleUrls: ['./footer-dot-com.component.scss'],
})
export class FooterDotComComponent {
    @Input() isSimple = false;
    @Output() loaded = new EventEmitter();
}
