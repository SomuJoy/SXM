import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SharedSxmUiUiLoadingOverlayModule } from '@de-care/shared/sxm-ui/ui-loading-overlay';
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
    selector: 'bummer-error',
    styleUrls: ['./bummer-error.component.scss'],
    templateUrl: './bummer-error.component.html',
})
export class BummerErrorComponent implements ComponentWithLocale {
    @Input() errorMessage: string;
    @Input() ctaLink: string;

    translateKeyPrefix: string;
    languageResources: LanguageResources;
    displayLoader = false;

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private router: Router) {
        translationsForComponentService.init(this);
    }

    redirectCtaLink() {
        this.displayLoader = true;
        this.router.navigateByUrl(this.ctaLink, { replaceUrl: false });
    }
}

@NgModule({
    declarations: [BummerErrorComponent],
    exports: [BummerErrorComponent],
    imports: [CommonModule, RouterModule, SharedSxmUiUiLoadingOverlayModule, TranslateModule.forChild()],
})
export class BummerErrorComponentModule {}
