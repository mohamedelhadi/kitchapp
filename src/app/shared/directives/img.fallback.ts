import { Directive, Input, ElementRef, HostBinding, HostListener } from "@angular/core";

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: "img[fallback]",
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        "(error)": "onError()"
    }
})
export class ImageFallbackDirective {
    @Input() public src: string;
    @Input() public fallback: string | boolean;
    constructor(private el: ElementRef) {
    }
    @HostBinding("src")
    public get imgSrc() {
        return this.src ? this.src : this.fallback;
    }
    public onError() {
        if (this.fallback === "false" || this.fallback === false) {
            this.el.nativeElement.style.display = "none";
        } else {
            this.el.nativeElement.src = this.fallback;
        }
    }
}