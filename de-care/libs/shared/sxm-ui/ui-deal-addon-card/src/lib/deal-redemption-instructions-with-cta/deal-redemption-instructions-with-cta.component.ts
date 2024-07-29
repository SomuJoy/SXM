import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';

interface DealAddon {
    title: string;
    productImage?: string;
    descriptions?: string[];
}

@Component({
    selector: 'sxm-ui-deal-redemption-instructions-with-cta',
    templateUrl: './deal-redemption-instructions-with-cta.component.html',
    styleUrls: ['./deal-redemption-instructions-with-cta.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiDealRedemptionInstructionsWithCtaComponent implements AfterViewInit {
    @Input() copyContent: DealAddon;
    @Input() buttonTextCopy: string;
    @Output() ctaClicked = new EventEmitter();
    @HostBinding('attr.data-test') dataTestAttribute = 'dealRedemptionInstructionsWithCta';

    constructor(private readonly _store: Store) {}

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'dealredemptioninstructionswithcta' }));
    }

    onCtaClicked() {
        this.ctaClicked.emit();
    }
}
