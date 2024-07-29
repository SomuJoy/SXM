import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'header[sxm-ui-page-header-basic]',
    templateUrl: './page-header-basic.component.html',
    styleUrls: ['./page-header-basic.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeaderBasicComponent {
    translateKeyPrefix = 'SharedSxmUiUiPageHeaderBasicModule.PageHeaderBasicComponent.';
    @Input() languageChangeEnabled = false;
    @Output() languageSelected = new EventEmitter<string>();
}
