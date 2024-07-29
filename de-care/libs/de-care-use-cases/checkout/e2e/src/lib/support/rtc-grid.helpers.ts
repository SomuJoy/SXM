import { cyGetFollowonSelectionOptions, cyGetPlanComparisonGridButton } from './rtc.po';

export function selectRtcSelectionOption(index: number): void {
    cyGetFollowonSelectionOptions()
        .eq(index)
        .click();
}

export function clickContinueRtcButton(): void {
    cyGetPlanComparisonGridButton().click({ force: true });
}
