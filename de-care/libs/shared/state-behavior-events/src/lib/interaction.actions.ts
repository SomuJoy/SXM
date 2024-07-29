import { createAction, props } from '@ngrx/store';

export const behaviorEventInteraction = createAction('[Behavior Event] Interaction', props<{ data: any }>());
export const behaviorEventInteractionLinkClick = createAction('[Behavior Event] Interaction - link click', props<{ linkName: string; linkType: string; linkKey?: string }>());
export const behaviorEventInteractionButtonClick = createAction('[Behavior Event] Interaction - button click', props<{ data: any }>());
export const behaviorEventInteractionModalOpened = createAction('[Behavior Event] Interaction - model opened', props<{ data: any }>());
export const behaviorEventInteractionModalClosed = createAction('[Behavior Event] Interaction - model closed', props<{ data: any }>());
export const behaviorEventInteractionEditClick = createAction('[Behavior Event] Interaction - Accordion Edit Click', props<{ componentNametoEdit: string }>());
export const behaviorEventInteractionAmazonSupportLinkClick = createAction('[Behavior Event] Interaction - Amazon Support Link Click');
export const behaviorEventInteractionChevronClick = createAction('[Behavior Event] Interaction - chevron clic', props<{ componentName: string; linkText: string }>());
export const behaviorEventInteractionContinueVerifyOptionSelected = createAction(
    '[Behavior Event] Interaction - Click Continue after Verify Option Selection',
    props<{ selectedVerificationOption: string }>()
);
