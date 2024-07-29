import { AnimationTriggerMetadata, trigger, state, style, transition, animate } from '@angular/animations';

const ANIMATION_DURATION = 500;

export enum HideHeightAnimationCollapseState {
    OPENED = 'opened',
    CLOSED = 'closed'
}

export const HideHeightAnimation: AnimationTriggerMetadata = trigger('collapse', [
    state(
        'opened',
        style({
            height: '*'
        })
    ),
    state(
        'closed',
        style({
            height: '0'
        })
    ),
    transition('opened => closed', animate(`${ANIMATION_DURATION}ms ease-in`)),
    transition('closed => opened', animate(`${ANIMATION_DURATION}ms ease-out`))
]);
