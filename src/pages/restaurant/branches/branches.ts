import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, PopoverController, ViewController } from "ionic-angular";
import { Subject } from "rxjs/Subject";
import { LocationPopover } from "./location/location.popover";
import { PhonesPopover } from "./phones/phones.popover";
import { BranchRatePopover } from "./rate/rate.popover";
import { BasePage } from "../../../app/infrastructure/index";
import { RestaurantsData } from "../../restaurants/restaurants.data";
import { IRestaurant, IBranch } from "../../../app/contracts/index";
import { Logger, UI } from "../../../app/helpers/index";
import { Auth } from "../../../app/services/index";

import "rxjs/add/operator/takeUntil";

@Component({
    selector: "page-branches",
    templateUrl: "branches.html"
})
export class Branches extends BasePage {
    public restaurant: IRestaurant;
    constructor(
        private logger: Logger, private ui: UI,
        private navCtrl: NavController, private navParams: NavParams, private popoverCtrl: PopoverController, private viewCtrl: ViewController,
        private data: RestaurantsData, private auth: Auth) {
        super({ logger });
        this.restaurant = navParams.data;
    }
    public ionViewDidLoad() {
        this.data.getRestaurantBranches(this.restaurant.id)
            .takeUntil(this.viewCtrl.willUnload)
            .subscribe(branches => {
                branches.forEach(branch => {
                    branch.rate.rated1 = Math.ceil(branch.rate.ratesCounts[0] * 10 / branch.rate.usersCount);
                    branch.rate.rated2 = Math.ceil(branch.rate.ratesCounts[1] * 10 / branch.rate.usersCount);
                    branch.rate.rated3 = Math.ceil(branch.rate.ratesCounts[2] * 10 / branch.rate.usersCount);
                    branch.rate.rated4 = Math.ceil(branch.rate.ratesCounts[3] * 10 / branch.rate.usersCount);
                    branch.rate.rated5 = Math.ceil(branch.rate.ratesCounts[4] * 10 / branch.rate.usersCount);
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
    public showRate(ev, branch: IBranch) {
        this.auth.isLoggedIn().then(loggedIn => {
            if (loggedIn) {
                this.showPopover(branch);
            } else {
                this.auth.loginWithFacebook().then(successfulLogin => {
                    if (successfulLogin) {
                        this.showPopover(branch);
                    }
                });
            }
        });
    }
    public showPopover(branch: IBranch) {
        const popover = this.popoverCtrl.create(BranchRatePopover,
                                                { branch, branches: this.restaurant.branches },
                                                { cssClass: "wide-popover top-popover" }
        );
        popover.present();
    }
    public onBackButton() {
        this.navCtrl.parent.select(0); // this.navCtrl.parent.parent.pop(); switch to first tab because it feels natural
    }
}
