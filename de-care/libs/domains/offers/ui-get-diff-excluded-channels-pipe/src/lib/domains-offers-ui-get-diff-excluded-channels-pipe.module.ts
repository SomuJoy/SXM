import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetDiffExcludedChannelsPipe } from './get-diff-excluded-channels.pipe';

const declarations = [GetDiffExcludedChannelsPipe];

@NgModule({
    exports: declarations,
    declarations
})
export class DomainsOffersUiGetDiffExcludedChannelsPipeModule {}
