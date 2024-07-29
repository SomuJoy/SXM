import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';
import { ReactiveComponentModule } from '@ngrx/component';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), ReactiveComponentModule, SharedSxmUiUiDataClickTrackModule],
    declarations: [ImageCarouselComponent],
    exports: [ImageCarouselComponent],
})
export class SharedSxmUiUiImageCarouselModule {}
