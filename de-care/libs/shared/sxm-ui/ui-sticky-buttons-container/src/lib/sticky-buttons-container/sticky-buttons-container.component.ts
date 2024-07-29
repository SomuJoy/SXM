import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IntersectionObserverModule } from '@de-care/shared/browser-common/intersection-observer';
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
    selector: 'sxm-ui-sticky-buttons-container',
    templateUrl: './sticky-buttons-container.component.html',
    styleUrls: ['./sticky-buttons-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiStickyButtonsContainerComponent implements ComponentWithLocale, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    sticky: boolean;
    @ViewChild('stickyContainer', { read: ElementRef }) stickyContainer: ElementRef;
    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
    ngAfterViewInit(): void {
        const observer = new IntersectionObserver(([e]) => e.target.classList.toggle('is-sticky', e.intersectionRatio < 1), { threshold: [1] });

        observer.observe(this.stickyContainer.nativeElement);
    }
}

@NgModule({
    declarations: [SxmUiStickyButtonsContainerComponent],
    exports: [SxmUiStickyButtonsContainerComponent],
    imports: [CommonModule, TranslateModule.forChild(), IntersectionObserverModule],
})
export class SharedSxmUiUiStickyButtonsContainerModule {}
