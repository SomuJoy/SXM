import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PriceChangeMessagingType } from './price-change-messaging-type-enum';

@Component({
    selector: 'price-increase-message',
    templateUrl: './price-increase-message.component.html',
    styleUrls: ['./price-increase-message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceIncreaseMessageComponent {
    @Input() priceChangeMessagingType: PriceChangeMessagingType;
    @Input() isQuebec: boolean;

    priceChangeKey = 'ui-price-increase-message.priceIncreaseMessage.';
}
