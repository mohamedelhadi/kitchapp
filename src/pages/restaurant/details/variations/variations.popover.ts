import { ViewController, NavParams } from "ionic-angular";
import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { ICategoryItem } from "../../../../contracts";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    templateUrl: "variations.popover.html",
    selector: "variations-popover"
})
export class VariationsPopover implements OnInit {
    item: ICategoryItem;
    constructor(public viewCtrl: ViewController, private params: NavParams, private sanitizer: DomSanitizer) {
        this.item = params.data.item;
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
