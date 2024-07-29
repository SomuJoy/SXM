import { Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'de-care-sheer-id-student-verification',
    templateUrl: './sheer-id-student-verification.component.html',
    styleUrls: ['./sheer-id-student-verification.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule],
})
export class SheerIdStudentVerificationComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() programCode: string;
    @Input() set langPref(lang: string) {
        this.url = this._setUrl(lang);
    }
    @Input() sheerIdIdentificationWidgetUrl: string;
    url: SafeResourceUrl;
    height: string;
    private _destroy$ = new Subject<boolean>();

    constructor(private _sanitizer: DomSanitizer, private _breakpointObserver: BreakpointObserver, private _changeDetectorRef: ChangeDetectorRef, private _store: Store) {}

    ngOnInit() {
        this._listenForBreakpoints();
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'studentVerificationSheerIDLandingPage' }));
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    private _setUrl(langPref: string): SafeResourceUrl {
        const url = `${this.sheerIdIdentificationWidgetUrl}?programCode=${this.programCode}&langPref=${langPref}`;
        return this._sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    private _listenForBreakpoints(): void {
        const numericBreakpoints = {
            xsmall: '(min-width: 320px)',
            small: '(min-width: 540px)',
            medium: '(min-width: 768px)',
            large: '(min-width: 1024px)',
            xlarge: '(min-width: 1336px)',
        };

        this._breakpointObserver
            .observe([numericBreakpoints.xsmall, numericBreakpoints.small, numericBreakpoints.medium, numericBreakpoints.large, numericBreakpoints.xlarge])
            .pipe(takeUntil(this._destroy$))
            .subscribe((state: BreakpointState) => {
                const originalHeight = this.height;
                if (state.breakpoints[numericBreakpoints.xsmall]) {
                    this.height = '720px';
                }
                if (state.breakpoints[numericBreakpoints.small]) {
                    this.height = '615px';
                }
                if (state.breakpoints[numericBreakpoints.medium]) {
                    this.height = '705px';
                }
                if (state.breakpoints[numericBreakpoints.large]) {
                    this.height = '615px';
                }
                originalHeight !== this.height ? this._changeDetectorRef.detectChanges() : null;
            });
    }
}
