import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SharedSxmUiUiIconCarModule } from '@de-care/shared/sxm-ui/ui-icon-car';
import { SharedSxmUiUiIconCustomStationsModule } from '@de-care/shared/sxm-ui/ui-icon-custom-stations';
import { SharedSxmUiUiIconPerksModule } from '@de-care/shared/sxm-ui/ui-icon-perks';
import { SharedSxmUiUiIconStreamingModule } from '@de-care/shared/sxm-ui/ui-icon-streaming';

export interface IconsDataModel {
    inside: Icon;
    outside: Icon;
    pandora: Icon;
    perks?: Icon;
    vip?: Icon;
}

interface Icon {
    isActive: boolean;
    label: string;
}

@Component({
    selector: 'sxm-ui-package-icons',
    templateUrl: './package-icons.component.html',
    styleUrls: ['./package-icons.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, SharedSxmUiUiIconCarModule, SharedSxmUiUiIconCustomStationsModule, SharedSxmUiUiIconStreamingModule, SharedSxmUiUiIconPerksModule],
})
export class SxmUiPackageIconsComponent {
    @Input() iconsData: IconsDataModel;
}
