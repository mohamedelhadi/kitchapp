import { ViewController, NavParams, PopoverController } from "ionic-angular";
import { Component } from "@angular/core";
import { VariationRatePopover } from "../variation-rate/rate.popover";
import { BasePopover } from "../../../../app/infrastructure/index";
import { ICategoryItem } from "../../../../app/contracts/index";
import { UI } from "../../../../app/helpers/index";

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
        const popover = this.popoverCtrl.create(VariationRatePopover,
            { variation }
            // { cssClass: "wide-popover" }
        );
        popover.present(); // { ev });
    }
    close() {
        this.viewCtrl.dismiss();
    }
}
