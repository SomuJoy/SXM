import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'de-care-student-reverification-flow',
    templateUrl: './student-reverification-flow.component.html',
    styleUrls: ['./student-reverification-flow.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule],
})
export class StudentReverificationFlowComponent {}
