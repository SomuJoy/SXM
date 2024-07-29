import { Component, OnInit, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'de-care-shell-basic',
    templateUrl: './shell-basic.component.html',
    styleUrls: ['./shell-basic.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellBasicComponent implements OnInit {
    @HostBinding('class.dark-theme') darkMode: boolean;
    @HostBinding('class.blue-header-theme') blueHeaderMode: boolean;

    constructor(private readonly _route: ActivatedRoute) {}

    ngOnInit(): void {
        this.darkMode = this._route.snapshot.data?.shellBasic?.darkMode;
        this.blueHeaderMode = this._route.snapshot.data?.shellBasic?.blueHeaderMode;
    }
}
