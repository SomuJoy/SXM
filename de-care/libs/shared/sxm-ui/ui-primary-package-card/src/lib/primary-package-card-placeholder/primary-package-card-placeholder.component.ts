import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'sxm-ui-primary-package-card-placeholder',
    template: `
        <section>
            <article>
                <div class="title content-spot"></div>
                <div class="description content-spot"></div>
            </article>
            <ul>
                <li class="content-spot"></li>
                <li class="content-spot"></li>
                <li class="content-spot"></li>
                <li class="content-spot"></li>
                <li class="content-spot"></li>
            </ul>
        </section>
        <footer class="content-spot">
            <div></div>
        </footer>
    `,
    styleUrls: ['./primary-package-card-placeholder.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiPrimaryPackageCardPlaceholderComponent {}

@NgModule({
    declarations: [SxmUiPrimaryPackageCardPlaceholderComponent],
    exports: [SxmUiPrimaryPackageCardPlaceholderComponent],
    imports: [],
})
export class SxmUiPrimaryPackageCardPlaceholderComponentModule {}
