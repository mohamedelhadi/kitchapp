import { ViewController, NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { BasePopover } from "../../../../app/infrastructure/index";
import { IBranch } from "../../../../app/contracts/index";

@Component({
    templateUrl: "phones.popover.html",
    selector: "phones-popover"
})
export class PhonesPopover extends BasePopover {
    public branch: IBranch;
    constructor(public viewCtrl: ViewController, private params: NavParams, private sanitizer: DomSanitizer) {
        super({ viewCtrl });
        this.branch = params.data.branch;
    }
    public sanitize(phone: string) {
        return this.sanitizer.bypassSecurityTrustUrl("tel:" + phone);
    }
    public close() {
        this.viewCtrl.dismiss();
    }
}
