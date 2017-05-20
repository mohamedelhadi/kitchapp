import { ViewController, NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { IBranch } from "../../../../contracts";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    templateUrl: "phones.popover.html",
    selector: "phones-popover"
})
export class PhonesPopover {
    branch: IBranch;
    constructor(public viewCtrl: ViewController, private params: NavParams, private sanitizer: DomSanitizer) {
        this.branch = params.data.branch;
    }
    sanitize(phone: string) {
        return this.sanitizer.bypassSecurityTrustUrl("tel:" + phone);
    }
    close() {
        this.viewCtrl.dismiss();
    }
}
