import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShellDotComComponent } from './shell-dot-com/shell-dot-com.component';
import { DotComComponentLoaderComponent } from './dot-com-component-loader/dot-com-component-loader.component';
import { HeaderDotComComponent } from './header-dot-com/header-dot-com.component';
import { FooterDotComComponent } from './footer-dot-com/footer-dot-com.component';
import { SharedSxmUiUiSafeHtmlModule } from '@de-care/shared/sxm-ui/ui-safe-html';
import { DotComNavWidgetComponent } from './dot-com-nav-widget/dot-com-nav-widget.component';

@NgModule({
    imports: [CommonModule, RouterModule.forChild([]), SharedSxmUiUiSafeHtmlModule],
    declarations: [ShellDotComComponent, DotComComponentLoaderComponent, HeaderDotComComponent, FooterDotComComponent, DotComNavWidgetComponent],
    exports: [ShellDotComComponent, RouterModule],
})
export class DeCareUseCasesSharedUiShellDotComModule {}
