import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Input } from '@angular/core';
import { SharedSxmUiDropdownNavigationListModule } from '@de-care/shared/sxm-ui/ui-dropdown-navigation-list';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';

interface DropdownListModel {
    label: string;
    modalId: string;
    routerLinkObject?: {
        outlets: {
            modal: string[];
        };
    };
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-ebill-actions',
    templateUrl: './ebill-actions.component.html',
    styleUrls: ['./ebill-actions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiEBillActionsComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input() email: string;
    @Input() dropdownListData: DropdownListModel[] = [];

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiEBillActionsComponent],
    exports: [SxmUiEBillActionsComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiDropdownNavigationListModule],
})
export class SharedSxmUiEBillActionsComponentModule {}
