import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSummaryBlockUsernameComponent } from './account-summary-block-username/account-summary-block-username.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SortingSubscriptionsPipe } from './account-summary-block-username/pipes/sorting-primary-account.pipe';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule.forChild(), SharedSxmUiUiDataClickTrackModule],
    declarations: [AccountSummaryBlockUsernameComponent, SortingSubscriptionsPipe],
    exports: [AccountSummaryBlockUsernameComponent],
})
export class SharedSxmUiUiAccountSummaryBlockUsernameModule {}
