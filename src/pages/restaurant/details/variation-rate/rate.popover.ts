import { ViewController, NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { IVariation, IVariationRate } from "../../../../contracts";
import { BasePopover } from "../../../../app/infrastructure/index";

@Component({
    templateUrl: "rate.popover.html",
    selector: "variation-rate-popover"
})
export class VariationRatePopover extends BasePopover {
    variation: IVariation;
    rate: number = 3;
    constructor(public viewCtrl: ViewController, private params: NavParams) {
        super({ viewCtrl });
        this.variation = params.data.variation;
    }
    onChange() {
        // change
    }
    close() {
        this.viewCtrl.dismiss();
    }
}
