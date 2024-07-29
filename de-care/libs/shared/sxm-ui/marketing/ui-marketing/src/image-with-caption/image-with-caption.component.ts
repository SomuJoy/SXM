import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

interface MarketingData {
    imageUrl: string;
    bodyContent: string;
}
@Component({
    selector: 'sxm-ui-image-with-caption',
    templateUrl: './image-with-caption.component.html',
    styleUrls: ['./image-with-caption.component.scss'],
})
export class SxmUiImageWithCaptionComponent {
    @Input() data: MarketingData;
    @Output() submitNht = new EventEmitter();
}

@NgModule({
    declarations: [SxmUiImageWithCaptionComponent],
    exports: [SxmUiImageWithCaptionComponent],
    imports: [CommonModule, TranslateModule.forChild()],
})
export class SharedSxmUiImageWithCaptionComponentModule {}
