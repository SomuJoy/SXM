import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'sxm-ui-card-with-cta',
    templateUrl: './card-with-cta.component.html',
    styleUrls: ['./card-with-cta.component.scss']
})
export class SxmUiCardWithCtaComponent implements OnInit {
    @Input() title: string;
    @Input() buttonCopy: string;
    @Input() buttonClass: string = 'primary';
    @Output() action = new EventEmitter();

    constructor() {}

    ngOnInit() {}
}
