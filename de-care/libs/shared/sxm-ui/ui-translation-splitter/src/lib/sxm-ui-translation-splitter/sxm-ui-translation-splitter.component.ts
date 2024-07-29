import { Component, OnChanges, ChangeDetectionStrategy, Input, SimpleChanges } from '@angular/core';

@Component({
    selector: 'sxm-ui-translation-splitter',
    templateUrl: './sxm-ui-translation-splitter.component.html',
    styleUrls: ['./sxm-ui-translation-splitter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SxmUiTranslationSplitterComponent implements OnChanges {
    @Input() text: string;

    textSlots: string[];

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {
        this.textSlots = changes.text.currentValue.split('<inject-content>');
    }
}
