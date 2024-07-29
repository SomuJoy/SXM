import { Directive, Output, ElementRef, Renderer2, OnInit, EventEmitter } from '@angular/core';

@Directive({
    selector: '[toolTipIcon]'
})
export class TooltipIconDirective implements OnInit {
    @Output() tooltipIconClicked = new EventEmitter();

    constructor(private readonly el: ElementRef, private readonly renderer: Renderer2) {}

    ngOnInit(): void {
        const div = this.renderer.createElement('div');
        const svg = this.renderer.createElement('svg', 'svg');
        const useSvg = this.renderer.createElement('use', 'svg');
        this.renderer.setAttribute(useSvg, 'href', '#icon-tool-tip');
        this.renderer.appendChild(svg, useSvg);
        this.renderer.appendChild(div, svg);
        this.renderer.appendChild(this.el.nativeElement, div);
        this.renderer.setStyle(div, 'position', 'absolute');
        this.renderer.setStyle(div, 'right', '5px');
        this.renderer.setStyle(div, 'top', '15px');
        this.renderer.addClass(svg, 'icon-utility');
        this.renderer.addClass(svg, 'large');
        this.renderer.addClass(useSvg, 'icon-tool-tip');
        this.renderer.listen(useSvg, 'click', event => this.tooltipIconClicked.emit(event));
    }
}
