import { SettingsService } from '@de-care/settings';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentReVerificationComponent } from './student-re-verification.component';

describe('StudentReVerificationComponent', () => {
    let component: StudentReVerificationComponent;
    let fixture: ComponentFixture<StudentReVerificationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StudentReVerificationComponent],
            providers: [
                {
                    provide: SettingsService,
                    useValue: {
                        settings: {
                            sheerIdIdentificationWidgetUrl: ''
                        }
                    }
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StudentReVerificationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
