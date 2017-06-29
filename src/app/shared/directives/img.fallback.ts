import { Directive, Input, ElementRef } from "@angular/core";

@Directive({
    selector: "img[fallback]",
    host: {
        "[src]": "setSRC(src)",
        "(error)": "onError()"
    }
})
export class ImageFallback {
    @Input() src: string;
    @Input() fallback: string | boolean;
    constructor(private el: ElementRef) {
    }
    public setSRC(src: string) {
        return src ? src : this.fallback;
        // setting display none here won't prevent onError from being called
    }
    public onError() {
        if (this.fallback === "false" || this.fallback === false) {
            this.el.nativeElement.style.display = "none";
        } else {
            this.el.nativeElement.src = this.fallback;
        }
    }
}