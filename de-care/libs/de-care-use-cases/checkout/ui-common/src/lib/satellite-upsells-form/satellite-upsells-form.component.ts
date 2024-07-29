import { Component, Input } from '@angular/core';
import { UpsellsFormBaseComponent } from '../upsells-form-base.component';
import { PackageSatelliteCardFormFieldContent } from '@de-care/shared/sxm-ui/ui-package-satellite-upgrade-card-form-field';
import { PackageTermCardFormFieldContent } from '@de-care/shared/sxm-ui/ui-package-term-upgrade-card-form-field';

// export dependent interfaces from this component so implementors can get these from here and not
//  have to import from the child dependencies of this component
export { UpsellPlanCodeOptions } from '../upsells-form-base.component';
export { PackageSatelliteCardFormFieldContent } from '@de-care/shared/sxm-ui/ui-package-satellite-upgrade-card-form-field';
export { PackageTermCardFormFieldContent } from '@de-care/shared/sxm-ui/ui-package-term-upgrade-card-form-field';

export interface SatelliteUpsellCopy {
    packageCopyContent?: PackageSatelliteCardFormFieldContent;
    packageCopyContentWhenTermSelected?: PackageSatelliteCardFormFieldContent;
    termCopyContent?: PackageTermCardFormFieldContent;
    termCopyContentWhenPackageSelected?: PackageTermCardFormFieldContent;
}

@Component({
    selector: 'de-care-satellite-upsells-form',
    templateUrl: './satellite-upsells-form.component.html',
    styleUrls: ['./satellite-upsells-form.component.scss'],
})
export class SatelliteUpsellsFormComponent extends UpsellsFormBaseComponent {
    translateKeyPrefix = 'DeCareUseCasesCheckoutUiCommonModule.SatelliteUpsellsFormComponent';

    @Input() set upsellCopy(upsellCopy: SatelliteUpsellCopy) {
        this._copyContent$.next(upsellCopy);
    }
}
