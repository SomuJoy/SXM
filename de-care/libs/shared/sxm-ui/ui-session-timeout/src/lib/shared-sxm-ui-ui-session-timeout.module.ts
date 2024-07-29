import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SxmUiSesssionTimeoutComponent } from './sesssion-timeout/sesssion-timeout.component';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild()],
    declarations: [SxmUiSesssionTimeoutComponent],
    exports: [SxmUiSesssionTimeoutComponent],
})
export class SharedSxmUiUiSessionTimeoutModule {}
