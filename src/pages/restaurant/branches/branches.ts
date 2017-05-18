import { Component, OnInit } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { BasePage } from "../../";
import { Configuration } from "../../../environments/env.config";
import { AppSettings } from "../../../app/services/";
import { Logger } from "../../../app/helpers/";
import { BranchesData } from "./branches.data";
import { IRestaurant } from "../../../contracts/";
import { Subject } from "rxjs/Subject";

@Component({
    selector: "page-branches",
    templateUrl: "branches.html"
})
export class Branches extends BasePage implements OnInit {
    restaurant: IRestaurant;
    leavingTab = new Subject(); // because navCtrl.willLeave event doesn't fire for tabs
    constructor(
        private config: Configuration, private appSettings: AppSettings, private logger: Logger,
        private navCtrl: NavController, private navParams: NavParams,
        private data: BranchesData) {
        super(config, appSettings, logger);
        this.restaurant = navParams.data;
    }
    ngOnInit() {
        // init
    }
    back() {
        this.navCtrl.parent.parent.pop();
        this.leavingTab.next();
    }
}
