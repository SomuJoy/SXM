import { first, takeUntil } from 'rxjs/operators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getSheerIdIdentificationReVerificationWidgetUrl } from '@de-care/shared/state-settings';

export interface StudentReVerificationData {
    programCode: string;
    tkn: string;
    redirectUrl: string;
    langPref: string;
}

@Component({
    selector: 'de-care-student-re-verification',
    templateUrl: './student-re-verification.component.html',
    styleUrls: ['./student-re-verification.component.scss'],
})
export class StudentReVerificationComponent implements OnInit, OnDestroy {
    @Input() set studentReVerificationData(data: StudentReVerificationData) {
        this.url = !!data && this._setUrl(data);
    }
    url: SafeResourceUrl;
    height: string;
    sheerIdIdentificationReVerificationWidgetUrl: string;
    private _destroy$ = new Subject<boolean>();

    constructor(private _sanitizer: DomSanitizer, private _breakpointObserver: BreakpointObserver, private _changeDetectorRef: ChangeDetectorRef, private _store: Store) {
        _store.pipe(select(getSheerIdIdentificationReVerificationWidgetUrl), takeUntil(this._destroy$)).subscribe((sheerIDUrl) => {
            this.sheerIdIdentificationReVerificationWidgetUrl = sheerIDUrl;
        });
    }

    ngOnInit(): void {
        this._listenForBreakpoints();
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    private _setUrl(data: StudentReVerificationData): SafeResourceUrl {
        const { programCode, langPref, tkn, redirectUrl } = data;
        const url = `${this.sheerIdIdentificationReVerificationWidgetUrl}?programCode=${programCode}&langPref=${langPref}&tkn=${tkn}&redirectURL=${redirectUrl}`;
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
                    this.height = '740px';
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
