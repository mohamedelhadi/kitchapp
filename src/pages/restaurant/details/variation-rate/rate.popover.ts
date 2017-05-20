import { ViewController, NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { IVariation, IVariationRate } from "../../../../contracts";

@Component({
    templateUrl: "rate.popover.html",
    selector: "variation-rate-popover"
})
export class VariationRatePopover {
    variation: IVariation;
    rate: number = 3;
    constructor(public viewCtrl: ViewController, private params: NavParams) {
        this.variation = params.data.variation;
    }
    onChange() {
        // change
    }
    close() {
        this.viewCtrl.dismiss();
    }
}
