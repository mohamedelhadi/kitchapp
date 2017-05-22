import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, PopoverController } from "ionic-angular";
import { BasePage } from "../../";
import { Configuration } from "../../../environments/env.config";
import { AppSettings } from "../../../app/services/";
import { Logger, UI } from "../../../app/helpers/";
import { BranchesData } from "./branches.data";
import { IRestaurant, IBranch } from "../../../contracts/";
import { Subject } from "rxjs/Subject";
import { LocationPopover } from "./location/location.popover";
import { PhonesPopover } from "./phones/phones.popover";
import { BranchRatePopover } from "./rate/rate.popover";

@Component({
    selector: "page-branches",
    templateUrl: "branches.html"
})
export class Branches extends BasePage {
    restaurant: IRestaurant;
    leavingTab = new Subject(); // because navCtrl.willLeave event doesn't fire for tabs
    constructor(
        private config: Configuration, private appSettings: AppSettings, private logger: Logger, private ui: UI,
        private navCtrl: NavController, private navParams: NavParams, private popoverCtrl: PopoverController,
        private data: BranchesData) {
        super(config, appSettings, logger);
        this.restaurant = navParams.data;
    }
    ionViewDidLoad() {
        this.data.getRestaurantBranches(this.restaurant.id)
            .takeUntil(this.navCtrl.viewWillLeave.merge(this.leavingTab))
            .subscribe(branches => {
                branches.forEach(branch => {
                    branch.rate.rated1 = Math.floor(branch.rate.ratesCounts[0] * 10 / branch.rate.usersCount);
                    branch.rate.rated2 = Math.floor(branch.rate.ratesCounts[1] * 10 / branch.rate.usersCount);
                    branch.rate.rated3 = Math.floor(branch.rate.ratesCounts[2] * 10 / branch.rate.usersCount);
                    branch.rate.rated4 = Math.floor(branch.rate.ratesCounts[3] * 10 / branch.rate.usersCount);
                    branch.rate.rated5 = Math.floor(branch.rate.ratesCounts[4] * 10 / branch.rate.usersCount);
                });
                this.restaurant.branches = branches;
            });
    }
    showLocation(ev, branch: IBranch) {
        const popover = this.popoverCtrl.create(LocationPopover,
            { branch },
            { cssClass: "wide-popover" }
        );
        popover.present();
    }
    showPhones(ev, branch: IBranch) {
        const popover = this.popoverCtrl.create(PhonesPopover,
            { branch },
            { cssClass: "wide-popover" }
        );
        popover.present();
    }
    showRate(ev, branch: IBranch) {
        const firstTime = true;
        if (firstTime) {
            const popover = this.popoverCtrl.create(BranchRatePopover,
                { branch, branches: this.restaurant.branches },
                { cssClass: "wide-popover" }
            );
            popover.present();
        } else {
            this.ui.showToast("You have already rated this branch!");
        }
    }
    back() {
        this.navCtrl.parent.select(0); // this.navCtrl.parent.parent.pop(); switch to first tab because it feels natural
        this.leavingTab.next();
    }
}
