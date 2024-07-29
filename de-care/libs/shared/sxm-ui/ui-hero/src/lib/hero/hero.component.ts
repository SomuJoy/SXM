import { Component, Input, ChangeDetectionStrategy, ViewChild, ElementRef, NgZone } from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

interface HeroData {
    title: string;
    subtitle: string;
    imageUrl?: string;
    presentation?: PresentationModel;
    classes?: string;
}
interface PresentationModel {
    theme?: string;
    style?: string;
}

@Component({
    selector: 'sxm-ui-hero',
    templateUrl: './hero.component.html',
    styleUrls: ['./hero.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SxmUiHeroComponent {
    @Input() heroData: HeroData;
    @ViewChild('title', { static: true }) private _title: ElementRef;

    centerSubtitle$ = new Observable(subscriber => {
        const ro = new ResizeObserver(entries => {
            this._zone.run(() => {
                subscriber.next(entries);
            });
        });
        const elem = this._title.nativeElement;
        ro.observe(elem);

        return function unsubscribe() {
            ro.unobserve(elem);
        };
    }).pipe(
        map(entries => {
            const width = Math.floor(entries[0].target.clientWidth); //getting width directly from element, since contentRect.width is sometimes slightly off
            const parentWidth = Math.floor(entries[0].target.parentElement.clientWidth);
            return width < parentWidth;
        }),
        distinctUntilChanged()
    );

    constructor(private readonly _zone: NgZone) {}
}
