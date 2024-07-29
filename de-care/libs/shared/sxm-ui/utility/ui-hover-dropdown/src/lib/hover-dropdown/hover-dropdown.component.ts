import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-hover-dropdown',
    templateUrl: './hover-dropdown.component.html',
    styleUrls: ['./hover-dropdown.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiHoverDropdownComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    open = false;

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private readonly _changeDetectorRef: ChangeDetectorRef) {
        translationsForComponentService.init(this);
    }

    showDropdown() {
        this.open = true;
    }

    hideDropdown() {
        this.open = false;
        this._changeDetectorRef.detectChanges();
    }

    toggleDropDown() {
        this.open = !this.open;
    }

    keyup(evt) {
        if (evt.key === 'Enter' || evt.key === ' ' || evt.key === 'ArrowDown') {
            this.open = true;
        } else if (evt.key === 'Escape') {
            this.open = false;
        }
    }
}

@NgModule({
    declarations: [SxmUiHoverDropdownComponent],
    exports: [SxmUiHoverDropdownComponent],
    imports: [CommonModule, TranslateModule.forChild()],
})
export class SxmUiHoverDropdownComponentModule {}
