import { ViewController, NavParams, PopoverController } from "ionic-angular";
import { Component } from "@angular/core";
import { VariationRatePopover } from "../variation-rate/rate.popover";
import { BasePopover } from "../../../../app/infrastructure/index";
import { ICategoryItem } from "../../../../app/contracts/index";
import { UI } from "../../../../app/helpers/index";
import { Auth } from "../../../../app/services/index";

@Component({
    templateUrl: "variations.popover.html",
    selector: "variations-popover"
})
export class VariationsPopover extends BasePopover {
    item: ICategoryItem;
    constructor(public viewCtrl: ViewController, private params: NavParams, private popoverCtrl: PopoverController, private ui: UI, private auth: Auth) {
        super({ viewCtrl });
        this.item = params.data.item;
    }
    showVariationRate(ev) {
        this.auth.isLoggedIn().then(loggedIn => {
            if (loggedIn) {
                this.showPopover();
            } else {
                this.auth.signInWithFacebook().then(() => {
                    this.showPopover();
                });
            }
        });
    }
    showPopover() {
        const popover = this.popoverCtrl.create(VariationRatePopover,
            { item: this.item }
            // { cssClass: "wide-popover" }
        );
        popover.present();
    }
    close() {
        this.viewCtrl.dismiss();
    }
    getBackground() {
        return "url(" + (this.item.variations[0].photo ? this.item.variations[0].photo : "assets/images/item.png") + ") no-repeat center";
    }
}
