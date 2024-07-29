import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnInit, Input, OnDestroy, ViewChild, Renderer2, AfterViewInit, ElementRef } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { ScrollService } from '@de-care/shared/browser-common/window-scroll';
import { debounceTime, scan, takeUntil } from 'rxjs/operators';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-image-carousel',
    templateUrl: './image-carousel.component.html',
    styleUrls: ['./image-carousel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCarouselComponent implements ComponentWithLocale, OnInit, AfterViewInit, OnDestroy {
    @Input() images: string[];
    @Output() public imageClick = new EventEmitter();
    @ViewChild('carouselContainer') public carouselContainer;
    private _destroy$ = new Subject();
    carouselClickedSubject$ = new BehaviorSubject<number>(0);
    carouselClicked$ = this.carouselClickedSubject$.asObservable().pipe(scan((acc, i) => (acc += i), 0));
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    imageWidth = 250; // Width of image in pixels

    currentState;
    imagesSlice = [];
    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private renderer: Renderer2,
        private readonly _scrollService: ScrollService,
        private readonly element: ElementRef
    ) {
        translationsForComponentService.init(this);
    }

    updateImageStyles = (chunkSize?) => {
        if (this.carouselContainer) {
            const containerRect = this.carouselContainer.nativeElement.getBoundingClientRect();
            const imageElements = this.carouselContainer.nativeElement.querySelectorAll('img');
            imageElements.forEach((imageElement, i) => {
                this.renderer.removeClass(imageElement, 'inactive');
                this.renderer.removeClass(imageElement, 'active');
                if (chunkSize) {
                    this.renderer.addClass(imageElement, i < chunkSize ? 'active' : 'inactive');
                } else {
                    const imgElement = imageElement.getBoundingClientRect();
                    const visiblePixelX = Math.min(imgElement.right, containerRect.right) - Math.max(imgElement.left, containerRect.left);
                    const visiblePercentageX = (visiblePixelX / imgElement.width) * 100;
                    if (visiblePercentageX + 0.1 > 100) {
                        this.renderer.addClass(imageElement, 'active');
                        this.renderer.removeClass(imageElement, 'inactive');
                    } else {
                        this.renderer.addClass(imageElement, 'inactive');
                        this.renderer.removeClass(imageElement, 'active');
                    }
                }
            });
        }
    };

    ngAfterViewInit(): void {
        fromEvent(this.carouselContainer.nativeElement, 'scroll')
            .pipe(debounceTime(100), takeUntil(this._destroy$))
            .subscribe(() => {
                this.updateImageStyles();
            });
    }

    ngOnDestroy(): void {
        this._destroy$.next();
    }

    ngOnInit(): void {
        this.imagesSlice = this.getChunks(Math.floor(window.innerWidth / this.imageWidth) - 1 || 1);
        this.currentState = Math.round(window.innerWidth / this.imageWidth) - 1 || 1;
        this.carouselClicked$.pipe(takeUntil(this._destroy$)).subscribe((currentState) => {
            this._scrollService.scrollToElementBySelectorInlineNearest(`#carousel-container-${currentState}`);
        });
    }

    getChunks(perChunk = 3) {
        return this.images.reduce((resultArray, item, index) => {
            const chunkIndex = Math.floor(index / perChunk);
            if (!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = []; //start a new chunk
            }
            resultArray[chunkIndex].push(item);
            return resultArray;
        }, []);
    }

    listenNow() {
        this.imageClick.emit();
    }
}
