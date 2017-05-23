import { ViewController, NavParams, PopoverController } from "ionic-angular";
import { Component } from "@angular/core";
import { ICategoryItem } from "../../../../contracts";
import { UI } from "../../../../app/helpers";
import { VariationRatePopover } from "../variation-rate/rate.popover";
import { BasePopover } from "../../../../app/infrastructure/index";

@Component({
    templateUrl: "variations.popover.html",
    selector: "variations-popover"
})
export class VariationsPopover extends BasePopover {
    item: ICategoryItem;
    constructor(public viewCtrl: ViewController, private params: NavParams, private popoverCtrl: PopoverController, private ui: UI) {
        super({ viewCtrl });
        this.item = params.data.item;
    }
    showVariationRate(ev, variation) {
        const firstTime = true;
        if (firstTime) {
            const popover = this.popoverCtrl.create(VariationRatePopover,
                { variation }
                // { cssClass: "wide-popover" }
            );
            popover.present(); // { ev });
        } else {
            this.ui.showToast("You have already rated this variation!");
        }
    }
    close() {
        this.viewCtrl.dismiss();
    }
}
