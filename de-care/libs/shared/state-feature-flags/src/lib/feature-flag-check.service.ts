import { Injectable } from '@angular/core';
import { isOn } from 'feature-toggle-service';
import { FeatureFlagsInApp } from './state/models';

@Injectable({
    providedIn: 'root'
})
export class FeatureFlagCheck {
    isEnabled(key: keyof FeatureFlagsInApp) {
        return isOn(key);
    }
}
