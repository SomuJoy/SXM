import { createAction, props } from '@ngrx/store';

export const behaviorEventImpressionForPage = createAction('[Behavior Event] Impression - page', props<{ pageKey: string; componentKey: string }>());
export const behaviorEventImpressionForComponent = createAction('[Behavior Event] Impression - component', props<{ componentName: string }>());
export const behaviorEventImpressionForPageFlowName = createAction('[Behavior Event] Impression - page flowName', props<{ flowName: string }>());

export const behaviorEventImpressionForChatLinkRendered = createAction('[Behavior Event] Impression - Chat Link Rendered');

export const behaviorEventImpressionForAccountSnapshotAlertDisplayed = createAction(
    '[Behavior Event] Impression - Account Snapshot - Alert displayed',
    props<{ types: string[] }>()
);
