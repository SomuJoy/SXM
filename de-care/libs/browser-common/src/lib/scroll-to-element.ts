import { ElementRef } from '@angular/core';

/**
 * @deprecated Use ModuleWithTranslation from @de-care/shared/browser-common/window-scroll instead
 */
export function scrollToElement(element: ElementRef | Element): void {
    if (element) {
        let node: Element;
        if (element instanceof Element) {
            node = element;
        } else {
            node = element.nativeElement;
        }
        node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * @deprecated Use ModuleWithTranslation from @de-care/shared/browser-common/window-scroll instead
 */
export function scrollToElementBySelector(selector: string) {
    const element = document.querySelector(selector);
    scrollToElement(element);
}

/**
 * @deprecated Use ModuleWithTranslation from @de-care/shared/browser-common/window-scroll instead
 */
export function scrollToTop() {
    document.body.scrollTop = 0;
}
