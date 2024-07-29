import { Component, Input } from '@angular/core';
import { UpsellsFormBaseComponent } from '../upsells-form-base.component';
import { PackageStreamingCardFormFieldContent } from '@de-care/shared/sxm-ui/ui-package-streaming-upgrade-card-form-field';
import { PackageTermCardFormFieldContent } from '@de-care/shared/sxm-ui/ui-package-term-upgrade-card-form-field';

// export dependent interfaces from this component so implementors can get these from here and not
//  have to import from the child dependencies of this component
export { UpsellPlanCodeOptions } from '../upsells-form-base.component';
export { PackageStreamingCardFormFieldContent } from '@de-care/shared/sxm-ui/ui-package-streaming-upgrade-card-form-field';
export { PackageTermCardFormFieldContent } from '@de-care/shared/sxm-ui/ui-package-term-upgrade-card-form-field';

export interface StreamingUpsellCopy {
    packageCopyContent?: PackageStreamingCardFormFieldContent;
    packageCopyContentWhenTermSelected?: PackageStreamingCardFormFieldContent;
    termCopyContent?: PackageTermCardFormFieldContent;
    termCopyContentWhenPackageSelected?: PackageTermCardFormFieldContent;
}

@Component({
    selector: 'de-care-streaming-upsells-form',
    templateUrl: './streaming-upsells-form.component.html',
    styleUrls: ['./streaming-upsells-form.component.scss'],
})
export class StreamingUpsellsFormComponent extends UpsellsFormBaseComponent {
    translateKeyPrefix = 'DeCareUseCasesCheckoutUiCommonModule.StreamingUpsellsFormComponent';

    @Input() set upsellCopy(upsellCopy: StreamingUpsellCopy) {
        this._copyContent$.next(upsellCopy);
    }
}
