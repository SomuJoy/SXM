import { Injectable, Inject, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { scrollIntoView as safariScrollIntoView } from 'seamless-scroll-polyfill';
import { timer } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ScrollService {
    constructor(@Inject(DOCUMENT) private readonly document: Document) {}

    scrollToElement(element: ElementRef | Element): void {
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

    scrollToElementInlineNearest(element: ElementRef | Element): void {
        if (element) {
            let node: Element;
            if (element instanceof Element) {
                node = element;
            } else {
                node = element.nativeElement;
            }
            //TODO: Implement a alternate scrollTo and remove dependency on third party lib
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

            isSafari
                ? safariScrollIntoView(node, { behavior: 'smooth', block: 'end', inline: 'nearest' })
                : node.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        }
    }

    scrollToElementBySelector(selector: string) {
        timer(0).subscribe(() => {
            const element = this.document.querySelector(selector);
            this.scrollToElement(element);
        });
    }

    scrollToElementBySelectorInlineNearest(selector: string) {
        const element = this.document.querySelector(selector);
        this.scrollToElementInlineNearest(element);
    }

    scrollToTop() {
        timer(0).subscribe(() => {
            this.document.body.scrollTop = 0;
        });
    }
}
