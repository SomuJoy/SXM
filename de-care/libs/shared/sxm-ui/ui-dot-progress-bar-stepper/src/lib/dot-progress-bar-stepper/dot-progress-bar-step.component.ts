import { Component, EventEmitter, Output, ContentChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CdkStep, CdkStepper } from '@angular/cdk/stepper';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'sxm-ui-dot-progress-bar-step',
    template: `
        <ng-template><ng-content></ng-content></ng-template>
    `,
    providers: [{ provide: CdkStep, useExisting: DotProgressBarStepComponent }]
})
export class DotProgressBarStepComponent extends CdkStep implements AfterViewInit, OnDestroy {
    @Output() active = new EventEmitter<boolean>();
    @Output() subStepActive = new EventEmitter<number>();
    @ContentChild('subStepper', { static: true }) subStepper: CdkStepper;
    private _destroy$: Subject<boolean> = new Subject<boolean>();
    ngAfterViewInit() {
        if (this.subStepper) {
            this.subStepper.selectionChange.pipe(takeUntil(this._destroy$)).subscribe(step => {
                this.subStepActive.emit(step.selectedIndex);
            });
            if (this.subStepper.selected) {
                this.subStepActive.emit(this.subStepper.selectedIndex);
            }
        }
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }
}
