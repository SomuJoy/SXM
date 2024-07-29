import { Directive, ElementRef, HostListener } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { filter, take } from 'rxjs/operators';

@Directive({
    selector: 'form[sxmUiForceUpdateFormFieldOnEnterKey]',
    standalone: true,
})
export class ForceUpdateFormFieldOnEnterKeyDirective {
    isListeningForStatusChange = false;
    @HostListener('keydown.enter') onEnterKey() {
        const focusedField = this.elementRef.nativeElement.querySelector<HTMLInputElement>('*:focus');
        if (focusedField) {
            focusedField.blur();
            focusedField.focus();
            if (!this.isListeningForStatusChange && this.fg.status === 'PENDING') {
                this.isListeningForStatusChange = true;
                this.fg.statusChanges
                    ?.pipe(
                        filter((status) => status !== 'PENDING'),
                        take(1)
                    )
                    .subscribe((status) => {
                        this.fg.ngSubmit.emit();
                        this.isListeningForStatusChange = false;
                    });
            }
        }
    }
    constructor(private fg: FormGroupDirective, private readonly elementRef: ElementRef<HTMLFormElement>) {}
}
