import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'isTrialPlan', pure: true })
export class IsTrialPlan implements PipeTransform {
    transform(value: string): boolean {
        return !!value && value.toLowerCase().includes('trial');
    }
}
