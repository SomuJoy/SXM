import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyToExploreWrapperComponent } from './ready-to-explore-wrapper.component';

describe('ReadyToExploreWrapperComponent', () => {
    let component: ReadyToExploreWrapperComponent;
    let fixture: ComponentFixture<ReadyToExploreWrapperComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ReadyToExploreWrapperComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReadyToExploreWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
