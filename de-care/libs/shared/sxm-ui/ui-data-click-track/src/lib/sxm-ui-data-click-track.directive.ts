import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { behaviorEventInteractionLinkClick } from '@de-care/shared/state-behavior-events';

@Directive({ selector: '[sxmUiDataClickTrack]' })
export class SxmUiDataClickTrackDirective {
    constructor(private readonly _store: Store, private readonly _element: ElementRef) {}
    @Input() sxmUiDataClickTrack: 'routing' | 'submit' | 'modal' | 'ui' | 'exit' | 'player' | 'download' | 'chat' | 'refresh' | 'login';
    @HostListener('click')
    onClick(): void {
        const linkName = this._element.nativeElement?.attributes['data-link-name']?.value ?? this._element.nativeElement.innerText;
        const linkKey = this._element.nativeElement?.attributes['data-link-key']?.value;
        this._store.dispatch(
            behaviorEventInteractionLinkClick({
                linkName: linkName,
                linkType: this.sxmUiDataClickTrack,
                ...(!!linkKey && { linkKey }),
            })
        );
    }
}
