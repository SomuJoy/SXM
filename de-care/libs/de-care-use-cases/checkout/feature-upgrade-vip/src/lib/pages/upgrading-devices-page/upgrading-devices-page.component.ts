import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleModel } from '@de-care/data-services';
import {
    getFirstDevice,
    getSecondDevice,
    getFirstDeviceStatus,
    getSecondDeviceStatus,
    getSelectedStreamingAccount,
} from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import { VehicleInfoTranslatePipe } from '@de-care/domains/vehicle/ui-vehicle-info';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { LANGUAGE_CODES } from '@de-care/shared/translation';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { interval, Subject } from 'rxjs';
import { map, startWith, takeUntil, withLatestFrom } from 'rxjs/operators';

@Component({
    selector: 'de-care-upgrading-devices-page',
    templateUrl: './upgrading-devices-page.component.html',
    styleUrls: ['./upgrading-devices-page.component.scss'],
})
export class UpgradingDevicesPageComponent implements AfterViewInit, OnDestroy {
    private _destroy$: Subject<boolean> = new Subject<boolean>();

    currentLang$ = this._translateService.onLangChange.pipe(
        takeUntil(this._destroy$),
        map((ev) => ev.lang)
    );

    currentLangIsFrench$ = this.currentLang$.pipe(map((lang) => lang === LANGUAGE_CODES.FR_CA));

    timer;
    animationDuration = 10000;
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeVipModule.UpgradingDevicesPageComponent.';

    tasksSuccessStatus: boolean;
    isFirstDeviceOnly: boolean;

    taskData$ = this._store.pipe(
        select(getFirstDevice),
        withLatestFrom(
            this._store.pipe(select(getFirstDeviceStatus)),
            this._store.pipe(select(getSecondDevice)),
            this._store.pipe(select(getSecondDeviceStatus)),
            this._store.pipe(select(getSelectedStreamingAccount)),
            this.currentLangIsFrench$.pipe(startWith(false))
        ),
        takeUntil(this._destroy$),
        map(([firstDevice, firstDeviceStatus, secondDevice, secondDeviceStatus, streamingAccount, isFrench]) => {
            this.isFirstDeviceOnly = !secondDevice;
            this.tasksSuccessStatus = this.isFirstDeviceOnly ? firstDeviceStatus === 'success' : firstDeviceStatus === 'success' && secondDeviceStatus === 'success';

            const tasks = {
                tasks: [
                    {
                        taskName: `${this._translateService.instant(this.translateKeyPrefix + 'UPGRADING')} ${this._vehicleInfoTranslatePipe.transform(
                            firstDevice.vehicle as VehicleModel,
                            {
                                isFrench,
                                defaultText: this._translateService.instant(this.translateKeyPrefix + 'RADIO', { radioId: firstDevice.radioId }),
                            }
                        )}`,
                        success: firstDeviceStatus === 'success',
                    },
                    ...(secondDevice
                        ? [
                              {
                                  taskName: `${this._translateService.instant(this.translateKeyPrefix + 'UPGRADING')} ${this._vehicleInfoTranslatePipe.transform(
                                      secondDevice.vehicle as VehicleModel,
                                      {
                                          isFrench,
                                          defaultText: this._translateService.instant(this.translateKeyPrefix + 'RADIO', { radioId: secondDevice.radioId }),
                                      }
                                  )}`,
                                  success: secondDeviceStatus === 'success',
                              },
                          ]
                        : []),
                    ...(streamingAccount
                        ? [
                              {
                                  taskName: `${this._translateService.instant(this.translateKeyPrefix + 'UPGRADING')} 
                                      ${this._translateService.instant(this.translateKeyPrefix + 'STREAMINGPLAN', {
                                          streamingPlan: streamingAccount.maskedUserName ? streamingAccount.maskedUserName : streamingAccount.userName,
                                      })}`,
                                  success: secondDeviceStatus === 'success',
                              },
                          ]
                        : []),
                ],
            };

            return tasks;
        })
    );

    constructor(
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _translateService: TranslateService,
        private readonly _vehicleInfoTranslatePipe: VehicleInfoTranslatePipe
    ) {}

    ngAfterViewInit(): void {
        this._store.dispatch(
            behaviorEventImpressionForComponent({
                componentName: 'Upgrade Interstitial',
            })
        );

        this.timer = interval(this.animationDuration).subscribe(() => {
            this._moveToNextStep();
        });
    }

    ngOnDestroy() {
        this.timer.unsubscribe();
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    private _moveToNextStep() {
        this._router.navigateByUrl('/subscribe/upgrade-vip/thanks');
    }
}
