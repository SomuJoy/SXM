import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListenNowButtonComponent } from './listen-now-button/listen-now-button.component';
import { SxmUiModule } from '@de-care/sxm-ui';
import { SharedSxmUiUiStreamingPlayerLinkModule } from '@de-care/shared/sxm-ui/ui-streaming-player-link';

const declarations = [ListenNowButtonComponent];

@NgModule({
    imports: [CommonModule, SxmUiModule, SharedSxmUiUiStreamingPlayerLinkModule],
    declarations,
    exports: [...declarations]
})
export class SharedSxmUiUiListenNowButtonModule {}
