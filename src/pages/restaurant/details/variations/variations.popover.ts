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
    public item: ICategoryItem;
    constructor(public viewCtrl: ViewController, private params: NavParams, private popoverCtrl: PopoverController, private ui: UI, private auth: Auth) {
        super({ viewCtrl });
        this.item = params.data.item;
    }
    public showVariationRate(ev) {
        this.auth.isLoggedIn().then(loggedIn => {
            if (loggedIn) {
                this.showPopover();
            } else {
                this.auth.loginWithFacebook().then(successfulLogin => {
                    if (successfulLogin) {
                        this.showPopover();
                    }
                });
            }
        });
    }
    public showPopover() {
        const popover = this.popoverCtrl.create(
            VariationRatePopover,
            { item: this.item },
            { cssClass: "top-popover" }
        );
        popover.present();
    }
    public close() {
        this.viewCtrl.dismiss();
    }
    public getBackground() {
        return `url(${this.item.variations[0].photo}) no-repeat center, url('assets/images/item.png') no-repeat center`; // "url(" + (this.item.variations[0].photo ? this.item.variations[0].photo : "assets/images/item.png") + ") no-repeat center";
    }
}
