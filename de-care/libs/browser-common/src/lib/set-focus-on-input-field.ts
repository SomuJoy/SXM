import { ElementRef } from '@angular/core';

export function setFocusOnInputField(element: ElementRef): void {
    if (element && element.nativeElement) {
        element.nativeElement.select();
        element.nativeElement.focus();
        element.nativeElement.scrollIntoView({ block: 'center' });
    }
}
