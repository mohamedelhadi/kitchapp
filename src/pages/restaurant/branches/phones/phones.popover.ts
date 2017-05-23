import { ViewController, NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { IBranch } from "../../../../contracts";
import { DomSanitizer } from "@angular/platform-browser";
import { BasePopover } from "../../../../app/infrastructure/index";

@Component({
    templateUrl: "phones.popover.html",
    selector: "phones-popover"
})
export class PhonesPopover extends BasePopover {
    branch: IBranch;
    constructor(public viewCtrl: ViewController, private params: NavParams, private sanitizer: DomSanitizer) {
        super({ viewCtrl });
        this.branch = params.data.branch;
    }
    sanitize(phone: string) {
        return this.sanitizer.bypassSecurityTrustUrl("tel:" + phone);
    }
    close() {
        this.viewCtrl.dismiss();
    }
}
