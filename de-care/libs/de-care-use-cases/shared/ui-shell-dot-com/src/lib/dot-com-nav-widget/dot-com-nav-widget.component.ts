import { Component, Input } from '@angular/core';

@Component({
    selector: 'de-care-dot-com-nav-widget',
    templateUrl: './dot-com-nav-widget.component.html',
})
export class DotComNavWidgetComponent {
    @Input() isSimple = false;
    @Input() type: 'Navigation' | 'Footer' = 'Navigation';
}
