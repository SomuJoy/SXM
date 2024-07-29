import { e2eRTCFollowOnSelectionOption, e2eRtcPlanComparisonGridButton } from '@de-care/offers';

export const cyGetRtcPlanComparisonGridButton = () => cy.get(e2eRtcPlanComparisonGridButton);
export const cyGetPlanComparisonGrid = () => cy.get('plan-comparison-grid');
export const cyGetFollowOnSelectionOptions = () => cy.get(e2eRTCFollowOnSelectionOption);
