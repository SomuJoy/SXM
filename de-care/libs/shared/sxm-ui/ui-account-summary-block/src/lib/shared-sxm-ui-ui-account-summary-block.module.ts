import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AccountSummaryBlockComponent } from './account-summary-block/account-summary-block.component';
import { SortingSubscriptionsPipe } from './account-summary-block/pipes/sorting-primary-account.pipe';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule.forChild(), SharedSxmUiUiDataClickTrackModule],
    declarations: [AccountSummaryBlockComponent, SortingSubscriptionsPipe],
    exports: [AccountSummaryBlockComponent],
})
export class SharedSxmUiUiAccountSummaryBlockModule {}
