import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';

@Component({
    selector: 'sxm-ui-account-help-faq-card',
    templateUrl: './account-help-faq-card.component.html',
    styleUrls: ['./account-help-faq-card.component.scss'],
})
export class SxmUiAccountHelpFaqCardComponent {
    @Output() activate = new EventEmitter<string>();

    onVanityActivate() {
        this.activate.emit();
    }
}

@NgModule({
    imports: [CommonModule],
    declarations: [SxmUiAccountHelpFaqCardComponent],
    exports: [SxmUiAccountHelpFaqCardComponent],
})
export class SharedSxmUiAccountHelpFaqCardModule {}
