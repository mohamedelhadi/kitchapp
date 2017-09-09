import { Component } from "@angular/core";
import { NavController, NavParams, PopoverController, ViewController } from "ionic-angular";
import { LocationPopover } from "./location/location.popover";
import { PhonesPopover } from "./phones/phones.popover";
import { BranchRatePopover } from "./rate/rate.popover";
import { BasePage } from "../../../app/infrastructure/index";
import { RestaurantsData } from "../../../app/services/data/restaurants.data";
import { IRestaurant, IBranch } from "../../../app/contracts/index";
import { Auth } from "../../../app/services/index";

import "rxjs/add/operator/takeUntil";

@Component({
    selector: "page-branches",
    templateUrl: "branches.html"
})
export class Branches extends BasePage {
    public restaurant: IRestaurant;
    constructor(
        private navCtrl: NavController, private navParams: NavParams, private popoverCtrl: PopoverController, private viewCtrl: ViewController,
        private data: RestaurantsData, private auth: Auth) {
        super({});
        this.restaurant = navParams.data;
    }
    public ionViewDidLoad() {
        this.data.getRestaurantBranches(this.restaurant.id)
            .takeUntil(this.viewCtrl.willUnload)
            .subscribe(branches => {
                branches.forEach(branch => {
                    branch.rate.nUserGaveRate1 = Math.ceil(branch.rate.ratesCounts[0] * 10 / branch.rate.usersCount);
                    branch.rate.nUserGaveRate2 = Math.ceil(branch.rate.ratesCounts[1] * 10 / branch.rate.usersCount);
                    branch.rate.nUserGaveRate3 = Math.ceil(branch.rate.ratesCounts[2] * 10 / branch.rate.usersCount);
                    branch.rate.nUserGaveRate4 = Math.ceil(branch.rate.ratesCounts[3] * 10 / branch.rate.usersCount);
                    branch.rate.nUserGaveRate5 = Math.ceil(branch.rate.ratesCounts[4] * 10 / branch.rate.usersCount);
                });
                this.restaurant.branches = branches;
            });
    }
    public showLocation(ev, branch: IBranch) {
        const popover = this.popoverCtrl.create(
            LocationPopover,
            { branch },
            { cssClass: "wide-popover" }
        );
        popover.present();
    }
    public showPhones(ev, branch: IBranch) {
        const popover = this.popoverCtrl.create(
            PhonesPopover,
            { branch },
            { cssClass: "wide-popover" }
        );
        popover.present();
    }
    public async showRate(ev, branch: IBranch) {
        const loggedIn = await this.auth.isLoggedIn();
        if (loggedIn) {
            this.showPopover(branch);
        } else {
            const successfullyLoggedIn = await this.auth.loginWithFacebook(this.translation.Messages.YouNeedToLoginInOrderToRate);
            if (successfullyLoggedIn) {
                this.showPopover(branch);
            }
        }
    }
    public showPopover(branch: IBranch) {
        const popover = this.popoverCtrl.create(
            BranchRatePopover,
            { branch, branches: this.restaurant.branches },
            { cssClass: "wide-popover top-popover" }
        );
        popover.present();
    }
    public onBackButton() {
        this.navCtrl.parent.select(0); // this.navCtrl.parent.parent.pop(); switch to first tab because it feels natural
    }
}
