import { ViewController, NavParams } from "ionic-angular";
import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { IBranch } from "../../../../contracts";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    templateUrl: "phones.popover.html",
    selector: "phones-popover"
})
export class PhonesPopover implements OnInit {
    @ViewChild("map") map: ElementRef;
    branch: IBranch;
    constructor(public viewCtrl: ViewController, private params: NavParams, private sanitizer: DomSanitizer) {
        this.branch = params.data.branch;
    }
    ngOnInit(): void {
        // init
    }
    sanitize(phone: string) {
        return this.sanitizer.bypassSecurityTrustUrl("tel:" + phone);
    }
    close() {
        this.viewCtrl.dismiss();
    }
}
