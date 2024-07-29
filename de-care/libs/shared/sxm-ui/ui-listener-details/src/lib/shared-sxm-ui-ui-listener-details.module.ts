import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListenerDetailsComponent } from './listener-details/listener-details.component';

@NgModule({
    imports: [CommonModule],
    declarations: [ListenerDetailsComponent],
    exports: [ListenerDetailsComponent]
})
export class SharedSxmUiUiListenerDetailsModule {}
