import { ViewController, NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { ICategoryItem } from "../../../../contracts";

@Component({
    templateUrl: "variations.popover.html",
    selector: "variations-popover"
})
export class VariationsPopover {
    item: ICategoryItem;
    constructor(public viewCtrl: ViewController, private params: NavParams) {
        this.item = params.data.item;
    }
    close() {
        this.viewCtrl.dismiss();
    }
}
