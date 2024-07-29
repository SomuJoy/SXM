import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import { fromIntersectionObserver } from './intersection-observer';

@Directive({
    selector: '[intersectionObserver]'
})
export class IntersectionObserverDirective implements OnInit {
    @Input() intersectionRootMargin = '0px';
    @Input() intersectionRoot: HTMLElement;
    @Input() intersectionThreshold: number | number[];

    @Output() visibilityChange = new EventEmitter<boolean>();

    constructor(private readonly _element: ElementRef) {}

    ngOnInit() {
        const element = this._element.nativeElement;
        const config = {
            root: this.intersectionRoot,
            rootMargin: this.intersectionRootMargin,
            threshold: this.intersectionThreshold
        };

        fromIntersectionObserver(element, config)
            .pipe(take(1))
            .subscribe(status => {
                this.visibilityChange.emit(status);
            });
    }
}
