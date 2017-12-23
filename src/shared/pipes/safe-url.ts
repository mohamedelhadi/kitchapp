import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    // tslint:disable-next-line:pipe-naming
    name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {
    constructor(private domSanitizer: DomSanitizer) { }
    public transform(url) {
        return this.domSanitizer.bypassSecurityTrustUrl(url);
    }
}
