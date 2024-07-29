import { Component, ChangeDetectionStrategy, Input, ViewEncapsulation, OnChanges, SimpleChanges, ViewChildren, QueryList, HostBinding } from '@angular/core';
import { IconsDataModel } from '@de-care/shared/sxm-ui/ui-package-icons';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';

interface Details {
    title: string;
    description: string[];
}
export interface PackageData {
    platformPlan: string;
    priceAndTermDescTitle: string;
    processingFeeDisclaimer: string;
    icons: IconsDataModel;
    detailsTitle?: string;
    details: string[];
    toggleCollapsed?: string;
    toggleExpanded?: string;
    footer: string;
    theme: string;
    presentation: string;
    longDescription?: string;
    packageFeatures?: {
        packageName: string;
        features: {
            name: string;
            tooltipText: string;
            shortDescription: string;
            learnMoreLinkText: string;
            learnMoreInformation: string;
        }[];
    }[];
    numberOfBullets?: number;
}

@Component({
    selector: 'sxm-ui-primary-package-card',
    templateUrl: './primary-package-card.component.html',
    styleUrls: ['./primary-package-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiPrimaryPackageCardComponent implements OnChanges {
    translateKeyPrefix = 'SharedSxmUiUiPrimaryPackageCardModule.SxmUiPrimaryPackageCardComponent.';
    @Input() packageData: PackageData;
    @Input() chevronClickTrackingText = 'Explore More';
    chevronClickTrackingTextForDataLinkKey = 'explore-more';
    visibleDetails: string[] = [];
    accordionDetails: string[] = [];
    @ViewChildren('learnMoreAboutModal') learnMoreAboutModals: QueryList<SxmUiModalComponent>;
    @HostBinding('class.presentation-no-icons') get noIconClass() {
        return this.packageData?.presentation === 'Presentation5';
    }
    visiblePackageFeatures: {
        packageName: string;
        features: {
            name: string;
            tooltipText: string;
            shortDescription: string;
            learnMoreLinkText: string;
            learnMoreInformation: string;
        }[];
    }[] = [];

    accordionPackageFeatures: {
        packageName: string;
        features: {
            name: string;
            tooltipText: string;
            shortDescription: string;
            learnMoreLinkText: string;
            learnMoreInformation: string;
        }[];
    }[] = [];

    ngOnChanges(simpleChanges: SimpleChanges) {
        if (this.packageData?.numberOfBullets && this.packageData?.details?.length === 0) {
            this.accordionDetails = this.packageData?.details || [];
            this.visibleDetails = [];
            this.visiblePackageFeatures = [];
            this.accordionPackageFeatures = [];
            this.packageData?.packageFeatures?.forEach((p) =>
                this.visiblePackageFeatures.push({
                    packageName: '',
                    features: p.features.slice(0, this.packageData.numberOfBullets),
                })
            );
            this.packageData?.packageFeatures?.forEach((p) =>
                this.accordionPackageFeatures.push({
                    packageName: '',
                    features: p.features.slice(this.packageData.numberOfBullets),
                })
            );
        } else {
            this.accordionPackageFeatures = this.packageData?.packageFeatures;
        }

        if (this.packageData?.presentation === 'Presentation4') {
            this.visibleDetails = this.packageData.details.slice(0, 3);
            this.accordionDetails = this.packageData.details.slice(3);
        } else {
            this.accordionDetails = this.packageData?.details || [];
            this.visibleDetails = [];
        }

        if (this.chevronClickTrackingText) {
            this.chevronClickTrackingTextForDataLinkKey = this.chevronClickTrackingText?.replace(' ', '-')?.toLowerCase();
        }
    }

    learnMoreAboutModalOpen(index: number) {
        this.learnMoreAboutModals.get(index - 1).open();
    }

    learnMoreAboutModalClose(index: number) {
        this.learnMoreAboutModals.get(index - 1).close();
    }
}
