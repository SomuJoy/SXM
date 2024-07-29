import { PlanTypeEnum, isOfferMCP } from '@de-care/data-services';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mcpTranslateKey'
})
export class MCPTranslationKeyPipe implements PipeTransform {
    transform(type: string | PlanTypeEnum, args: { mcpCase: string; nonMCPCase: string; prefix?: string }): string {
        const prefix = args.prefix || '';
        return isOfferMCP(type as PlanTypeEnum) ? `${prefix}${args.mcpCase}` : `${prefix}${args.nonMCPCase}`;
    }
}
