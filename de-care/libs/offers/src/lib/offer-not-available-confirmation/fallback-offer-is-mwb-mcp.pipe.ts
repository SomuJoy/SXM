import { Pipe, PipeTransform } from '@angular/core';
import { OfferNotAvailableReasonEnum } from '@de-care/data-services';

@Pipe({
    pure: true,
    name: 'fallbackOfferIsMwbMcp'
})
export class FallbackOfferIsMwbMcpPipe implements PipeTransform {
    transform(fallbackReason: string) {
        return fallbackReason === OfferNotAvailableReasonEnum.MWB_MCP_UNAVAILABLE;
    }
}
