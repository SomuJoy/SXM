import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'sxm-ui-quote-skeleton',
    template: `
        <table class="mb-16">
            <tr>
                <th>{{ title }}</th>
            </tr>
            <tr>
                <td>
                    <ng-container [ngTemplateOutlet]="lineItemBlocks"></ng-container>
                    <section class="line-item-blocks">
                        <div class="line-item-subtext"></div>
                    </section>
                    <ng-container [ngTemplateOutlet]="lineItemBlocks"></ng-container>
                    <section>
                        <hr />
                    </section>
                    <ng-container [ngTemplateOutlet]="lineItemBlocks"></ng-container>
                </td>
            </tr>
        </table>
        <div class="gradient-animation"></div>
        <ng-template #lineItemBlocks>
            <section class="line-item-blocks">
                <div class="line-item-name"></div>
                <div class="line-item-price"></div>
            </section>
        </ng-template>
    `,
    styleUrls: ['./quote-skeleton.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiQuoteSkeletonComponent {
    @Input() title = '';
}

@NgModule({
    declarations: [SxmUiQuoteSkeletonComponent],
    exports: [SxmUiQuoteSkeletonComponent],
    imports: [CommonModule],
})
export class SxmUiQuoteSkeletonComponentModule {}
